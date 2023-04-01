import type { PropsWithChildren } from 'react';

import { Inter } from 'next/font/google';
import { twMerge } from 'tailwind-merge';

const sansFont = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

type LayoutProps = PropsWithChildren<{
    showHeader?: boolean;
    className?: string;
}>;

const Layout = ({ children, showHeader = true, className }: LayoutProps) => {
    return (
        <div
            className={twMerge(
                'flex min-h-screen flex-col',
                sansFont.className,
                'font-sans'
            )}
        >
            {showHeader && <header className=''>Header</header>}
            <main className={twMerge('flex flex-1 flex-col', className)}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
