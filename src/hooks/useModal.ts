import { ReactNode } from "react"
import { useDispatch } from "react-redux"

import { closeModal, showModal } from "src/redux"
import { ShowModalActionPayload } from "src/redux/slices/modalSlice"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useModal = <TContentFunction extends (...args: any) => ReactNode>({
    content,
    onClose,
    ...rest
}: {
    content: TContentFunction
} & Omit<ShowModalActionPayload, "content">) => {
    const dispatch = useDispatch()

    return {
        show: (...args: Parameters<TContentFunction>) =>
            dispatch(showModal({ content: content(...args), ...rest })),
        close: () => {
            onClose?.()
            dispatch(closeModal())
        },
    }
}
