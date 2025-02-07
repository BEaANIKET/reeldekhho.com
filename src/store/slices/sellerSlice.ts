import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    sellerPost: [],
    seller:[]
}

const SellerPostSlice= createSlice({
    name: 'SellerSlice',
    initialState,
    reducers: {
        setSellerData: (state,action) => {
            state.sellerPost= action.payload.post,
            state.seller= action.payload.seller
        }
    }
});

export const { setSellerData }= SellerPostSlice.actions;
export default SellerPostSlice.reducer;