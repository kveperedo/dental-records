import React from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
// import { Check, ChevronDown } from 'lucide-react';

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = SelectPrimitive.Root;

//  ---------------------------------------
//  Group
//  ---------------------------------------

const Group = SelectPrimitive.Group;

//  ---------------------------------------
//  Value
//  ---------------------------------------

const Value = SelectPrimitive.Value;

//  ---------------------------------------
//  Trigger
//  ---------------------------------------

const Trigger = forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={twMerge(
            'default-focus flex h-10 w-full items-center justify-between rounded border border-zinc-200 bg-transparent px-3 py-2 text-sm data-[placeholder]:text-zinc-400 hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-50',
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <CaretDown className='h-4 w-4 opacity-50' />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
Trigger.displayName = SelectPrimitive.Trigger.displayName;

//  ---------------------------------------
//  Content
//  ---------------------------------------

const Content = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={twMerge(
                'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-zinc-50 shadow animate-in fade-in-80',
                position === 'popper' && 'translate-y-1',
                className
            )}
            position={position}
            {...props}
        >
            <SelectPrimitive.Viewport
                className={twMerge(
                    'p-1',
                    position === 'popper' &&
                        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
Content.displayName = SelectPrimitive.Content.displayName;

//  ---------------------------------------
//  Label
//  ---------------------------------------

const Label = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={twMerge('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
        {...props}
    />
));
Label.displayName = SelectPrimitive.Label.displayName;

//  ---------------------------------------
//  Item
//  ---------------------------------------

const Item = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={twMerge(
            'focus:bg-zinc-200 focus:text-zinc-950 relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        {...props}
    >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <SelectPrimitive.ItemIndicator>
                <Check className='h-4 w-4' />
            </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
Item.displayName = SelectPrimitive.Item.displayName;

//  ---------------------------------------
//  Separator
//  ---------------------------------------

const Separator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={twMerge('bg-muted -mx-1 my-1 h-px', className)}
        {...props}
    />
));
Separator.displayName = SelectPrimitive.Separator.displayName;

const Select = {
    Root,
    Group,
    Value,
    Trigger,
    Content,
    Label,
    Item,
    Separator,
};

export default Select;
