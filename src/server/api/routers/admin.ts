import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { isUserAdmin } from '~/server/utils/isUserAdmin';

export const adminRouter = createTRPCRouter({
    isAdmin: protectedProcedure.query(({ ctx }) => {
        if (!ctx.session.user.email) {
            return false;
        }

        return isUserAdmin(ctx.session.user.email);
    }),
});
