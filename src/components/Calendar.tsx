import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { twMerge } from 'tailwind-merge';
import { buttonVariants } from './Button';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({ className, classNames, ...props }: CalendarProps) => {
    return (
        <DayPicker
            showOutsideDays
            fixedWeeks
            className={className}
            initialFocus
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: twMerge(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-zinc-400 uppercase rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: twMerge(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
                ),
                day_selected: 'bg-zinc-700 text-zinc-50 hover:bg-zinc-600 hover:text-zinc-50',
                day_today: buttonVariants({ variant: 'outline' }),
                day_outside: 'text-zinc-400 opacity-50',
                day_disabled: 'text-zinc-400 opacity-50 bg-red-500',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: () => <CaretLeft className='h-4 w-4' />,
                IconRight: () => <CaretRight className='h-4 w-4' />,
            }}
            {...props}
        />
    );
};
Calendar.displayName = 'Calendar';

export { Calendar };
