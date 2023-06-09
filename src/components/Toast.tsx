import { X } from '@phosphor-icons/react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';

//  ---------------------------------------
//  Provider
//  ---------------------------------------

const Provider = ToastPrimitives.Provider;

//  ---------------------------------------
//  Viewport
//  ---------------------------------------

const Viewport = forwardRef<
    React.ElementRef<typeof ToastPrimitives.Viewport>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Viewport
        ref={ref}
        className={twMerge(
            'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
            className
        )}
        {...props}
    />
));
Viewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
    'data-[swipe=move]:transition-none grow-1 group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow transition-all data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4 data-[state=closed]:slide-out-to-right-full  last:mt-0 sm:last:mt-4',
    {
        variants: {
            variant: {
                default: 'bg-white border-zinc-200',
                destructive:
                    'group destructive bg-red-600 text-zinc-50 border-red-600',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = forwardRef<
    React.ElementRef<typeof ToastPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
        VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
    return (
        <ToastPrimitives.Root
            ref={ref}
            className={twMerge(toastVariants({ variant }), className)}
            {...props}
        />
    );
});
Root.displayName = ToastPrimitives.Root.displayName;

//  ---------------------------------------
//  Action
//  ---------------------------------------

const Action = forwardRef<
    React.ElementRef<typeof ToastPrimitives.Action>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Action
        ref={ref}
        className={twMerge(
            'default-focus inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-transparent px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-red-100 group-[.destructive]:hover:border-zinc-50 group-[.destructive]:hover:bg-red-100 group-[.destructive]:hover:text-red-600 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
            className
        )}
        {...props}
    />
));
Action.displayName = ToastPrimitives.Action.displayName;

//  ---------------------------------------
//  Action
//  ---------------------------------------

const Close = forwardRef<
    React.ElementRef<typeof ToastPrimitives.Close>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Close
        ref={ref}
        className={twMerge(
            'absolute right-2 top-2 rounded-md p-1 text-zinc-500 transition-opacity hover:text-zinc-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 sm:opacity-0',
            className
        )}
        toast-close=''
        {...props}
    >
        <X className='h-4 w-4' />
    </ToastPrimitives.Close>
));
Close.displayName = ToastPrimitives.Close.displayName;

//  ---------------------------------------
//  Title
//  ---------------------------------------

const Title = forwardRef<
    React.ElementRef<typeof ToastPrimitives.Title>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Title
        ref={ref}
        className={twMerge('text-sm font-semibold', className)}
        {...props}
    />
));
Title.displayName = ToastPrimitives.Title.displayName;

//  ---------------------------------------
//  Title
//  ---------------------------------------

const Description = forwardRef<
    React.ElementRef<typeof ToastPrimitives.Description>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
    <ToastPrimitives.Description
        ref={ref}
        className={twMerge('text-sm', className)}
        {...props}
    />
));
Description.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Root>;

type ToastActionElement = React.ReactElement<typeof Action>;

const Toast = {
    Provider,
    Viewport,
    Root,
    Title,
    Description,
    Close,
    Action,
};

export { type ToastProps, type ToastActionElement };

export default Toast;
