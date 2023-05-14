import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';
import { CaretRight, Check, Circle } from '@phosphor-icons/react';

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = DropdownMenuPrimitive.Root;

//  ---------------------------------------
//  Trigger
//  ---------------------------------------

const Trigger = DropdownMenuPrimitive.Trigger;

//  ---------------------------------------
//  Group
//  ---------------------------------------

const Group = DropdownMenuPrimitive.Group;

//  ---------------------------------------
//  Portal
//  ---------------------------------------

const Portal = DropdownMenuPrimitive.Portal;

//  ---------------------------------------
//  Sub
//  ---------------------------------------

const Sub = DropdownMenuPrimitive.Sub;

//  ---------------------------------------
//  RadioGroup
//  ---------------------------------------

const RadioGroup = DropdownMenuPrimitive.RadioGroup;

//  ---------------------------------------
//  SubTrigger
//  ---------------------------------------

const SubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={twMerge(
            'data-[state=open]:bg-accent flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-zinc-200',
            inset && 'pl-8',
            className
        )}
        {...props}
    >
        {children}
        <CaretRight className='ml-auto h-4 w-4' />
    </DropdownMenuPrimitive.SubTrigger>
));
SubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

//  ---------------------------------------
//  SubContent
//  ---------------------------------------

const SubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={twMerge(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-zinc-50 p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
            className
        )}
        {...props}
    />
));
SubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

//  ---------------------------------------
//  Content
//  ---------------------------------------

const Content = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={twMerge(
                'z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
Content.displayName = DropdownMenuPrimitive.Content.displayName;

//  ---------------------------------------
//  Item
//  ---------------------------------------

const Item = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={twMerge(
            'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-200 focus:text-zinc-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
Item.displayName = DropdownMenuPrimitive.Item.displayName;

//  ---------------------------------------
//  CheckboxItem
//  ---------------------------------------

const CheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={twMerge(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-zinc-200 focus:text-zinc-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        checked={checked}
        {...props}
    >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className='h-4 w-4' />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
));
CheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

//  ---------------------------------------
//  RadioItem
//  ---------------------------------------

const RadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={twMerge(
            'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-zinc-200 focus:text-zinc-950 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        {...props}
    >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle className='h-2 w-2 fill-current' />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
));
RadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

//  ---------------------------------------
//  Label
//  ---------------------------------------

const Label = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={twMerge('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
        {...props}
    />
));
Label.displayName = DropdownMenuPrimitive.Label.displayName;

//  ---------------------------------------
//  Separator
//  ---------------------------------------

const Separator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={twMerge('-mx-1 my-1 h-px bg-zinc-100', className)}
        {...props}
    />
));
Separator.displayName = DropdownMenuPrimitive.Separator.displayName;

//  ---------------------------------------
//  Shortcut
//  ---------------------------------------

const Shortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={twMerge('ml-auto text-xs tracking-widest opacity-60', className)}
            {...props}
        />
    );
};
Shortcut.displayName = 'DropdownMenuShortcut';

const DropdownMenu = {
    Root,
    Trigger,
    Content,
    Group,
    Portal,
    Sub,
    SubContent,
    Item,
    CheckboxItem,
    RadioItem,
    RadioGroup,
    Label,
    Separator,
    Shortcut,
};

export default DropdownMenu;
