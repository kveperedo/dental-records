import { z } from 'zod';
import { CalendarDate } from '@internationalized/date';

export const GENDERS = ['male', 'female'] as const;

export const GENDER_LABEL: Record<(typeof GENDERS)[number], string> = {
    male: 'Male',
    female: 'Female',
};

export const MARITAL_STATUSES = ['single', 'married', 'divorced', 'separated', 'widowed'] as const;

export const MARITAL_STATUS_LABEL: Record<(typeof MARITAL_STATUSES)[number], string> = {
    single: 'Single',
    married: 'Married',
    divorced: 'Divorced',
    separated: 'Separated',
    widowed: 'Widowed',
};

export const addRecordSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    address: z.string().trim().optional(),
    telephone: z.string().trim().optional(),
    occupation: z.string().trim().optional(),
    gender: z.enum(GENDERS),
    status: z.enum(MARITAL_STATUSES, { required_error: 'Marital status is required' }),
    birthDate: z.custom<CalendarDate>((value) => value instanceof CalendarDate, {
        message: 'Birth date is required',
    }),
});
