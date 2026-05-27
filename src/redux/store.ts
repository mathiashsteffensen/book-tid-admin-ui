import { configureStore } from "@reduxjs/toolkit"
import { useMemo } from "react"
import { Store } from "redux"

import { ModalState } from "src/redux/slices/modalSlice"
import { modalReducer, toastReducer } from "src/redux/slices/reducers"
import { ToastState } from "src/redux/slices/toastSlice"

let store: Store | undefined

export interface State {
    modal: ModalState
    toast: ToastState
}

function initStore(initialState: State) {
    return configureStore({
        reducer: {
            modal: modalReducer,
            toast: toastReducer,
        },
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ["modal/showModal"],
                },
            }),
    })
}

export const initializeStore = (preloadedState: State) => {
    let _store = store ?? initStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = initStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === "undefined") return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState: State): Store {
    return useMemo(() => initializeStore(initialState), [initialState])
}
