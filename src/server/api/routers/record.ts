import { z } from 'zod';
import { addRecordSchema } from '~/feature/record/constants';
import { clinicProcedure, createTRPCRouter } from '~/server/api/trpc';

const MAX_NUMBER_OF_RECORD_PER_QUERY = 20;

export const recordRouter = createTRPCRouter({
    getRecordPageCount: clinicProcedure
        .input(
            z.object({
                clinicId: z.string(),
                searchTerm: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { clinicId, searchTerm } }) => {
            const count = await ctx.prisma.record.count({
                where: { clinicId, name: { contains: searchTerm } },
            });

            return Math.ceil(count / MAX_NUMBER_OF_RECORD_PER_QUERY);
        }),
    listRecords: clinicProcedure
        .input(
            z.object({
                clinicId: z.string(),
                pageNumber: z.number().min(1),
                searchTerm: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { clinicId, pageNumber, searchTerm } }) => {
            const records = await ctx.prisma.record.findMany({
                skip: (pageNumber - 1) * MAX_NUMBER_OF_RECORD_PER_QUERY,
                take: MAX_NUMBER_OF_RECORD_PER_QUERY,
                orderBy: { name: 'asc' },
                where: { clinicId, name: { contains: searchTerm } },
            });

            return records;
        }),
    addRecord: clinicProcedure
        .input(
            addRecordSchema.omit({ birthDate: true }).extend({
                clinicId: z.string(),
                birthDate: z.date(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const record = await ctx.prisma.record.create({
                data: input,
            });

            return record;
        }),
});
