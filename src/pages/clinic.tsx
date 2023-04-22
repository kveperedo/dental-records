import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from './_app';
import { api } from '~/utils/api';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import Pagination from '~/components/Pagination';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import ScrollArea from '~/components/ScrollArea';
import { twMerge } from 'tailwind-merge';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Head from 'next/head';
import { useToast } from '~/hooks/useToast';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
import { useAlertDialog } from '~/context/AlertDialogContext';
import EmptyContent from '~/components/EmptyContent';

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
    const showDialog = useAlertDialog();
    const form = useRef<HTMLFormElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);
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
    const isEmptySearchQuery = searchTerm && !data?.length;

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

    const handleResetSearch = () => {
        setSearchTerm('');
        form.current?.reset();
        searchInput.current?.focus();
    };

    const handleDeleteClinic = async (id: string) => {
        const confirmed = await showDialog({
            title: 'Remove Clinic?',
            description:
                "Are you sure you want to remove this clinic? All users linked will not have access to the clinic's records anymore.",
            actionButton: 'Remove Clinic',
        });

        if (confirmed) {
            deleteClinic(id);
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
                            <Plus className='h-4 w-4 text-inherit' />
                            <span className='ml-1 hidden sm:block'>
                                Add Clinic
                            </span>
                        </Button>
                        <form ref={form} onSubmit={handleSearch}>
                            <Input
                                ref={searchInput}
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
                                endIconClassName='pointer-events-auto cursor-pointer hover:text-zinc-500 transition-colors'
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
                        ) : isEmptySearchQuery ? (
                            <div className='flex h-full items-center justify-center'>
                                <EmptyContent
                                    title='No clinic found'
                                    description='Please try again with a different search term'
                                >
                                    <Button
                                        variant='outline'
                                        onClick={handleResetSearch}
                                    >
                                        Clear Search
                                    </Button>
                                </EmptyContent>
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
                                                className='group flex cursor-pointer transition-colors hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none active:bg-zinc-200'
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
                                                    <Button
                                                        className='sm:opacity-0 transition-all focus-within:opacity-100 group-hover:opacity-100'
                                                        variant='link'
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            void handleDeleteClinic(
                                                                clinic.id
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
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
        </>
    );
};

ClinicPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default ClinicPage;
