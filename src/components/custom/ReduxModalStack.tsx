import { DialogTitle } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"

import {
    Button,
    Dialog,
    Icon,
    Modal,
    Spacer,
    Text,
} from "src/components/agnostic"
import { State, closeModal } from "src/redux"

export const ReduxModalStack = () => {
    const dispatch = useDispatch()
    const stack = useSelector((state: State) => state.modal.stack)
    const handleClose = (onClose?: () => void) => async () => {
        await onClose?.()
        dispatch(closeModal())
    }

    return (
        <>
            {stack.map(({ id, title, content, size, type, onClose }, index) =>
                type === "dialog" ? (
                    <Dialog open={!!id} key={id} onClose={handleClose(onClose)}>
                        <DialogTitle>{title}</DialogTitle>

                        <Spacer horizontal={6} bottom={5}>
                            {content}
                        </Spacer>
                    </Dialog>
                ) : (
                    <Modal
                        open={!!id}
                        key={id}
                        onClose={handleClose(onClose)}
                        size={size || "md"}
                    >
                        <Modal.Content elevation={index + 1}>
                            <Modal.Header>
                                <Text size={3}>{title}</Text>

                                <Button
                                    variant="text"
                                    onClick={handleClose(onClose)}
                                >
                                    <Icon name="close" />
                                </Button>
                            </Modal.Header>

                            {content}
                        </Modal.Content>
                    </Modal>
                )
            )}
        </>
    )
}
