import { createSlice } from "@reduxjs/toolkit"
import { ReactNode } from "react"

export interface ShowModalActionPayload {
    type?: "dialog" | "modal"
    id: string
    title: string
    content: ReactNode
    onClose?: () => void
    size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export interface ShowModalAction {
    type: string
    payload: ShowModalActionPayload
}

export interface ModalState {
    stack: Array<ShowModalActionPayload>
}

const initialState: ModalState = {
    stack: [],
}

const modalSlice = createSlice({
    name: "modal",
    initialState: initialState,
    reducers: {
        showModal(state: ModalState, action: ShowModalAction) {
            if (!state.stack) {
                state.stack = []
            }
            state.stack.push(action.payload)
        },
        closeModal(state: ModalState) {
            state.stack.pop()
        },
    },
})

export const { showModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
