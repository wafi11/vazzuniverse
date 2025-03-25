import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { handleOrderStatusChange } from '@/lib/whatsapp-message';

export async function POST(req: NextRequest) {
  let logId: string = ''


  try {
    // Create initial log entry
    const initialLog = await prisma.systemLog.create({
      data: {
        action: 'DIGIFLAZZ_CALLBACK_RECEIVED',
        status: 'STARTED',
        metadata: JSON.stringify({
          timestamp: new Date(),
          method: 'POST'
        })
      }
    });
    logId = initialLog.id;

    // Parse the callback data from Digiflazz
    const callbackData = await req.json();
    
    // Update log with raw callback data
    await prisma.systemLog.update({
      where: { id: logId },
      data: {
        details: JSON.stringify(callbackData),
        metadata: JSON.stringify({
          ...JSON.parse(initialLog.metadata || '{}'),
          rawCallbackReceived: true
        })
      }
    });

    const {
      ref_id,
      buyer_sku_code,
      customer_no,
      status,
      message,
      sn,
    } = callbackData.data;

    const referenceId = ref_id;

    // Validate required parameters
    if (!referenceId || !buyer_sku_code || !customer_no) {
      await prisma.systemLog.update({
        where: { id: logId },
        data: {
          status: 'FAILED',
          action: 'PARAMETER_VALIDATION',
          details: 'Missing required parameters',
          errorMessage: 'Terdapat parameter yang kosong'
        }
      });

      return NextResponse.json({
        data: {
          status: "2",
          message: "Terdapat parameter yang kosong",
          rc: "07"
        }
      });
    }

    // Normalize status
    const normalizedStatus = status ? status.trim().toLowerCase() : '';
    const purchaseStatus = normalizedStatus === 'sukses' ? 'SUCCESS' : 'FAILED';

    // Use transaction to ensure data integrity
    return await prisma.$transaction(async (tx) => {
      // Log transaction start
      await tx.systemLog.update({
        where: { id: logId },
        data: {
          action: 'TRANSACTION_STARTED',
          details: `Processing reference ID: ${referenceId}`
        }
      });

      // Find the pembelian record
      const pembelian = await tx.pembelian.findFirst({
        where: { refId: referenceId }
      });
      // Log pembelian lookup
      await tx.systemLog.update({
        where: { id: logId },
        data: {
          action: 'PEMBELIAN_LOOKUP',
          details: pembelian 
            ? `Pembelian found: ${pembelian.id}` 
            : 'Pembelian not found'
        }
      });

      if (!pembelian) {
        await tx.systemLog.update({
          where: { id: logId },
          data: {
            status: 'FAILED',
            action: 'PEMBELIAN_NOT_FOUND',
            errorMessage: `No pembelian found for ref_id: ${referenceId}`
          }
        });

        throw new Error('Pembelian tidak ditemukan');
      }

      // Find associated pembayaran
      const pembayaran = await tx.pembayaran.findFirst({
        where: { orderId: pembelian?.orderId }
      });


      // Log pembayaran details
      await tx.systemLog.update({
        where: { id: logId },
        data: {
          action: 'PEMBAYARAN_LOOKUP',
          details: JSON.stringify({
            orderId: pembayaran?.orderId,
            metode: pembayaran?.metode
          })
        }
      });

      // Special handling for SALDO payment method
      if (pembayaran?.metode === "SALDO") {
        // Log SALDO payment method handling
        await tx.systemLog.create({
          data: {
            parentLogId: logId,
            action: 'SALDO_PAYMENT_HANDLING',
            status: 'PROCESSING',
            details: `Purchase Status: ${purchaseStatus}`
          }
        });
      
        // If transaction fails, refund the balance
        if (purchaseStatus === 'FAILED') {
          // Find user by username from pembelian record
          const user = await tx.users.findFirst({
            where: { 
              username: pembelian.username as string
            }
          });
        
          if (!user) {
            await tx.systemLog.create({
              data: {
                parentLogId: logId,
                action: 'BALANCE_REFUND_FAILED',
                status: 'ERROR',
                errorMessage: 'User not found',
                details: `No user found with username from pembelian: ${pembelian.username}, reference ID: ${referenceId}`
              }
            });
        
            throw new Error(`User not found for username: ${pembelian.username}`);
          }
        
          // Refund balance
          await tx.users.update({
            where: { id: user.id },
            data: { 
              balance: { increment: parseInt(pembayaran.harga) } 
            }
          });
        
          // Log balance refund
          await tx.systemLog.create({
            data: {
              parentLogId: logId,
              action: 'BALANCE_REFUND',
              status: 'SUCCESS',
              details: `Refunded ${pembayaran.harga} to user ${user.id} (${user.username})`
            }
          });
        }
      }
      // Update pembelian record
      const updatedPembelian = await tx.pembelian.update({
        where: { id: pembelian.id },
        data: {
          status: purchaseStatus,
          sn: sn || null,
          log: message || '',
          updatedAt: new Date(),
        }
      });


      await handleOrderStatusChange({
        orderData : {
          amount : pembelian.harga,
          link : `${process.env.NEXTAUTH_URL}/invoice?invoice=${pembelian.orderId}`,
          method : pembayaran?.metode,
          productName : pembelian.layanan,
          status : purchaseStatus,
          customerName : pembelian.username as string,
          orderId : pembelian.orderId,
          whatsapp : pembayaran?.noPembeli
        }
      })

      // Log pembelian update
      await tx.systemLog.update({
        where: { id: logId },
        data: {
          action: 'PEMBELIAN_UPDATE',
          status: 'SUCCESS',
          details: `Updated pembelian ${updatedPembelian.id} with status ${purchaseStatus}`
        }
      });

      // Handle success report
      if (purchaseStatus === 'SUCCESS' && !pembelian.successReportSended) {
        await tx.pembelian.update({
          where: { id: pembelian.id },
          data: { successReportSended: true }
        });

        // Log success report
        await tx.systemLog.create({
          data: {
            parentLogId: logId,
            action: 'SUCCESS_REPORT',
            status: 'SENT',
            details: `Success report sent for pembelian ${pembelian.id}`
          }
        });
      }

      // Update main log as completed
      await tx.systemLog.update({
        where: { id: logId },
        data: {
          status: 'SUCCESS',
          action: 'DIGIFLAZZ_CALLBACK_PROCESSED',
          details: 'Callback processed successfully'
        }
      });

      return NextResponse.json({
        data: {
          status: "0",
          message: "Callback processed successfully",
          rc: "00"
        }
      });
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });

  } catch (error) {
    // Log any unexpected errors
    await prisma.systemLog.update({
      where: { id: logId || undefined },
      data: {
        status: 'FAILED',
        action: 'UNEXPECTED_ERROR',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        details: JSON.stringify(error)
      }
    });

    console.error('DigiFlazz callback error:', error);
    return NextResponse.json({
      data: {
        status: "2",
        message: "System error",
        rc: "99"
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}