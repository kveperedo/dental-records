import AlertDialog from "~/components/AlertDialog";

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

export default RemoveClinicDialog;