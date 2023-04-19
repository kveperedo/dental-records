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
