import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';

const MAX_NUMBER_OF_CLINICS_PER_QUERY = 20;

export const clinicRouter = createTRPCRouter({
    getClinicPageCount: adminProcedure
        .input(z.string().optional())
        .query(async ({ ctx, input: searchTerm }) => {
            const count = await ctx.prisma.clinic.count({
                where: { name: { contains: searchTerm } },
            });

            return Math.ceil(count / MAX_NUMBER_OF_CLINICS_PER_QUERY);
        }),
    listClinics: adminProcedure
        .input(
            z.object({
                pageNumber: z.number().min(1),
                searchTerm: z.string().optional(),
            })
        )
        .query(async ({ ctx, input: { pageNumber, searchTerm } }) => {
            const clinics = await ctx.prisma.clinic.findMany({
                skip: (pageNumber - 1) * MAX_NUMBER_OF_CLINICS_PER_QUERY,
                take: MAX_NUMBER_OF_CLINICS_PER_QUERY,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                },
                where: { name: { contains: searchTerm } },
            });

            return clinics;
        }),
    getClinicDetailsById: adminProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return ctx.prisma.clinic.findUnique({
                where: { id: input },
            });
        }),
    addClinic: adminProcedure
        .input(
            z.object({
                name: z.string(),
                address: z.string(),
                emails: z.array(z.string().email()),
            })
        )
        .mutation(async ({ ctx, input: { address, name, emails } }) => {
            const clinic = await ctx.prisma.clinic.create({
                data: { address, name },
            });

            await ctx.prisma.user.updateMany({
                where: { email: { in: emails } },
                data: { clinicId: clinic.id },
            });

            return clinic;
        }),
    updateClinic: adminProcedure
        .input(
            z.object({
                clinicId: z.string(),
                name: z.string().optional(),
                address: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input: { clinicId, address, name } }) => {
            const clinic = await ctx.prisma.clinic.update({
                where: { id: clinicId },
                data: { address, name },
            });

            return clinic;
        }),
    deleteClinic: adminProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: clinicId }) => {
            const clinic = await ctx.prisma.clinic.delete({
                where: { id: clinicId },
            });

            return clinic;
        }),
    listClinicUsersById: adminProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return ctx.prisma.user.findMany({
                where: { clinicId: input },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
                orderBy: { name: 'asc' },
            });
        }),
    removeClinicUser: adminProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: userId }) => {
            const clinicUser = await ctx.prisma.user.update({
                where: { id: userId },
                data: { clinicId: null },
            });

            return clinicUser;
        }),
    addClinicUser: adminProcedure
        .input(z.object({ clinicId: z.string(), email: z.string() }))
        .mutation(async ({ ctx, input: { clinicId, email } }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found. Please check the email address and try again.',
                });
            }

            if (user.clinicId) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'User already belongs to a clinic. Please remove them from their current clinic first.',
                });
            }

            const clinicUser = await ctx.prisma.user.update({
                where: { email },
                data: { clinicId },
            });

            return clinicUser;
        }),
});
