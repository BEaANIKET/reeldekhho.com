import { createSlice } from "@reduxjs/toolkit";

const slices = createSlice({
    name: "socket",
    initialState: {
        value: null
    },
    reducers: {
        setSocket: (state, action) => {
            state.value = action.payload
        }
    }
});



export const { setSocket } = slices.actions;
export default slices.reducer;