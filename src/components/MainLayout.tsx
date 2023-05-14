import type { PropsWithChildren } from 'react';

import { twMerge } from 'tailwind-merge';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import AnchorLinks from './AnchorLinks';
import { api } from '~/utils/api';
import { Button } from './Button';
import DropdownMenu from './DropdownMenu';
import { SignOut } from '@phosphor-icons/react';

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
        return null;
    }

    return (
        <div className='flex h-screen flex-col'>
            {sessionData && (
                <header className='border-b border-zinc-200 bg-zinc-50'>
                    <div className='container mx-auto flex items-stretch justify-between px-2 sm:px-0'>
                        <AnchorLinks isAdmin={isAdmin} />
                        {sessionData && (
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <Button className='my-2' variant='ghost'>
                                        {sessionData.user.image && (
                                            <Image
                                                className='mr-2 rounded-full'
                                                src={sessionData.user.image}
                                                alt='user image'
                                                width={24}
                                                height={24}
                                            />
                                        )}
                                        <p>{sessionData.user.name}</p>
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content className='w-44' align='end'>
                                    <DropdownMenu.Label>My Account</DropdownMenu.Label>
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item
                                        onSelect={() => void signOut()}
                                    >
                                        <SignOut className='mr-2 h-4 w-4' />
                                        <span>Sign out</span>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        )}
                    </div>
                </header>
            )}
            <main
                className={twMerge('flex flex-1 flex-col overflow-hidden bg-zinc-100', className)}
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
