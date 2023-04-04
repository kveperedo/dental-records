import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    containerClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ startIcon, endIcon, containerClassName, ...props }, ref) => {
        return (
            <div className={twMerge('relative', containerClassName)}>
                {startIcon && (
                    <div className='pointer-events-none absolute flex h-10 w-10 items-center justify-center text-zinc-400'>
                        {startIcon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'h-10 w-full rounded border border-zinc-300 bg-zinc-100 px-6 py-2 transition-colors placeholder:text-zinc-400 hover:border-zinc-400 focus:border-zinc-500 focus:outline-none',
                        startIcon && 'pl-12',
                        endIcon && 'pr-12'
                    )}
                    placeholder='Search clinics...'
                    {...props}
                />
                {endIcon && (
                    <div className='pointer-events-none absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-zinc-400'>
                        {endIcon}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
