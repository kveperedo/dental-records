import * as DialogPrimitive from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import { X } from '@phosphor-icons/react';
import { forwardRef } from 'react';

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = DialogPrimitive.Root;

//  ---------------------------------------
//  Trigger
//  ---------------------------------------

const Trigger = DialogPrimitive.Trigger;

//  ---------------------------------------
//  Portal
//  ---------------------------------------

const Portal = ({ className, children, ...props }: DialogPrimitive.DialogPortalProps) => (
    <DialogPrimitive.Portal className={twMerge(className)} {...props}>
        <div className='fixed inset-0 z-50 flex items-start justify-center sm:items-center'>
            {children}
        </div>
    </DialogPrimitive.Portal>
);
Portal.displayName = DialogPrimitive.Portal.displayName;

//  ---------------------------------------
//  Overlay
//  ---------------------------------------

const Overlay = forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={twMerge(
            'fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
            className
        )}
        {...props}
    />
));
Overlay.displayName = DialogPrimitive.Overlay.displayName;

//  ---------------------------------------
//  Close
//  ---------------------------------------

const Close = DialogPrimitive.Close;

//  ---------------------------------------
//  Content
//  ---------------------------------------

const Content = forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <Portal>
        <Overlay />
        <DialogPrimitive.Content
            ref={ref}
            className={twMerge(
                'fixed bottom-0 z-50 grid w-full gap-4 border bg-zinc-50 p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:bottom-auto sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className='default-focus data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100'>
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </Portal>
));
Content.displayName = DialogPrimitive.Content.displayName;

//  ---------------------------------------
//  Header
//  ---------------------------------------

const Header = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={twMerge('flex flex-col space-y-1.5 text-center sm:text-left', className)}
        {...props}
    />
);
Header.displayName = 'DialogHeader';

//  ---------------------------------------
//  Footer
//  ---------------------------------------

const Footer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={twMerge(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            className
        )}
        {...props}
    />
);
Footer.displayName = 'DialogFooter';

//  ---------------------------------------
//  Title
//  ---------------------------------------

const Title = forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={twMerge('text-lg font-semibold text-zinc-700', className)}
        {...props}
    />
));
Title.displayName = DialogPrimitive.Title.displayName;

//  ---------------------------------------
//  Description
//  ---------------------------------------

const Description = forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={twMerge('text-sm text-zinc-500', className)}
        {...props}
    />
));
Description.displayName = DialogPrimitive.Description.displayName;

const Dialog = {
    Root,
    Trigger,
    Content,
    Header,
    Footer,
    Title,
    Description,
    Close,
};

export default Dialog;
