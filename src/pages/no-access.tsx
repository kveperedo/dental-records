import MainLayout from '~/components/MainLayout';
import type { NextPageWithLayout } from './_app';
import Head from 'next/head';
import EmptyContent from '~/components/EmptyContent';

const NoAccessPage: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>No Access</title>
            </Head>
            <div className='container mx-auto flex h-full flex-1 flex-col items-center justify-center p-2 md:px-0 md:py-6'>
                <EmptyContent
                    title='No access to records'
                    description="You must be assigned to a clinic before you are able to access that clinic's records. Please contact the admin to allow access."
                />
            </div>
        </>
    );
};

NoAccessPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default NoAccessPage;
