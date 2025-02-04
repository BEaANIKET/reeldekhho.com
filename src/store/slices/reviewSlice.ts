import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    reviewedUser:[]
}

const reviewSlice= createSlice({
    name:'reviews',
    initialState,
    reducers: {
        setReviews: (state, action) => {
            state.reviewedUser= action.payload
        },

        updateReviews: (state, action) => {
            state.reviewedUser= [ ...state.reviewedUser,action.payload ]
        }
    }
});

export const { setReviews,updateReviews }= reviewSlice.actions;
export default reviewSlice.reducer;

