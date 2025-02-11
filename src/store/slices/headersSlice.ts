import { createSlice } from "@reduxjs/toolkit";

const headerSlices = createSlice({
    name: 'header',
    initialState: {
        value: [],
        settin: [],
    },
    reducers: {
        setSetting: (state, payload) => {
            state.settin = payload.payload;
        },
        setValue: (state, payload) => {
            state.value = payload.payload;
        }
    },
})

export const { setSetting, setValue } = headerSlices.actions
export default headerSlices.reducer