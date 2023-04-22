import { Prisma } from '@prisma/client';
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
                address: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input: { address, name } }) => {
            return await ctx.prisma.clinic.create({
                data: { address, name },
            });
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
            const users = await ctx.prisma.clinicUser.findMany({
                where: { clinicId: input },
                select: {
                    email: true,
                    User: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    User: {
                        name: 'asc',
                    },
                },
            });

            return users
                .map(({ email, User }) => {
                    return { email, name: User?.name ?? null };
                })
                .sort((a, b) => {
                    if (a.name === null) {
                        return 1;
                    }

                    if (b.name === null) {
                        return -1;
                    }

                    return 0;
                });
        }),
    removeClinicUser: adminProcedure
        .input(z.string())
        .mutation(async ({ ctx, input: email }) => {
            return ctx.prisma.clinicUser.delete({
                where: { email },
            });
        }),
    addClinicUser: adminProcedure
        .input(z.object({ clinicId: z.string(), email: z.string() }))
        .mutation(async ({ ctx, input: { clinicId, email } }) => {
            try {
                const existingUser = await ctx.prisma.clinicUser.findUnique({
                    where: { email },
                });

                if (existingUser) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'User already exists in this clinic.',
                    });
                }

                const user = await ctx.prisma.clinicUser.create({
                    data: {
                        clinicId,
                        email,
                    },
                });

                return user;
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    // Unique constraint failed
                    if (error.code === 'P2002') {
                        throw new TRPCError({
                            code: 'INTERNAL_SERVER_ERROR',
                            message:
                                'User already belongs to a clinic. Please remove them from their current clinic first.',
                        });
                    }
                }

                throw error;
            }
        }),
});
