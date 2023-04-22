import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/Button';
import Dialog from '~/components/Dialog';
import Input from '~/components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '~/components/Label';

type ClinicDetailsDialogProps = {
    open: boolean;
    loading: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: ClinicDetailsFormData) => void;
    defaultValues?: ClinicDetailsFormData;
};

const schema = z.object({
    name: z.string().trim().min(1, 'Clinic name is required.'),
    address: z.string().trim().optional(),
});

type ClinicDetailsFormData = z.infer<typeof schema>;

const ClinicDetailsDialog = ({
    open,
    loading,
    defaultValues,
    onOpenChange,
    onSubmit,
}: ClinicDetailsDialogProps) => {
    const isUpdate = Boolean(defaultValues);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClinicDetailsFormData>({
        resolver: zodResolver(schema),
        shouldUnregister: true,
        shouldUseNativeValidation: false,
        values: defaultValues,
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }

        onOpenChange(open);
    };

    const handleFormSubmit = (data: ClinicDetailsFormData) => {
        onSubmit(data);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>
                        {isUpdate ? 'Update Clinic' : 'Add Clinic'}
                    </Dialog.Title>
                    <Dialog.Description>
                        {isUpdate
                            ? 'Fill in the details below to update the clinic.'
                            : 'Fill in the details below to add a new clinic.'}
                    </Dialog.Description>
                </Dialog.Header>
                <form
                    className='flex flex-col gap-4'
                    id='add-clinic-form'
                    onSubmit={(event) =>
                        void handleSubmit(handleFormSubmit)(event)
                    }
                >
                    <fieldset className='flex flex-col gap-2'>
                        <Label htmlFor='name'>Clinic Name</Label>
                        <Input
                            id='name'
                            placeholder='Clinic name'
                            {...register('name')}
                        />
                        {errors.name?.message && (
                            <p className='text-sm text-red-400'>
                                {errors.name.message}
                            </p>
                        )}
                    </fieldset>

                    <fieldset className='flex flex-col gap-2'>
                        <Label htmlFor='address'>Address</Label>
                        <Input
                            id='address'
                            placeholder='Address'
                            {...register('address')}
                        />
                        {errors.address?.message && (
                            <p className='text-sm text-red-400'>
                                {errors.address.message}
                            </p>
                        )}
                    </fieldset>
                </form>
                <Dialog.Footer className='mt-4'>
                    <Dialog.Close asChild>
                        <Button className='mt-2 sm:mt-0' variant='outline'>
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Button
                        loading={loading}
                        form='add-clinic-form'
                        type='submit'
                    >
                        Submit
                    </Button>
                </Dialog.Footer>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default ClinicDetailsDialog;
