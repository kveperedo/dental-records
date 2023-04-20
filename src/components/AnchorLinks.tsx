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

    const routes = router.route.split('/').filter(Boolean);
    const hrefRoute = href.split('/').filter(Boolean)[0];
    const isActive = routes.includes(hrefRoute ?? '');

    return (
        <a
            className={twMerge(
                'relative flex w-full cursor-pointer items-center gap-3 whitespace-nowrap px-4 text-zinc-500 transition-colors hover:bg-zinc-100',
                isActive
                    ? 'font-semibold text-zinc-700 before:absolute before:bottom-[-1px] before:left-0 before:block before:h-[1px] before:w-full before:bg-zinc-700'
                    : ' hover:text-zinc-800'
            )}
            onClick={() => void router.push(href)}
        >
            <Icon className='h-6 w-6 text-inherit' weight='duotone' />
            <span className='hidden sm:block'>{children}</span>
        </a>
    );
};

const AnchorLinks = ({ isAdmin }: { isAdmin: boolean }) => {
    return (
        <ul className='mr-auto flex'>
            <Link href='/' Icon={AddressBook}>
                Records
            </Link>
            {isAdmin && (
                <Link href='/clinic' Icon={FolderSimpleLock}>
                    Clinic Panel
                </Link>
            )}
        </ul>
    );
};

export default AnchorLinks;
