import * as React from 'react';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
    'default-focus inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            variant: {
                default: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-800/90',
                destructive: 'bg-red-600 text-zinc-50 hover:bg-red-600/90',
                outline:
                    'border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300',
                secondary: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-200/80',
                ghost: 'hover:bg-zinc-200 hover:text-zinc-800',
                link: 'underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                icon: 'p-0 h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={twMerge(
                    buttonVariants({ variant, size, className })
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
