import type { GetServerSideProps, NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '~/components/Layout';
import { getServerAuthSession } from '~/server/auth';
import { GoogleLogo } from '@phosphor-icons/react';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return { props: {} };
    }

    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };
};

const LoginPage: NextPage = () => {
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const response = await signIn('google');

            if (!response?.ok) {
                throw new Error(response?.error);
            }

            void router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout
            className='container m-auto items-center justify-center gap-4'
            showHeader={false}
        >
            <div className='flex w-full flex-col items-center rounded-md md:border p-6 md:w-96 md:shadow-sm'>
                <h1 className='mb-2 text-4xl font-bold text-zinc-700'>
                    Welcome!
                </h1>
                <p className='mb-10 text-lg text-zinc-500'>Login to access dental records</p>
                <button
                    className='flex w-full items-center justify-center gap-2 rounded bg-zinc-700 px-6 py-3 text-zinc-200 transition-colors hover:bg-zinc-800'
                    onClick={() => void handleSignIn()}
                >
                    <GoogleLogo
                        weight='bold'
                        className='h-6 w-6 text-inherit'
                    />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </Layout>
    );
};

export default LoginPage;
