import { z } from 'zod';
import { addRecordSchema } from '~/feature/record/constants';
import { clinicProcedure, createTRPCRouter } from '~/server/api/trpc';

const MAX_NUMBER_OF_RECORD_PER_QUERY = 20;

export const recordRouter = createTRPCRouter({
    getRecordPageCount: clinicProcedure
        .input(z.string().optional())
        .query(async ({ ctx, input }) => {
            const count = await ctx.prisma.record.count({
                where: { clinicId: ctx.session.user.clinicId, name: { contains: input } },
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
                where: { clinicId: ctx.session.user.clinicId, name: { contains: searchTerm } },
            });

            return records;
        }),
    addRecord: clinicProcedure
        .input(
            addRecordSchema.omit({ birthDate: true }).extend({
                birthDate: z.date(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const record = await ctx.prisma.record.create({
                data: { ...input, clinicId: ctx.session.user.clinicId },
            });

            return record;
        }),
    getRecordDetailsById: clinicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        return ctx.prisma.record.findUnique({
            where: { id: input },
        });
    }),
    updateRecord: clinicProcedure
        .input(
            addRecordSchema.omit({ birthDate: true }).extend({
                birthDate: z.date(),
                recordId: z.string(),
            })
        )
        .mutation(async ({ ctx, input: { recordId, ...data } }) => {
            const record = await ctx.prisma.record.update({
                where: { id: recordId },
                data,
            });

            return record;
        }),
    deleteRecord: clinicProcedure.input(z.string()).mutation(async ({ ctx, input: recordId }) => {
        const record = await ctx.prisma.record.delete({
            where: { id: recordId },
        });

        return record;
    }),
});
