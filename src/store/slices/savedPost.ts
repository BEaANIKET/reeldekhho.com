import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    saved_Posts: []
}

const SavedPostSlice = createSlice({
    name: 'savedPosts',
    initialState,
    reducers: {
        setSavedPosts: (state, action) => {
            state.saved_Posts = action.payload
        },
        updateSavedPost: (state, action) => {
            state.saved_Posts = [...state.saved_Posts, action.payload]
        },
        removePost: (state, action) => {
            // console.log(action.payload._id);  
            state.saved_Posts = [...state.saved_Posts.filter((post) => post?.postId?._id !== action.payload._id)]
        }
    }
});

export const { setSavedPosts, updateSavedPost, removePost } = SavedPostSlice.actions;
export default SavedPostSlice.reducer