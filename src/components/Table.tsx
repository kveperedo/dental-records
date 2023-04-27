import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

//  ---------------------------------------
//  Root
//  ---------------------------------------

type RootProps = PropsWithChildren<{
    className?: string;
}>;

const Root = ({ className, children }: RootProps) => {
    return (
        <div
            className={twMerge(
                'flex h-full w-full flex-1 flex-col overflow-hidden rounded border border-zinc-200 bg-zinc-50',
                className
            )}
        >
            {children}
        </div>
    );
};

//  ---------------------------------------
//  Title
//  ---------------------------------------

type TitleProps = PropsWithChildren<{
    className?: string;
}>;

const Title = ({ className, children }: TitleProps) => {
    return (
        <div className={twMerge('flex items-center justify-between p-4', className)}>
            {children}
        </div>
    );
};

//  ---------------------------------------
//  Footer
//  ---------------------------------------

type FooterProps = PropsWithChildren<{
    className?: string;
}>;

const Footer = ({ className, children }: FooterProps) => {
    return (
        <footer
            className={twMerge(
                'flex items-center justify-center gap-4 border-t border-zinc-200 p-4',
                className
            )}
        >
            {children}
        </footer>
    );
};

//  ---------------------------------------
//  Header
//  ---------------------------------------

type HeaderProps = PropsWithChildren<{
    className?: string;
}>;

const Header = ({ className, children }: HeaderProps) => {
    return <div className={twMerge('flex border-b border-zinc-200', className)}>{children}</div>;
};

//  ---------------------------------------
//  HeaderCell
//  ---------------------------------------

type HeaderCellProps = PropsWithChildren<{
    className?: string;
}>;

const HeaderCell = ({ className, children }: HeaderCellProps) => {
    return (
        <div
            className={twMerge(
                'px-4 py-2 text-left text-sm font-semibold text-zinc-700',
                className
            )}
        >
            {children}
        </div>
    );
};

//  ---------------------------------------
//  Row
//  ---------------------------------------

type RowProps = PropsWithChildren<{
    className?: string;
    onClick?: () => void;
}>;

const Row = ({ className, children, onClick }: RowProps) => {
    return (
        <div
            tabIndex={0}
            onClick={onClick}
            className={twMerge(
                'flex cursor-pointer transition-colors hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none active:bg-zinc-200',
                className
            )}
        >
            {children}
        </div>
    );
};

//  ---------------------------------------
//  Cell
//  ---------------------------------------

type CellProps = PropsWithChildren<{
    className?: string;
    isLast?: boolean;
}>;

const Cell = ({ className, children, isLast }: CellProps) => {
    return (
        <div
            className={twMerge(
                'flex items-center border-b border-zinc-200 px-4 py-2',
                isLast && 'border-transparent',
                className
            )}
        >
            {children}
        </div>
    );
};

const Table = {
    Root,
    Title,
    Header,
    HeaderCell,
    Row,
    Cell,
    Footer,
};

export default Table;
