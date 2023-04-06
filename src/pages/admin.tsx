import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from './_app';
import { api } from '~/utils/api';
import { useState } from 'react';
import Pagination from '~/components/Pagination';
import { ListPlus, MagnifyingGlass } from '@phosphor-icons/react';
import ScrollArea from '~/components/ScrollArea';
import { twMerge } from 'tailwind-merge';
import Input from '~/components/Input';
import Loading from '~/components/Loading';

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

const AdminPage: NextPageWithLayout = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const { data: pageCount } = api.admin.getClinicPageCount.useQuery();
    const { data, isLoading } = api.admin.listClinics.useQuery({
        pageNumber,
    });
    const areRecordsLoading = isLoading || !data;

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchTerm = formData.get('searchTerm') as string;

        if (searchTerm) {
            console.log(searchTerm);
        }
    };

    return (
        <div className='flex h-full flex-1'>
            <div className='m-2 flex flex-col rounded border border-zinc-200 bg-zinc-50 sm:mx-auto sm:my-8 sm:w-[768px]'>
                <header className='mb-6 flex items-center justify-between gap-4 p-4'>
                    <button className='flex items-center justify-center gap-2 rounded bg-zinc-700 p-2 text-zinc-200 transition-colors hover:bg-zinc-800 sm:px-6 sm:py-2'>
                        <ListPlus className='h-6 w-6 text-inherit' />
                        <span className='hidden sm:block'>Add Clinic</span>
                    </button>
                    <form onSubmit={handleSearch}>
                        <Input
                            name='searchTerm'
                            placeholder='Search clinics...'
                            endIcon={
                                <button className='flex h-full w-full items-center justify-center'>
                                    <MagnifyingGlass className='h-6 w-6 text-inherit' />
                                </button>
                            }
                            endIconClassName='pointer-events-auto cursor-pointer hover:text-zinc-700 transition-colors'
                        />
                    </form>
                </header>

                <main className='flex h-32 flex-1 flex-col overflow-hidden'>
                    <div className='flex border-b border-zinc-200 shadow-sm'>
                        <div className='basis-1/2 px-4 py-2 text-left text-sm font-semibold text-zinc-700'>
                            Clinic Name
                        </div>
                        <div className='basis-1/2 px-4 py-2 text-left text-sm font-semibold text-zinc-700'>
                            Address
                        </div>
                    </div>
                    {areRecordsLoading ? (
                        <div className='flex-1'>
                            <Loading />
                        </div>
                    ) : (
                        <ScrollArea.Root>
                            <ScrollArea.Viewport>
                                {data.map((clinic, index, array) => {
                                    const isLast = index === array.length - 1;

                                    return (
                                        <div
                                            className='flex cursor-pointer transition-colors hover:bg-zinc-100'
                                            key={clinic.id}
                                        >
                                            <div
                                                className={twMerge(
                                                    'basis-1/2 border-b border-zinc-200 px-4 py-4',
                                                    isLast &&
                                                        'border-transparent'
                                                )}
                                            >
                                                {clinic.name}
                                            </div>
                                            <div
                                                className={twMerge(
                                                    'basis-1/2 border-b border-zinc-200 px-4 py-4',
                                                    isLast &&
                                                        'border-transparent'
                                                )}
                                            >
                                                {clinic.address}
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
                        total={pageCount ?? 0}
                        initialPage={pageNumber}
                        onChange={setPageNumber}
                    />
                </footer>
            </div>
        </div>
    );
};

AdminPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default AdminPage;
