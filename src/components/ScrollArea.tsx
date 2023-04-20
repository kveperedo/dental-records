import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

//  ---------------------------------------
//  Scrollbar
//  ---------------------------------------

type ScrollbarProps = {
    orientation: 'horizontal' | 'vertical';
};

const Scrollbar = ({ orientation }: ScrollbarProps) => (
    <ScrollAreaPrimitive.Scrollbar
        className='flex touch-none select-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col'
        orientation={orientation}
    >
        <ScrollAreaPrimitive.Thumb className='before:content relative flex-1 rounded-[10px] bg-zinc-300/70 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2' />
    </ScrollAreaPrimitive.Scrollbar>
);

//  ---------------------------------------
//  Corner
//  ---------------------------------------

const Corner = () => <ScrollAreaPrimitive.Corner className='bg-zinc-300' />;

//  ---------------------------------------
//  Root
//  ---------------------------------------

type RootProps = PropsWithChildren<{ className?: string; asChild?: boolean }>;

export const Root = ({ children, className, asChild }: RootProps) => {
    return (
        <ScrollAreaPrimitive.Root
            className={twMerge('overflow-hidden', className)}
            asChild={asChild}
        >
            {children}
        </ScrollAreaPrimitive.Root>
    );
};

//  ---------------------------------------
//  Viewport
//  ---------------------------------------

type ViewportProps = PropsWithChildren<{
    className?: string;
    asChild?: boolean;
}>;

export const Viewport = ({ className, children, asChild }: ViewportProps) => {
    return (
        <>
            <ScrollAreaPrimitive.Viewport
                className={twMerge('h-full w-full', className)}
                asChild={asChild}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <Scrollbar orientation='horizontal' />
            <Scrollbar orientation='vertical' />
            <Corner />
        </>
    );
};

const ScrollArea = { Root, Viewport };

export default ScrollArea;
