import { createSlice } from "@reduxjs/toolkit"

import { User } from "src/types"

export interface SignedInUserState {
    user: User
    isSignedIn: true
}

export interface NotSignedInUserState {
    user: undefined
    isSignedIn: false
}

export type UserState = SignedInUserState | NotSignedInUserState

const initialState: UserState = {
    user: undefined,
    isSignedIn: false,
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {},
})

export const {} = userSlice.actions

export default userSlice.reducer
