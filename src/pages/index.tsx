import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { getServerAuthSession } from '~/server/auth';
import MainLayout from '~/components/MainLayout';
import type { NextPageWithLayout } from './_app';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import SuperJSON from 'superjson';
import { useRef, useState } from 'react';
import { api } from '~/utils/api';
import Loading from '~/components/Loading';
import { Button } from '~/components/Button';
import { Plus } from '@phosphor-icons/react';
import ScrollArea from '~/components/ScrollArea';
import EmptyContent from '~/components/EmptyContent';
import Pagination from '~/components/Pagination';
import SearchInput from '~/components/SearchInput';
import Table from '~/components/Table';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);

    if (!session || !session.user.email) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: createInnerTRPCContext({ session }),
        transformer: SuperJSON,
    });

    const clinicDetails = await helpers.clinic.getUserClinicDetails.fetch();

    if (!clinicDetails) {
        return {
            redirect: {
                destination: '/no-access',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
            clinicDetails: {
                id: clinicDetails.id,
                name: clinicDetails.name,
                address: clinicDetails.address,
            },
        },
    };
};

const HomePage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
    clinicDetails,
}) => {
    const searchInput = useRef<HTMLInputElement>(null);
    const form = useRef<HTMLFormElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const { data: pageCount } = api.record.getRecordPageCount.useQuery({
        clinicId: clinicDetails.id,
        searchTerm,
    });
    const { data, isLoading } = api.record.listRecords.useQuery({
        clinicId: clinicDetails.id,
        pageNumber,
        searchTerm,
    });

    const areRecordsLoading = isLoading || !data;
    const isEmptySearchQuery = searchTerm && !data?.length;

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

    const renderContent = () => {
        if (areRecordsLoading) {
            return (
                <div className='flex-1'>
                    <Loading />
                </div>
            );
        }

        if (isEmptySearchQuery) {
            return (
                <div className='flex h-full flex-1 items-center justify-center'>
                    <EmptyContent
                        title='No clinic users!'
                        description="Add users to access the clinic's records"
                    >
                        <Button variant='outline' onClick={handleResetSearch}>
                            Clear Search
                        </Button>
                    </EmptyContent>
                </div>
            );
        }

        return (
            <ScrollArea.Root className='flex-1'>
                <ScrollArea.Viewport>
                    {data.map((record, index, array) => {
                        const isLast = index === array.length - 1;

                        return (
                            <Table.Row
                                className='group'
                                key={record.id}
                                // onClick={() => void router.push(`/clinic/${clinic.id}`)}
                            >
                                <Table.Cell className='basis-5/6' isLast={isLast}>
                                    {record.name}
                                </Table.Cell>
                                <Table.Cell className='basis-1/6 justify-center' isLast={isLast}>
                                    <Button
                                        className='transition-all focus-within:opacity-100 group-hover:opacity-100 sm:opacity-0'
                                        variant='link'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            // void handleDeleteClinic(clinic.id);
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
                <title>Records | {clinicDetails.name}</title>
                <meta name='description' content='Generated by create-t3-app' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className='container mx-auto flex h-full flex-1 flex-col p-2 sm:px-0 sm:py-6'>
                <header className='flex items-center pb-2 sm:pb-4'>
                    <div className='mr-auto truncate'>
                        <h1 className='truncate text-2xl font-semibold'>{clinicDetails.name}</h1>
                    </div>
                    <Button>
                        <Plus className='h-4 w-4 text-inherit' />
                        <span className='ml-1 hidden sm:block'>Add Record</span>
                    </Button>
                </header>
                <Table.Root>
                    <Table.Title>
                        <div className='hidden sm:block'>
                            <p className='text-lg font-semibold'>Records</p>
                            <p className='text-sm text-zinc-500'>List of records</p>
                        </div>

                        <SearchInput
                            className='flex-1 sm:flex-none'
                            ref={searchInput}
                            formRef={form}
                            onReset={handleInputReset}
                            onSearch={handleInputSearch}
                            placeholder='Search records...'
                        />
                    </Table.Title>
                    <Table.Header>
                        <Table.HeaderCell className='basis-5/6'>Name</Table.HeaderCell>
                        <Table.HeaderCell className='basis-1/6' />
                    </Table.Header>

                    {renderContent()}

                    {!isEmptySearchQuery && (
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
        </>
    );
};

HomePage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default HomePage;
