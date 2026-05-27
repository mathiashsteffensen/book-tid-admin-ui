import { createSlice } from "@reduxjs/toolkit"
import { ReactNode } from "react"

import { ToastProps } from "src/components/agnostic"

export interface ShowToastActionPayload {
    id: string
    content: ReactNode
    severity?: ToastProps["severity"]
    onClose?: () => void
}

export interface ShowToastAction {
    type: string
    payload: ShowToastActionPayload
}

export interface CloseToastActionPayload {
    id: string
}

export interface CloseToastAction {
    type: string
    payload: CloseToastActionPayload
}

export interface ToastState {
    stack: Array<ShowToastActionPayload>
}

const initialState: ToastState = {
    stack: [],
}

const toastSlice = createSlice({
    name: "toast",
    initialState: initialState,
    reducers: {
        showToast(state: ToastState, action: ShowToastAction) {
            if (!state.stack) {
                state.stack = []
            }
            state.stack.push(action.payload)
        },
        closeToast(state: ToastState, action: CloseToastAction) {
            state.stack = state.stack.filter(
                (toast) => toast.id !== action.payload.id
            )
        },
    },
})

export const { showToast, closeToast } = toastSlice.actions

export default toastSlice.reducer
