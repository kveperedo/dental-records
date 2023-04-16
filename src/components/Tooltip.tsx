import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

//  ---------------------------------------
//  Provider
//  ---------------------------------------

const Provider = TooltipPrimitive.Provider;

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = ({ ...props }) => <TooltipPrimitive.Root {...props} />;
Root.displayName = TooltipPrimitive.Tooltip.displayName;

//  ---------------------------------------
//  Trigger
//  ---------------------------------------

const Trigger = TooltipPrimitive.Trigger;

//  ---------------------------------------
//  Content
//  ---------------------------------------

const Content = forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={twMerge(
            'z-50 overflow-hidden rounded border border-zinc-100 bg-white px-3 py-1.5 text-sm text-zinc-700 shadow animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
            className
        )}
        {...props}
    />
));
Content.displayName = TooltipPrimitive.Content.displayName;

const Tooltip = {
    Provider,
    Root,
    Trigger,
    Content,
};

export default Tooltip;
