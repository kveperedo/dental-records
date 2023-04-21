import type { PropsWithChildren } from 'react';

type EmptyContentProps = PropsWithChildren<{
    title?: string;
    description?: string;
}>;

const EmptyContent = ({ title, description, children }: EmptyContentProps) => {
    return (
        <div className='flex flex-col items-center gap-1'>
            <p className='text-center text-xl font-semibold'>{title}</p>
            <p className='mb-2 text-center text-sm text-zinc-600'>
                {description}
            </p>
            {children}
        </div>
    );
};

export default EmptyContent;
