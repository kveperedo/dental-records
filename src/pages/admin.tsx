import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from './_app';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return { props: {} };
};

const AdminPage: NextPageWithLayout = () => {
    return <div>Admin</div>
};

AdminPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default AdminPage;
