import type { PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import AnchorLinks from './AnchorLinks';
import { api } from '~/utils/api';
import Loading from './Loading';

type MainLayoutProps = PropsWithChildren<{
    showHeader?: boolean;
    className?: string;
}>;

const MainLayout = ({ children, className }: MainLayoutProps) => {
    const { data: sessionData } = useSession();
    const { data: isAdmin, isLoading } = api.admin.isAdmin.useQuery();

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
                        <button
                            onClick={() => void signOut()}
                            className='my-2 flex items-center justify-center gap-3 rounded border border-zinc-200 px-6 py-2 font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-100'
                        >
                            {sessionData.user.image && (
                                <Image
                                    className='rounded-full'
                                    src={sessionData.user.image}
                                    alt='user image'
                                    width={24}
                                    height={24}
                                />
                            )}
                            <span>Sign out</span>
                        </button>
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
