import { useDispatch, useSelector } from "react-redux"

import { Text, Toast } from "src/components/agnostic"
import { State, closeToast } from "src/redux"

const TOAST_AUTO_HIDE_DURATION = 5000

export const ReduxToastStack = () => {
    const dispatch = useDispatch()
    const stack = useSelector((state: State) => state.toast.stack)
    const handleClose = (id: string) => () => dispatch(closeToast({ id }))

    return (
        <>
            {stack.map(({ id, content, severity }) => (
                <Toast
                    key={id}
                    open={true}
                    onClose={handleClose(id)}
                    severity={severity}
                    autoHideDuration={TOAST_AUTO_HIDE_DURATION}
                >
                    <Text>{content}</Text>
                </Toast>
            ))}
        </>
    )
}
