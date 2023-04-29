import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { twMerge } from 'tailwind-merge';

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = PopoverPrimitive.Root;

//  ---------------------------------------
//  Trigger
//  ---------------------------------------

const Trigger = PopoverPrimitive.Trigger;

//  ---------------------------------------
//  Anchor
//  ---------------------------------------

const Anchor = PopoverPrimitive.Anchor;

//  ---------------------------------------
//  Content
//  ---------------------------------------

const Content = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={twMerge(
                'text-popover-foreground z-50 w-72 rounded-md border bg-zinc-50 p-4 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
));
Content.displayName = PopoverPrimitive.Content.displayName;

const Popover = {
    Root,
    Trigger,
    Content,
    Anchor,
};

export default Popover;
