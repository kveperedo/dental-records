import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import superjson from 'superjson';
import { api } from '~/utils/api';
import { ArrowLeft, Plus, Trash } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
import { useToast } from '~/hooks/useToast';
import Loading from '~/components/Loading';
import ScrollArea from '~/components/ScrollArea';
import useBreakpoints from '~/hooks/useBreakpoints';
import EmptyContent from '~/components/EmptyContent';
import { useAlertDialog } from '~/context/AlertDialogContext';
import type { FormEvent } from 'react';
import { useRef } from 'react';
import Input from '~/components/Input';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuthSession(ctx);

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const id = ctx.params?.id as string;

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: superjson,
    });

    await helpers.clinic.getClinicDetailsById.prefetch(id);

    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

const ClinicSlugPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
    const router = useRouter();
    const utils = api.useContext();
    const showDialog = useAlertDialog();
    const { sm } = useBreakpoints();
    const emailInput = useRef<HTMLInputElement>(null);
    const addClinicForm = useRef<HTMLFormElement>(null);
    const { data: clinicDetails } =
        api.clinic.getClinicDetailsById.useQuery(id);
    const { data: users, isLoading: isUsersLoading } =
        api.clinic.listClinicUsersById.useQuery(id);
    const { mutate: deleteClinic, isLoading: isDeletingClinic } =
        api.clinic.deleteClinic.useMutation({
            onSuccess: () => {
                toast({
                    title: 'Delete Clinic',
                    description: `Successfully deleted clinic.`,
                });
                void utils.clinic.invalidate();
            },
        });
    const { mutate: removeClinicUser } =
        api.clinic.removeClinicUser.useMutation({
            onSuccess: () => {
                toast({
                    title: 'Remove User',
                    description: `Successfully removed user.`,
                });
                void utils.clinic.invalidate();
            },
        });
    const { mutate: addClinicUser, isLoading: isAddingUser } =
        api.clinic.addClinicUser.useMutation({
            onSuccess: (_, { email }) => {
                toast({
                    title: 'Add User',
                    description: `Successfully added ${email} to clinic.`,
                });
                addClinicForm.current?.reset();
                void utils.clinic.invalidate();
            },
            onError: ({ message }) => {
                toast({
                    title: 'Add User',
                    description: message,
                    variant: 'destructive',
                });
            },
        });
    const { toast } = useToast();
    const hasUsers = users && users.length > 0;

    const handleRemoveUser = async (userId: string) => {
        const confirmed = await showDialog({
            title: 'Remove User?',
            description:
                "Are you sure you want to remove this user? They won't be able to access the clinic's records anymore.",
            actionButton: 'Remove User',
        });

        if (confirmed) {
            removeClinicUser(userId);
        }
    };

    const handleAddUser = (event: FormEvent) => {
        event.preventDefault();

        if (!addClinicForm.current) {
            return;
        }

        const formData = new FormData(addClinicForm.current);
        const email = formData.get('email');

        if (email && typeof email === 'string') {
            addClinicUser({ clinicId: id, email });
        }
    };

    const handleDeleteClinic = async () => {
        const confirmed = await showDialog({
            title: 'Remove Clinic?',
            description:
                "Are you sure you want to remove this clinic? All users linked will not have access to the clinic's records anymore.",
            actionButton: 'Remove Clinic',
        });

        if (confirmed) {
            deleteClinic(id);
            void router.push('/clinic');
        }
    };

    if (!clinicDetails) {
        return <div>No record found</div>;
    }

    if (isDeletingClinic || isUsersLoading) {
        return <Loading />;
    }

    return (
        <>
            <Head>
                <title>Clinic | {clinicDetails?.name}</title>
            </Head>
            <div className='container mx-auto flex h-full flex-1 flex-col p-2 md:px-0 md:py-6'>
                <header className='flex items-center justify-between pb-2 md:pb-4'>
                    <Button
                        className='w-10 p-0'
                        variant='ghost'
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className='h-5 w-5' />
                    </Button>
                    <div className='ml-4 mr-auto'>
                        <h1 className='text-2xl font-semibold'>
                            {clinicDetails.name}
                        </h1>
                        <p className='hidden text-sm text-zinc-500 sm:block'>
                            {clinicDetails.address}
                        </p>
                    </div>
                    <Button
                        size={sm ? 'default' : 'icon'}
                        onClick={() => void handleDeleteClinic()}
                        variant='secondary'
                    >
                        <Trash weight='fill' className='h-4 w-4 sm:hidden' />
                        <span className='hidden sm:block'>Delete Clinic</span>
                    </Button>
                </header>
                <div className='flex h-full w-full flex-1 flex-col overflow-hidden rounded border border-zinc-200 bg-zinc-50 md:w-96'>
                    <>
                        <div className='border-b border-zinc-200 p-4'>
                            <p className='text-lg font-semibold'>Users</p>
                            <p className='text-sm text-zinc-500'>
                                List of users that have access to this
                                clinic&apos;s records
                            </p>
                        </div>
                        {hasUsers ? (
                            <ScrollArea.Root className='flex-1'>
                                <ScrollArea.Viewport>
                                    <div className='flex flex-col gap-1 p-4'>
                                        {users.map((user) => (
                                            <div
                                                className='group flex items-center justify-between'
                                                key={user.id}
                                            >
                                                <div>
                                                    <p className='text-sm font-medium leading-none text-zinc-700'>
                                                        {user.name}
                                                    </p>
                                                    <p className='text-sm text-zinc-400'>
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <Button
                                                    onClick={() =>
                                                        void handleRemoveUser(
                                                            user.id
                                                        )
                                                    }
                                                    className='transition-all focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0'
                                                    variant='link'
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea.Viewport>
                            </ScrollArea.Root>
                        ) : (
                            <div className='flex h-full flex-1 items-center justify-center'>
                                <EmptyContent
                                    title='No clinic users!'
                                    description="Add users to access the clinic's records"
                                    actionText={
                                        <>
                                            <Plus
                                                weight='bold'
                                                className='mr-1 h-4 w-4 text-inherit'
                                            />
                                            <span>Add User</span>
                                        </>
                                    }
                                    onClick={() => emailInput.current?.focus()}
                                />
                            </div>
                        )}
                        <form
                            ref={addClinicForm}
                            className='flex items-center gap-4 border-t border-zinc-200 p-4'
                            onSubmit={handleAddUser}
                        >
                            <Input
                                ref={emailInput}
                                required
                                name='email'
                                type='email'
                                containerClassName='flex-1'
                                placeholder='Enter email here...'
                            />
                            <Button
                                loading={isAddingUser}
                                type='submit'
                                variant='outline'
                            >
                                Add User
                            </Button>
                        </form>
                    </>
                </div>
            </div>
        </>
    );
};

ClinicSlugPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default ClinicSlugPage;
