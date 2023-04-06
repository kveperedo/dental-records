import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { DOTS, usePagination } from '~/hooks/usePagination';

interface PaginationButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
}

const PaginationButton = ({
    children,
    className,
    isActive,
    ...props
}: PaginationButtonProps) => {
    return (
        <button
            className={twMerge(
                'flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-zinc-700',
                isActive
                    ? 'border-zinc-600 bg-zinc-600 text-zinc-50'
                    : 'enabled:hover:bg-zinc-200',
                props.disabled && 'cursor-not-allowed opacity-70',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

interface PaginationProps {
    total: number;
    initialPage?: number;
    onChange?: (page: number) => void;
}

const Pagination = ({ total, initialPage, onChange }: PaginationProps) => {
    const { range, active, next, previous, setPage } = usePagination({
        total,
        initialPage,
        onChange,
    });

    return (
        <div className='flex justify-center gap-2'>
            <PaginationButton disabled={active === 1} onClick={previous}>
                <CaretLeft className='h-5 w-5 text-inherit' />
            </PaginationButton>
            {range.map((page, index) => {
                if (page === DOTS) {
                    return (
                        <div
                            className='flex h-8 w-8 items-center justify-center'
                            key={`${page}_${index}`}
                        >
                            ...
                        </div>
                    );
                }

                return (
                    <PaginationButton
                        onClick={() => setPage(page)}
                        isActive={page === active}
                        key={page}
                    >
                        {page}
                    </PaginationButton>
                );
            })}
            <PaginationButton disabled={active === total} onClick={next}>
                <CaretRight className='h-5 w-5 text-inherit' />
            </PaginationButton>
        </div>
    );
};

export default Pagination;
