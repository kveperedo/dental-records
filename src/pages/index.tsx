import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { getServerAuthSession } from '~/server/auth';
import MainLayout from '~/components/MainLayout';
import { isUserAdmin } from '~/server/utils/isUserAdmin';
import type { Session } from 'next-auth';

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

    return { props: { session, isAdmin: isUserAdmin(session.user.email) } };
};

const HomePage: NextPage<{ session: Session; isAdmin: boolean }> = ({
    isAdmin,
}) => {
    // const hello = api.example.hello.useQuery({ text: 'from tRPC' });

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name='description' content='Generated by create-t3-app' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <MainLayout isAdmin={isAdmin}>
                <div className='flex-1'>Main content</div>
            </MainLayout>
        </>
    );
};

export default HomePage;
