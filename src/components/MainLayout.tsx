import type { PropsWithChildren } from 'react';

import { Inter } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const sansFont = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

type MainLayoutProps = PropsWithChildren<{
    showHeader?: boolean;
    className?: string;
}>;

const MainLayout = ({
    children,
    showHeader = true,
    className,
}: MainLayoutProps) => {
    const { data: sessionData } = useSession();

    return (
        <div
            className={twMerge(
                'flex min-h-screen flex-col',
                sansFont.className,
                'font-sans'
            )}
        >
            {showHeader && sessionData && (
                <header className='flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-8 py-4'>
                    <span className='flex items-center gap-2 font-semibold'>
                        Dental Records
                    </span>
                    {sessionData && (
                        <button
                            onClick={() => void signOut()}
                            className='flex items-center gap-3 rounded border border-zinc-200 px-6 py-2 font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-100'
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
