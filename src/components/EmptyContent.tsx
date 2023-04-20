import { Button } from './Button';

type EmptyContentProps = {
    title?: string;
    description?: string;
    actionText: React.ReactNode;
    onClick: () => void;
};

const EmptyContent = ({
    title,
    description,
    actionText,
    onClick,
}: EmptyContentProps) => {
    return (
        <div className='flex flex-col items-center gap-1'>
            <p className='text-center text-xl font-semibold'>{title}</p>
            <p className='mb-2 text-center text-sm text-zinc-600'>
                {description}
            </p>
            <Button variant='outline' onClick={onClick}>
                {actionText}
            </Button>
        </div>
    );
};

export default EmptyContent;
