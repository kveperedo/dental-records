import type { PropsWithChildren } from 'react';

import { Inter } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import AnchorLinks from './AnchorLinks';

const sansFont = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

type MainLayoutProps = PropsWithChildren<{
    showSidebar?: boolean;
    className?: string;
    isAdmin?: boolean;
}>;

const MainLayout = ({
    children,
    showSidebar = true,
    isAdmin = false,
    className,
}: MainLayoutProps) => {
    const { data: sessionData } = useSession();

    return (
        <div
            className={twMerge(
                'flex min-h-screen',
                sansFont.className,
                'font-sans'
            )}
        >
            {showSidebar && sessionData && (
                <aside className='flex w-72 flex-col items-center border-r border-zinc-200 bg-zinc-50 p-6'>
                    <span className='mb-8 flex self-start text-xl font-semibold'>
                        Dental Records
                    </span>

                    <AnchorLinks isAdmin={isAdmin} />
                    {sessionData && (
                        <button
                            onClick={() => void signOut()}
                            className='mt-auto flex w-full items-center justify-center gap-3 rounded border border-zinc-200 px-6 py-2 font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-100'
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
                </aside>
            )}
            <main
                className={twMerge(
                    'flex flex-1 flex-col bg-zinc-100',
                    className
                )}
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
