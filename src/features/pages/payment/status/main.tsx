'use client';
import { trpc } from '@/utils/trpc';
import FlowProgress from './flow-number';
import { HeaderPaymentStatus } from './header';
import { useSearchParams } from 'next/navigation';
import { TransactionDetails } from './transaction';
import { TRANSACTION_FLOW } from '@/types/transaction';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

export function PaymentStatus() {
  const searchParams = useSearchParams();
  const merchantOrderId = searchParams.get('invoice');

  const {data, isLoading} = trpc.pembelian.getId.useQuery(
    { merchantOrderId },
    {
      enabled: !!merchantOrderId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
    }
  )

  if (!merchantOrderId) {
    return <div>No invoice provided</div>
  }

  if(isLoading){
    return <LoadingOverlay />
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:p-8 max-w-7xl">
      <HeaderPaymentStatus status={data?.purchase.status as string} />
      <FlowProgress status={data?.purchase.status as TRANSACTION_FLOW} />
      {data && (
        <TransactionDetails
          data={data.purchase as Transaksi}
        />
      )}
    </main>
  );
}