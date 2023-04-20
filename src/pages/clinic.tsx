import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from './_app';
import { api } from '~/utils/api';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import Pagination from '~/components/Pagination';
import { ListPlus, MagnifyingGlass, Trash } from '@phosphor-icons/react';
import ScrollArea from '~/components/ScrollArea';
import { twMerge } from 'tailwind-merge';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Head from 'next/head';
import AlertDialog from '~/components/AlertDialog';
import { useToast } from '~/hooks/useToast';
import Tooltip from '~/components/Tooltip';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';

type RemoveClinicDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

const RemoveClinicDialog = ({
    onConfirm,
    onOpenChange,
    open,
}: RemoveClinicDialogProps) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content>
                <AlertDialog.Header>
                    <AlertDialog.Title>Remove Clinic?</AlertDialog.Title>
                    <AlertDialog.Description>
                        Are you sure you want to remove this clinic? All users
                        linked will not have access to the clinic&apos;s records
                        anymore.
                    </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action onClick={onConfirm}>
                        Remove clinic
                    </AlertDialog.Action>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

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

    return { props: {} };
};

const ClinicPage: NextPageWithLayout = () => {
    const router = useRouter();
    const [clinicIdToRemove, setClinicIdToRemove] = useState<string | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const utils = api.useContext();
    const { data: pageCount } =
        api.clinic.getClinicPageCount.useQuery(searchTerm);
    const { data, isLoading } = api.clinic.listClinics.useQuery({
        pageNumber,
        searchTerm,
    });
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
    const { toast } = useToast();
    const areRecordsLoading = isLoading || !data || isDeletingClinic;

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchTerm = formData.get('searchTerm') as string;

        if (searchTerm) {
            setSearchTerm(searchTerm);
            setPageNumber(1);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) {
            setSearchTerm('');
            setPageNumber(1);
        }
    };

    const handleDeleteClinic = () => {
        if (clinicIdToRemove) {
            deleteClinic(clinicIdToRemove);
        }
    };

    return (
        <>
            <Head>
                <title>Clinic Panel</title>
            </Head>
            <div className='flex h-full flex-1'>
                <div className='m-2 flex w-full flex-col rounded border border-zinc-200 bg-zinc-50 sm:mx-auto sm:my-8 sm:w-[768px]'>
                    <header className='mb-6 flex items-center justify-between gap-4 p-4'>
                        <Button>
                            <ListPlus className='h-6 w-6 text-inherit' />
                            <span className='ml-2 hidden sm:block'>
                                Add Clinic
                            </span>
                        </Button>
                        <form onSubmit={handleSearch}>
                            <Input
                                name='searchTerm'
                                placeholder='Search clinics...'
                                onChange={handleInputChange}
                                endIcon={
                                    <button
                                        type='submit'
                                        className='default-focus flex h-full w-full items-center justify-center rounded'
                                    >
                                        <MagnifyingGlass className='h-6 w-6 text-inherit' />
                                    </button>
                                }
                                endIconClassName='pointer-events-auto cursor-pointer hover:text-zinc-700 transition-colors'
                            />
                        </form>
                    </header>

                    <main className='flex h-32 flex-1 flex-col overflow-hidden'>
                        <div className='flex border-b border-zinc-200 shadow-sm'>
                            <div className='basis-5/6 px-4 py-2 text-left text-sm font-semibold text-zinc-700'>
                                Clinic Name
                            </div>
                            <div className='basis-1/6 px-4 py-2 text-center text-sm font-semibold text-zinc-700'></div>
                        </div>
                        {areRecordsLoading ? (
                            <div className='flex-1'>
                                <Loading />
                            </div>
                        ) : (
                            <ScrollArea.Root>
                                <ScrollArea.Viewport>
                                    {data.map((clinic, index, array) => {
                                        const isLast =
                                            index === array.length - 1;

                                        return (
                                            <div
                                                tabIndex={0}
                                                onClick={() =>
                                                    void router.push(
                                                        `/clinic/${clinic.id}`
                                                    )
                                                }
                                                className='flex cursor-pointer transition-colors hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none active:bg-zinc-200'
                                                key={clinic.id}
                                            >
                                                <div
                                                    className={twMerge(
                                                        'basis-5/6 border-b border-zinc-200 px-4 py-4',
                                                        isLast &&
                                                            'border-transparent'
                                                    )}
                                                >
                                                    {clinic.name}
                                                </div>
                                                <div
                                                    className={twMerge(
                                                        'flex basis-1/6 border-b border-zinc-200 px-4 py-2',
                                                        isLast &&
                                                            'border-transparent'
                                                    )}
                                                >
                                                    <Tooltip.Root>
                                                        <Tooltip.Trigger
                                                            asChild
                                                        >
                                                            <Button
                                                                className='m-auto h-8 w-8 rounded-full p-0 text-base'
                                                                variant='ghost'
                                                                onClick={(
                                                                    event
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    setClinicIdToRemove(
                                                                        clinic.id
                                                                    );
                                                                }}
                                                            >
                                                                <Trash
                                                                    weight='fill'
                                                                    className='text-inherit'
                                                                />
                                                            </Button>
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Content>
                                                            Delete Clinic
                                                        </Tooltip.Content>
                                                    </Tooltip.Root>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ScrollArea.Viewport>
                            </ScrollArea.Root>
                        )}
                    </main>

                    <footer className='border-t border-zinc-200 p-4'>
                        <Pagination
                            key={searchTerm}
                            total={pageCount ?? 0}
                            initialPage={pageNumber}
                            onChange={setPageNumber}
                        />
                    </footer>
                </div>
            </div>
            <RemoveClinicDialog
                open={Boolean(clinicIdToRemove)}
                onOpenChange={() => setClinicIdToRemove(null)}
                onConfirm={handleDeleteClinic}
            />
        </>
    );
};

ClinicPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default ClinicPage;
