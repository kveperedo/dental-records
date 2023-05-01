import type { GetServerSideProps } from 'next';
import MainLayout from '~/components/MainLayout';
import { getServerAuthSession } from '~/server/auth';
import type { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import { ArrowLeft, PencilSimple, Trash } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import { Button } from '~/components/Button';
import useBreakpoints from '~/hooks/useBreakpoints';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import SuperJSON from 'superjson';
import { api } from '~/utils/api';
import Tooltip from '~/components/Tooltip';
import { useAlertDialog } from '~/context/AlertDialogContext';
import { useToast } from '~/hooks/useToast';
import Loading from '~/components/Loading';
import { useMemo, useState } from 'react';
import RecordDetailsDialog from '~/feature/record/RecordDetailsDialog';
import { parseDate, getLocalTimeZone } from '@internationalized/date';
import dayjs from 'dayjs';
import { DISPLAY_DATE_FORMAT } from '~/constants';
import ScrollArea from '~/components/ScrollArea';
import { GENDER_LABEL, MARITAL_STATUS_LABEL } from '~/feature/record/constants';

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
        transformer: SuperJSON,
    });

    await helpers.record.getRecordDetailsById.prefetch(id);

    return {
        props: {
            trpcState: helpers.dehydrate(),
            id,
        },
    };
};

const RecordSlugPage: NextPageWithLayout<{ id: string }> = ({ id }) => {
    const router = useRouter();
    const { toast } = useToast();
    const showDialog = useAlertDialog();
    const utils = api.useContext();
    const { sm } = useBreakpoints();
    const [showUpdateRecordDialog, setShowUpdateRecordDialog] = useState(false);

    const { data: recordDetails } = api.record.getRecordDetailsById.useQuery(id);
    const { mutate: deleteRecord, isLoading: isDeletingRecord } =
        api.record.deleteRecord.useMutation({
            onSuccess: () => {
                toast({
                    title: 'Delete Record',
                    description: `Successfully deleted record.`,
                });
                void utils.record.invalidate();
            },
        });
    const { mutate: updateRecord, isLoading: isUpdatingRecord } =
        api.record.updateRecord.useMutation({
            onSuccess: () => {
                toast({
                    title: 'Update Record',
                    description: `Successfully updated record.`,
                });
                setShowUpdateRecordDialog(false);
                void utils.record.invalidate();
            },
        });
    const updateFormValues = useMemo(() => {
        if (!recordDetails) {
            return undefined;
        }

        return {
            ...recordDetails,
            birthDate: parseDate(dayjs(recordDetails.birthDate).format('YYYY-MM-DD')),
        };
    }, [recordDetails]);

    const handleDeleteRecord = async () => {
        const confirmed = await showDialog({
            title: 'Remove Record?',
            description:
                "Are you sure you want to remove this record? All existing info and transactions will be deleted and this action can't be undone.",
            actionButton: 'Remove Record',
        });

        if (confirmed) {
            deleteRecord(id);
            void router.push('/');
        }
    };

    if (!recordDetails) {
        return <div>No record found</div>;
    }

    if (isDeletingRecord) {
        return <Loading />;
    }

    return (
        <>
            <Head>
                <title>Record | {recordDetails.name}</title>
            </Head>
            <div className='container mx-auto flex h-full flex-1 flex-col p-2 md:px-0 md:py-6'>
                <header className='flex items-center justify-between gap-2 pb-2 md:pb-4'>
                    <Tooltip.Root>
                        <Tooltip.Trigger>
                            <Button
                                className='w-10 p-0'
                                variant='ghost'
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className='h-5 w-5' />
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>Back</Tooltip.Content>
                    </Tooltip.Root>
                    <div className='mr-auto truncate'>
                        <h1 className='truncate text-2xl font-semibold'>{recordDetails?.name}</h1>
                    </div>
                    <Button
                        onClick={() => setShowUpdateRecordDialog(true)}
                        className='shrink-0'
                        size={sm ? 'default' : 'icon'}
                        variant='secondary'
                    >
                        <PencilSimple weight='fill' className='h-4 w-4 sm:hidden' />
                        <span className='hidden sm:block'>Edit info</span>
                    </Button>
                    <Button
                        onClick={() => void handleDeleteRecord()}
                        className='shrink-0'
                        size={sm ? 'default' : 'icon'}
                        variant='destructive'
                    >
                        <Trash weight='fill' className='h-4 w-4 sm:hidden' />
                        <span className='hidden sm:block'>Delete</span>
                    </Button>
                </header>
                <div className='flex h-full w-full flex-1 flex-col overflow-hidden rounded border border-zinc-200 bg-zinc-50 md:w-96'>
                    <div className='border-b border-zinc-200 p-4'>
                        <p className='text-lg font-semibold'>Personal Information</p>
                    </div>
                    <ScrollArea.Root className='flex-1'>
                        <ScrollArea.Viewport>
                            <div className='flex flex-col gap-3 p-4'>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Name</p>
                                    <p className='font-medium'>{recordDetails.name}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Address</p>
                                    <p className='font-medium'>{recordDetails.address || '-'}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Birth Date</p>
                                    <p className='font-medium'>
                                        {dayjs(recordDetails.birthDate).format(DISPLAY_DATE_FORMAT)}
                                    </p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Gender</p>
                                    <p className='font-medium'>
                                        {GENDER_LABEL[recordDetails.gender]}
                                    </p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Marital Status</p>
                                    <p className='font-medium'>
                                        {MARITAL_STATUS_LABEL[recordDetails.status]}
                                    </p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Telephone</p>
                                    <p className='font-medium'>
                                        {recordDetails.telephone || '-'}
                                    </p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='text-zinc-500'>Occupation</p>
                                    <p className='font-medium'>
                                        {recordDetails.occupation || '-'}
                                    </p>
                                </div>
                            </div>
                        </ScrollArea.Viewport>
                    </ScrollArea.Root>
                </div>
            </div>
            <RecordDetailsDialog
                open={showUpdateRecordDialog}
                onOpenChange={setShowUpdateRecordDialog}
                loading={isUpdatingRecord}
                defaultValues={updateFormValues}
                onSubmit={(data) =>
                    updateRecord({
                        ...data,
                        recordId: id,
                        birthDate: data.birthDate.toDate(getLocalTimeZone()),
                    })
                }
            />
        </>
    );
};

RecordSlugPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>;
};

export default RecordSlugPage;
