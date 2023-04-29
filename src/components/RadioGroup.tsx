import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { twMerge } from 'tailwind-merge';
import { Label } from './Label';
import { Circle } from '@phosphor-icons/react';

//  ---------------------------------------
//  Root
//  ---------------------------------------

const Root = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={twMerge('grid gap-2', className)}
            {...props}
            ref={ref}
        />
    );
});
Root.displayName = RadioGroupPrimitive.Root.displayName;

//  ---------------------------------------
//  Item
//  ---------------------------------------

const Item = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, id, ...props }, ref) => {
    return (
        <div className='flex items-center gap-2'>
            <RadioGroupPrimitive.Item
                ref={ref}
                className={twMerge(
                    'default-focus h-4 w-4 rounded-full border border-zinc-200 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                id={id}
                {...props}
            >
                <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
                    <Circle weight='fill' className='fill-zinc-700 text-zinc-700 h-2.5 w-2.5' />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            <Label className='font-normal' htmlFor={id}>
                {children}
            </Label>
        </div>
    );
});
Item.displayName = RadioGroupPrimitive.Item.displayName;

const RadioGroup = {
    Root,
    Item,
};

export default RadioGroup;
