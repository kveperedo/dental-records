import {
    createContext,
    useCallback,
    useContext,
    useReducer,
    useRef,
} from 'react';
import AlertDialog from '~/components/AlertDialog';

const AlertDialogContext = createContext<
    ((params: AlertAction) => Promise<boolean>) | undefined
>(undefined);

export type AlertAction =
    | {
          type: 'confirm';
          title: string;
          description?: string;
          cancelButton?: string;
          actionButton?: string;
      }
    | { type: 'close' };

interface AlertDialogState {
    open: boolean;
    title: string;
    description: string;
    cancelButton: string;
    actionButton: string;
    defaultValue?: string;
    inputProps?: React.PropsWithoutRef<
        React.DetailedHTMLProps<
            React.InputHTMLAttributes<HTMLInputElement>,
            HTMLInputElement
        >
    >;
}

const alertDialogReducer = (
    state: AlertDialogState,
    action: AlertAction
): AlertDialogState => {
    switch (action.type) {
        case 'close':
            return { ...state, open: false };
        case 'confirm':
            return { ...state, ...action, open: true };
        default:
            return state;
    }
};

export const AlertDialogProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [state, dispatch] = useReducer(alertDialogReducer, {
        open: false,
        title: '',
        description: '',
        cancelButton: 'Cancel',
        actionButton: 'Submit',
    });

    const resolveRef = useRef<(boolean: boolean) => void>();

    function close() {
        dispatch({ type: 'close' });
        resolveRef.current?.(false);
    }

    function confirm() {
        dispatch({ type: 'close' });
        resolveRef.current?.(true);
    }

    const dialog = useCallback(async <T extends AlertAction>(params: T) => {
        dispatch(params);

        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    return (
        <AlertDialogContext.Provider value={dialog}>
            {children}
            <AlertDialog.Root
                open={state.open}
                onOpenChange={(open) => {
                    if (!open) close();
                    return;
                }}
            >
                <AlertDialog.Content>
                    <AlertDialog.Header>
                        <AlertDialog.Title>{state.title}</AlertDialog.Title>
                        {state.description ? (
                            <AlertDialog.Description>
                                {state.description}
                            </AlertDialog.Description>
                        ) : null}
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                        <AlertDialog.Cancel type='button'>
                            {state.cancelButton}
                        </AlertDialog.Cancel>
                        <AlertDialog.Action onClick={confirm}>
                            {state.actionButton}
                        </AlertDialog.Action>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </AlertDialogContext.Provider>
    );
};

type Params<T extends 'confirm'> = Omit<
    Extract<AlertAction, { type: T }>,
    'type'
>;

export const useAlertDialog = () => {
    const dialog = useContext(AlertDialogContext);

    if (!dialog) {
        throw new Error(
            'useAlertDialog must be used within AlertDialogProvider'
        );
    }

    const showDialog = useCallback(
        (params: Params<'confirm'>) => {
            return dialog({
                ...params,
                type: 'confirm',
            });
        },
        [dialog]
    );

    return showDialog;
};
