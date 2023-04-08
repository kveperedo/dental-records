'use client';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = AlertDialogPrimitive.Root;

//  ---------------------------------------
//  Trigger
//  ---------------------------------------

const Trigger = AlertDialogPrimitive.Trigger;

//  ---------------------------------------
//  Portal
//  ---------------------------------------

const Portal = ({
    className,
    children,
    ...props
}: AlertDialogPrimitive.AlertDialogPortalProps) => (
    <AlertDialogPrimitive.Portal className={twMerge(className)} {...props}>
        <div className='fixed inset-0 z-50 flex items-end justify-center sm:items-center'>
            {children}
        </div>
    </AlertDialogPrimitive.Portal>
);

//  ---------------------------------------
//  Overlay
//  ---------------------------------------

const Overlay = forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
        className={twMerge(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in',
            className
        )}
        {...props}
        ref={ref}
    />
));
Overlay.displayName = AlertDialogPrimitive.Overlay.displayName;

//  ---------------------------------------
//  Content
//  ---------------------------------------

const Content = forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
    <Portal>
        <Overlay />
        <AlertDialogPrimitive.Content
            ref={ref}
            className={twMerge(
                'fixed z-50 grid w-full max-w-lg scale-100 gap-4 bg-zinc-50 p-6 opacity-100 animate-in fade-in-90 slide-in-from-bottom-10 sm:rounded-lg sm:zoom-in-90 sm:slide-in-from-bottom-0 md:w-full',
                className
            )}
            {...props}
        />
    </Portal>
));
Content.displayName = AlertDialogPrimitive.Content.displayName;

//  ---------------------------------------
//  Header
//  ---------------------------------------

const Header = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={twMerge(
            'flex flex-col space-y-2 text-center sm:text-left',
            className
        )}
        {...props}
    />
);
Header.displayName = 'AlertDialogHeader';

//  ---------------------------------------
//  Footer
//  ---------------------------------------

const Footer = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={twMerge(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            className
        )}
        {...props}
    />
);
Footer.displayName = 'AlertDialogFooter';

//  ---------------------------------------
//  Title
//  ---------------------------------------

const Title = forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
        ref={ref}
        className={twMerge('text-lg font-semibold text-zinc-700', className)}
        {...props}
    />
));
Title.displayName = AlertDialogPrimitive.Title.displayName;

//  ---------------------------------------
//  Description
//  ---------------------------------------

const Description = forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
        ref={ref}
        className={twMerge('text-sm text-zinc-500', className)}
        {...props}
    />
));
Description.displayName = AlertDialogPrimitive.Description.displayName;

const Action = forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Action>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action
        ref={ref}
        className={twMerge(
            'inline-flex h-10 items-center justify-center rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-50 transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
    />
));
Action.displayName = AlertDialogPrimitive.Action.displayName;

const Cancel = forwardRef<
    React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
    React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
        ref={ref}
        className={twMerge(
            'mt-2 inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-transparent px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0',
            className
        )}
        {...props}
    />
));
Cancel.displayName = AlertDialogPrimitive.Cancel.displayName;

const AlertDialog = {
    Root,
    Trigger,
    Content,
    Header,
    Footer,
    Title,
    Description,
    Action,
    Cancel,
};

export default AlertDialog;
