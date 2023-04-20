import type { PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import AnchorLinks from './AnchorLinks';
import { api } from '~/utils/api';
import Loading from './Loading';
import { Button } from './Button';

type MainLayoutProps = PropsWithChildren<{
    showHeader?: boolean;
    className?: string;
}>;

const MainLayout = ({ children, className }: MainLayoutProps) => {
    const { data: sessionData } = useSession();
    const { data: isAdmin, isLoading } = api.admin.isAdmin.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    if (isLoading || isAdmin === undefined) {
        return (
            <div className='h-screen w-screen'>
                <Loading />
            </div>
        );
    }

    return (
        <div className='flex h-screen flex-col'>
            {sessionData && (
                <header className='flex items-stretch justify-between border-b border-zinc-200 bg-zinc-50 px-8'>
                    <AnchorLinks isAdmin={isAdmin} />
                    {sessionData && (
                        <Button
                            className='my-2'
                            variant='outline'
                            onClick={() => void signOut()}
                        >
                            {sessionData.user.image && (
                                <Image
                                    className='rounded-full mr-2'
                                    src={sessionData.user.image}
                                    alt='user image'
                                    width={24}
                                    height={24}
                                />
                            )}
                            <span>Sign out</span>
                        </Button>
                    )}
                </header>
            )}
            <main
                className={twMerge(
                    'flex flex-1 flex-col overflow-hidden bg-zinc-100',
                    className
                )}
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
