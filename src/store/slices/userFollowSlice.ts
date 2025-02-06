import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    follower:[],
    following: []
}

const userFollowSlice= createSlice({
    name: 'userFollow',
    initialState,
    reducers: {
        setUserFollow: (state,action) => {
            if(action.payload.follower){
                state.follower= action.payload.follower
            }
            if(action.payload.following){
                state.following= action.payload.following
            }
        },
    }
})

export const { setUserFollow } = userFollowSlice.actions;
export default userFollowSlice.reducer;