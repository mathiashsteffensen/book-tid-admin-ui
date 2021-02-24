import { useMemo } from 'react'
import { Store } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { formReducer } from './slices/reducers'

let store: Store | undefined

export interface State {
    form: {
        isOpen: boolean,
        type: 'category' | 'service' | 'avatar' | 'color' | 'opening-hours' | 'customer' | 'appointment' | undefined,
        props: {
            [property: string]: any
        }
    }
}

function initStore(initialState: State) {
    return configureStore({
        reducer: {
            form: formReducer
        },
        preloadedState: initialState
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
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store
  
    return _store
}
  
export function useStore(initialState: State): Store {
    const store = useMemo(() => initializeStore(initialState), [initialState])
    return store
}