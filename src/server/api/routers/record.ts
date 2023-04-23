import { z } from 'zod';
import { clinicProcedure, createTRPCRouter } from '~/server/api/trpc';

const MAX_NUMBER_OF_RECORD_PER_QUERY = 20;

export const recordRouter = createTRPCRouter({
    getRecordPageCount: clinicProcedure
        .input(z.string().optional())
        .query(async ({ ctx, input: searchTerm }) => {
            const count = await ctx.prisma.record.count({
                where: { name: { contains: searchTerm } },
            });

            return Math.ceil(count / MAX_NUMBER_OF_RECORD_PER_QUERY);
        }),
    listRecords: clinicProcedure
        .input(
            z.object({
                pageNumber: z.number().min(1),
                searchTerm: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { pageNumber, searchTerm } }) => {
            const records = await ctx.prisma.record.findMany({
                skip: (pageNumber - 1) * MAX_NUMBER_OF_RECORD_PER_QUERY,
                take: MAX_NUMBER_OF_RECORD_PER_QUERY,
                orderBy: { name: 'asc' },
                where: { name: { contains: searchTerm } },
            });

            return records;
        }),
});
