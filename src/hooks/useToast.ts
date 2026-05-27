import { useDispatch } from "react-redux"

import { closeToast, showToast } from "src/redux"

export const useToast = (params: Parameters<typeof showToast>[0]) => {
    const dispatch = useDispatch()

    return {
        show: () => dispatch(showToast(params)),
        close: () => dispatch(closeToast({ id: params.id })),
    }
}
