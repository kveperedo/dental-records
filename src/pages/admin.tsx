import type { GetServerSideProps, NextPage } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import { isUserAdmin } from '~/server/utils/isUserAdmin';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session || !session.user.email) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return { props: { isAdmin: isUserAdmin(session.user.email) } };
};

const AdminPage: NextPage<{ isAdmin: boolean }> = ({ isAdmin }) => {
    return <MainLayout isAdmin={isAdmin}>Admin</MainLayout>;
};

export default AdminPage;
