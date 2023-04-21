import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = {
    startIcon?: React.ReactNode;
    startIconClassName?: string;
    endIcon?: React.ReactNode;
    endIconClassName?: string;
    containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            startIcon,
            endIcon,
            className,
            containerClassName,
            startIconClassName,
            endIconClassName,
            ...props
        },
        ref
    ) => {
        return (
            <div className={twMerge('relative', containerClassName)}>
                {startIcon && (
                    <div
                        className={twMerge(
                            'pointer-events-none absolute flex h-10 w-10 items-center justify-center text-zinc-400',
                            startIconClassName
                        )}
                    >
                        {startIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'default-focus h-10 w-full rounded border border-zinc-300 bg-transparent px-4 py-2 transition-colors placeholder:text-zinc-400 text-sm hover:border-zinc-400',
                        startIcon && 'pl-12',
                        endIcon && 'pr-12',
                        className
                    )}
                    {...props}
                />
                {endIcon && (
                    <div
                        className={twMerge(
                            'pointer-events-none absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-zinc-400',
                            endIconClassName
                        )}
                    >
                        {endIcon}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
