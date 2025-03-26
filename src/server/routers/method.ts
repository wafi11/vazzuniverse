import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { Prisma } from '@prisma/client';
import { methodschema } from '@/types/schema/method';

export const methods = router({
  getMethods: publicProcedure
    .input(
      z
        .object({
          code: z.string(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const where: Prisma.MethodWhereInput = {};

        if (input?.code) {
          where.code = input.code;
        }

        const method = await ctx.prisma.method.findMany({
          where : {
            ...where,
            isActive : true,
          }
        });

        return {
          data: method,
          status: 200,
          message: 'Methods delivered successfully',
        };
      } catch (error) {
        console.error('Error fetching methods:', error);
        throw new Error('Failed to fetch methods');
      }
    }),

  // Create method (existing procedure)
  create: publicProcedure
    .input(methodschema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newMethod = await ctx.prisma.method.create({
          data: { ...input },
        });

        return {
          data: newMethod,
          status: true,
          message: 'Method created successfully',
        };
      } catch (error) {
        return {
          data: null,
          status: false,
          message: 'Failed to create method',
        };
      }
    }),

  // Update method (new procedure)
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: methodschema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedMethod = await ctx.prisma.method.update({
          where: { id: input.id },
          data: input.data,
        });

        return {
          data: updatedMethod,
          status: true,
          message: 'Method updated successfully',
        };
      } catch (error) {        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle specific Prisma errors
          if (error.code === 'P2025') {
            return {
              data: null,
              status: false,
              message: 'Method not found',
            };
          }
        }

        return {
          data: null,
          status: false,
          message: 'Failed to update method',
        };
      }
    }),

  // Delete method (new procedure)
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(), 
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedMethod = await ctx.prisma.method.delete({
          where: { id: input.id },
        });

        return {
          data: deletedMethod,
          status: true,
          message: 'Method deleted successfully',
        };
      } catch (error) {        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle specific Prisma errors
          if (error.code === 'P2025') {
            return {
              data: null,
              status: false,
              message: 'Method not found',
            };
          }
        }

        return {
          data: null,
          status: false,
          message: 'Failed to delete method',
        };
      }
    }),
});