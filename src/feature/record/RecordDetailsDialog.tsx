// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '~/components/Button';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '~/components/Label';
import { addRecordSchema } from './constants';
import Select from '~/components/Select';
import RadioGroup from '~/components/RadioGroup';
import DateField from '~/components/DateField';

type RecordDetailsFormData = z.infer<typeof addRecordSchema>;

const maritalStatusOptions: { label: string; value: RecordDetailsFormData['status'] }[] = [
    {
        value: 'married',
        label: 'Married',
    },
    {
        value: 'single',
        label: 'Single',
    },
    {
        value: 'divorced',
        label: 'Divorced',
    },
    {
        value: 'separated',
        label: 'Separated',
    },
    {
        value: 'widowed',
        label: 'Widowed',
    },
];

type RecordDetailsDialogProps = {
    open: boolean;
    loading: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: RecordDetailsFormData) => void;
    defaultValues?: RecordDetailsFormData;
};

const RecordDetailsDialog = ({
    open,
    loading,
    defaultValues,
    onOpenChange,
    onSubmit,
}: RecordDetailsDialogProps) => {
    const isUpdate = Boolean(defaultValues);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<RecordDetailsFormData>({
        resolver: zodResolver(addRecordSchema),
        shouldUnregister: true,
        shouldUseNativeValidation: false,
        defaultValues: {
            gender: 'male',
        },
        values: defaultValues,
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }

        onOpenChange(open);
    };

    const handleFormSubmit = (data: RecordDetailsFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content className='flex max-h-full flex-col sm:max-w-3xl'>
                <Dialog.Header>
                    <Dialog.Title>{isUpdate ? 'Update Record' : 'Add Record'}</Dialog.Title>
                    <Dialog.Description>
                        {isUpdate
                            ? 'Fill in the details below to update the record.'
                            : 'Fill in the details below to add a new record.'}
                    </Dialog.Description>
                </Dialog.Header>
                <form
                    className='flex flex-1 flex-col gap-4 overflow-scroll p-1 sm:flex-none sm:overflow-visible sm:p-0'
                    id='add-record-form'
                    onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
                >
                    <div className='flex flex-col gap-4 sm:flex-row'>
                        <fieldset className='flex flex-[2] flex-col gap-2'>
                            <Label htmlFor='name'>Name</Label>
                            <Input id='name' placeholder='Name' {...register('name')} />
                            {errors.name?.message && (
                                <p className='text-sm text-red-400'>{errors.name.message}</p>
                            )}
                        </fieldset>

                        <fieldset className='flex flex-1 flex-col gap-2'>
                            <Label htmlFor='birthdate'>Birth Date</Label>
                            <Controller
                                control={control}
                                name='birthDate'
                                render={({ field }) => {
                                    return <DateField aria-label='Birth Date' {...field} />;
                                }}
                            />
                            {errors.birthDate?.message && (
                                <p className='text-sm text-red-400'>{errors.birthDate.message}</p>
                            )}
                        </fieldset>

                        <fieldset className='flex flex-1 flex-col gap-2'>
                            <Label htmlFor='phone'>Phone Number</Label>
                            <Input
                                id='phone'
                                placeholder='Phone Number'
                                {...register('telephone')}
                            />
                            {errors.telephone?.message && (
                                <p className='text-sm text-red-400'>{errors.telephone.message}</p>
                            )}
                        </fieldset>
                    </div>

                    <fieldset className='flex flex-col gap-2'>
                        <Label htmlFor='address'>Address</Label>
                        <Input id='address' placeholder='Address' {...register('address')} />
                        {errors.address?.message && (
                            <p className='text-sm text-red-400'>{errors.address.message}</p>
                        )}
                    </fieldset>

                    <div className='flex flex-col gap-4 sm:flex-row'>
                        <fieldset className='flex flex-col gap-2'>
                            <Label>Gender</Label>
                            <Controller
                                control={control}
                                name='gender'
                                render={({ field }) => (
                                    <RadioGroup.Root
                                        className='flex h-10 flex-row gap-4'
                                        {...field}
                                        onValueChange={field.onChange}
                                    >
                                        <RadioGroup.Item id='male' value='male'>
                                            Male
                                        </RadioGroup.Item>
                                        <RadioGroup.Item id='female' value='female'>
                                            Female
                                        </RadioGroup.Item>
                                    </RadioGroup.Root>
                                )}
                            />
                        </fieldset>

                        <fieldset className='flex flex-1 flex-col gap-2'>
                            <Label htmlFor='status'>Marital Status</Label>
                            <Controller
                                control={control}
                                name='status'
                                render={({ field: { ref, ...field } }) => (
                                    <Select.Root {...field} onValueChange={field.onChange}>
                                        <Select.Trigger ref={ref} id='status'>
                                            <Select.Value placeholder='Select Marital Status' />
                                        </Select.Trigger>
                                        <Select.Content>
                                            {maritalStatusOptions.map(({ label, value }) => (
                                                <Select.Item key={value} value={value}>
                                                    {label}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                            {errors.status?.message && (
                                <p className='text-sm text-red-400'>{errors.status.message}</p>
                            )}
                        </fieldset>

                        <fieldset className='flex flex-1 flex-col gap-2'>
                            <Label htmlFor='occupation'>Occupation</Label>
                            <Input
                                id='occupation'
                                placeholder='Occupation'
                                {...register('occupation')}
                            />
                            {errors.occupation?.message && (
                                <p className='text-sm text-red-400'>{errors.occupation.message}</p>
                            )}
                        </fieldset>
                    </div>
                </form>

                <Dialog.Footer className='mt-4'>
                    <Dialog.Close asChild>
                        <Button className='mt-2 sm:mt-0' variant='outline'>
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button loading={loading} form='add-record-form' type='submit'>
                        Submit
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default RecordDetailsDialog;
