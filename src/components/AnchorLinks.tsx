import { AddressBook, FolderSimpleLock } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

const Link = ({
    href,
    Icon,
    children,
}: PropsWithChildren<{ href: string; Icon: Icon }>) => {
    const router = useRouter();

    return (
        <a
            className={twMerge(
                'flex w-full cursor-pointer items-center gap-4 rounded border border-transparent px-6 py-4  text-zinc-600 transition-colors',
                router.pathname === href
                    ? 'shadow-inner- border-zinc-200 bg-zinc-200 font-semibold text-zinc-800'
                    : ' hover:bg-zinc-100 hover:text-zinc-800'
            )}
            onClick={() => void router.push(href)}
        >
            <Icon className='h-6 w-6 text-inherit' weight='duotone' />
            {children}
        </a>
    );
};

const AnchorLinks = ({ isAdmin }: { isAdmin: boolean }) => {
    return (
        <ul className='flex w-full flex-col gap-2'>
            <Link href='/' Icon={AddressBook}>
                Records
            </Link>
            {isAdmin && (
                <Link href='/admin' Icon={FolderSimpleLock}>
                    Admin Panel
                </Link>
            )}
        </ul>
    );
};

export default AnchorLinks;
