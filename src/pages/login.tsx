import type { GetServerSideProps, NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { getServerAuthSession } from '~/server/auth';
import { GoogleLogo } from '@phosphor-icons/react';
import { Button } from '~/components/Button';

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
        <div className='h-screen bg-zinc-100'>
            <main className='container m-auto flex h-screen flex-1 flex-col items-center justify-center gap-4'>
                <div className='mx-4 flex flex-col items-center rounded-md border border-zinc-200 bg-zinc-50 p-6 sm:mx-0 sm:w-96'>
                    <h1 className='mb-2 text-4xl font-bold text-zinc-700'>
                        Welcome!
                    </h1>
                    <p className='mb-10 text-zinc-500'>
                        Login to access dental records
                    </p>
                    <Button onClick={() => void handleSignIn()}>
                        <GoogleLogo
                            weight='bold'
                            className='mr-2 h-6 w-6 text-inherit'
                        />
                        <span>Sign in with Google</span>
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
