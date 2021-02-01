import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: 'default',
    reducers: {
        changeTheme(state, action) {
            if (state === 'default') state = 'dark';
            else state = 'default';
        },
    },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
