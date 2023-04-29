import { DateField as DateFieldPrimitive, DateInput, DateSegment } from 'react-aria-components';
import type { DateFieldProps as DateFieldPrimitiveProps, DateValue } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { CalendarBlank } from '@phosphor-icons/react';
import { getLocalTimeZone, parseDate } from '@internationalized/date';
import type { CalendarDate } from '@internationalized/date';
import Popover from './Popover';
import { Calendar } from './Calendar';
import dayjs from 'dayjs';
import { useState } from 'react';

type DateFieldProps<T extends DateValue> = Omit<DateFieldPrimitiveProps<T>, 'className'> & {
    className?: string;
};

const DateField = <T extends CalendarDate>({ className, ...props }: DateFieldProps<T>) => {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const handleCalendarSelect = (date?: Date) => {
        if (!date) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            props.onChange?.(undefined as any);
            return;
        }

        try {
            const parsedDate = parseDate(dayjs(date).format('YYYY-MM-DD'));
            props.onChange?.(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
                parsedDate as any
            );
            setCalendarOpen(false);
        } catch (error) {}
    };

    return (
        <Popover.Root open={calendarOpen} onOpenChange={setCalendarOpen} modal>
            <Popover.Anchor>
                <DateFieldPrimitive
                    className={twMerge(
                        'flex h-10 items-center rounded border border-zinc-200 bg-transparent pl-4 pr-0 transition-colors hover:border-zinc-300',
                        className
                    )}
                    {...props}
                >
                    <DateInput className='flex flex-1 items-center py-2 text-sm caret-transparent'>
                        {(segment) => (
                            <DateSegment
                                className='default-focus rounded px-[2px] focus:text-zinc-950 focus:ring-offset-0 data-[type=literal]:px-[2px] data-[placeholder]:text-zinc-400 data-[type=literal]:text-zinc-400'
                                segment={segment}
                            />
                        )}
                    </DateInput>

                    <Popover.Trigger asChild>
                        <Button
                            className='group h-full rounded-l-none rounded-r-sm'
                            disabled={props.isDisabled}
                            size='sm'
                            variant='ghost'
                            type='button'
                        >
                            <CalendarBlank className='h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-500' />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content>
                        <Calendar
                            mode='single'
                            defaultMonth={props.value?.toDate(getLocalTimeZone()) || undefined}
                            selected={props.value?.toDate(getLocalTimeZone()) || undefined}
                            onSelect={handleCalendarSelect}
                        />
                    </Popover.Content>
                </DateFieldPrimitive>
            </Popover.Anchor>
        </Popover.Root>
    );
};

export default DateField;
