import type { AppProps } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import { Inter } from 'next/font/google';
import Toaster from '~/components/Toaster';
import Tooltip from '~/components/Tooltip';
import { AlertDialogProvider } from '~/context/AlertDialogContext';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
    Component: NextPageWithLayout;
};

const sansFont = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
    const getLayout = Component.getLayout || ((page: ReactNode) => page);

    const layout = getLayout(<Component {...pageProps} />);

    return (
        <SessionProvider session={session}>
            <AlertDialogProvider>
                <Tooltip.Provider>
                    <div className={sansFont.className}>
                        {layout}
                        <Toaster />
                        <style jsx global>{`
                            :root {
                                --font-sans: ${sansFont.style.fontFamily};
                            }
                        `}</style>
                    </div>
                </Tooltip.Provider>
            </AlertDialogProvider>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
