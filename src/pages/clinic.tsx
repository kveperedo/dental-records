import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from './_app';
import { api } from '~/utils/api';
import { useRef, useState } from 'react';
import Pagination from '~/components/Pagination';
import { Plus } from '@phosphor-icons/react';
import ScrollArea from '~/components/ScrollArea';
import Loading from '~/components/Loading';
import Head from 'next/head';
import { useToast } from '~/hooks/useToast';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
import { useAlertDialog } from '~/context/AlertDialogContext';
import EmptyContent from '~/components/EmptyContent';
import ClinicDetailsDialog from '~/feature/clinic/ClinicDetailsDialog';
import { isUserAdmin } from '~/server/utils/isUserAdmin';
import Table from '~/components/Table';
import SearchInput from '~/components/SearchInput';

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

    if (!isUserAdmin(session.user.email ?? '')) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return { props: {} };
};

const ClinicPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { toast } = useToast();
    const showDialog = useAlertDialog();
    const form = useRef<HTMLFormElement>(null);
    const searchInput = useRef<HTMLInputElement>(null);
    const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const utils = api.useContext();
    const { data: pageCount } = api.clinic.getClinicPageCount.useQuery(searchTerm);
    const { data, isLoading } = api.clinic.listClinics.useQuery({
        pageNumber,
        searchTerm,
    });
    const { mutate: addClinic, isLoading: isAddingClinic } = api.clinic.addClinic.useMutation({
        onSuccess: async ({ id }, { name }) => {
            setShowAddClinicDialog(false);
            await router.push(`/clinic/${id}`);
            toast({
                title: 'Add Clinic',
                description: `Successfully added ${name} clinic.`,
            });
        },
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

    const areRecordsLoading = isLoading || !data || isDeletingClinic;
    const hasRecords = data && data.length > 0;
    const hasEmptySearchResults = searchTerm.length > 0 && !hasRecords;

    const handleInputReset = () => {
        setSearchTerm('');
        setPageNumber(1);
    };

    const handleInputSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
        setPageNumber(1);
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

    const renderContent = () => {
        if (areRecordsLoading) {
            return (
                <div className='flex-1'>
                    <Loading />
                </div>
            );
        }

        if (hasEmptySearchResults) {
            return (
                <div className='flex h-full items-center justify-center'>
                    <EmptyContent
                        title='No clinic found!'
                        description='Please try again with a different search term'
                    >
                        <Button variant='outline' onClick={handleResetSearch}>
                            Clear Search
                        </Button>
                    </EmptyContent>
                </div>
            );
        }

        if (!hasRecords) {
            return (
                <div className='flex flex-1 items-center justify-center'>
                    <EmptyContent
                        title='No clinics!'
                        description="Add a clinic by clicking the 'Add Clinic' button."
                    ></EmptyContent>
                </div>
            );
        }

        return (
            <ScrollArea.Root className='flex-1'>
                <ScrollArea.Viewport>
                    {data.map((clinic, index, array) => {
                        const isLast = index === array.length - 1;

                        return (
                            <Table.Row
                                className='group'
                                key={clinic.id}
                                onClick={() => void router.push(`/clinic/${clinic.id}`)}
                            >
                                <Table.Cell className='basis-5/6' isLast={isLast}>
                                    {clinic.name}
                                </Table.Cell>
                                <Table.Cell className='basis-1/6 justify-center' isLast={isLast}>
                                    <Button
                                        className='transition-all focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0'
                                        variant='link'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            void handleDeleteClinic(clinic.id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </ScrollArea.Viewport>
            </ScrollArea.Root>
        );
    };

    return (
        <>
            <Head>
                <title>Clinic Panel</title>
            </Head>
            <div className='container m-auto flex h-full flex-1 flex-col p-2 sm:px-0 sm:py-6'>
                <header className='flex items-center justify-end pb-2 sm:pb-4'>
                    <Button onClick={() => setShowAddClinicDialog(true)}>
                        <Plus className='h-4 w-4 text-inherit' />
                        <span className='ml-1 hidden sm:block'>Add Clinic</span>
                    </Button>
                </header>
                <Table.Root>
                    <Table.Title>
                        <div className='hidden sm:block'>
                            <p className='text-lg font-semibold'>Clinics</p>
                            <p className='text-sm text-zinc-500'>List of clinics</p>
                        </div>
                        <SearchInput
                            ref={searchInput}
                            formRef={form}
                            className='w-full sm:w-auto'
                            onReset={handleInputReset}
                            onSearch={handleInputSearch}
                            placeholder='Search clinics...'
                        />
                    </Table.Title>
                    <Table.Header>
                        <Table.HeaderCell className='basis-5/6'>Clinic Name</Table.HeaderCell>
                        <Table.HeaderCell className='basis-1/6' />
                    </Table.Header>

                    {renderContent()}

                    {(!hasEmptySearchResults || hasRecords) && (
                        <Table.Footer>
                            <Pagination
                                key={searchTerm}
                                total={pageCount ?? 0}
                                initialPage={pageNumber}
                                onChange={setPageNumber}
                            />
                        </Table.Footer>
                    )}
                </Table.Root>
            </div>
            <ClinicDetailsDialog
                open={showAddClinicDialog}
                onOpenChange={setShowAddClinicDialog}
                loading={isAddingClinic}
                onSubmit={addClinic}
            />
        </>
    );
};

ClinicPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default ClinicPage;
