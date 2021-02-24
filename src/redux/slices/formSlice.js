import { createSlice } from '@reduxjs/toolkit'

const initialState =  {
    isOpen: false,
    props: {}
}

const formSlice = createSlice({
    name: 'form',
    initialState: initialState,
    reducers: {
        showForm(state, action) {
            state.isOpen = true
            state.type = action.payload.type
            state.props = action.payload.props
        },
        hideForm(state) {
            state.isOpen = false
            state.type = undefined
            state.props = {}
        }
    }
})

export const { showForm, hideForm } = formSlice.actions

export default formSlice.reducer