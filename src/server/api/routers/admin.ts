import { z } from 'zod';
import {
    adminProcedure,
    createTRPCRouter,
    protectedProcedure,
} from '~/server/api/trpc';
import { isUserAdmin } from '~/server/utils/isUserAdmin';

const MAX_NUMBER_OF_CLINICS_PER_QUERY = 20;

export const adminRouter = createTRPCRouter({
    isAdmin: protectedProcedure.query(({ ctx }) => {
        if (!ctx.session.user.email) {
            return false;
        }

        return isUserAdmin(ctx.session.user.email);
    }),
    getClinicPageCount: adminProcedure.query(async ({ ctx }) => {
        const count = await ctx.prisma.clinic.count();

        return Math.ceil(count / MAX_NUMBER_OF_CLINICS_PER_QUERY);
    }),
    listClinics: adminProcedure
        .input(
            z.object({
                pageNumber: z.number().min(1),
            })
        )
        .query(async ({ ctx, input: { pageNumber } }) => {
            const clinics = await ctx.prisma.clinic.findMany({
                skip: (pageNumber - 1) * MAX_NUMBER_OF_CLINICS_PER_QUERY,
                take: MAX_NUMBER_OF_CLINICS_PER_QUERY,
                orderBy: { name: 'asc' },
            });

            return clinics;
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
    addClinicUsers: adminProcedure
        .input(z.object({ clinicId: z.string(), email: z.array(z.string()) }))
        .mutation(async ({ ctx, input: { clinicId, email } }) => {
            const clinicUser = await ctx.prisma.user.updateMany({
                where: { email: { in: email } },
                data: { clinicId },
            });

            return clinicUser;
        }),
});
