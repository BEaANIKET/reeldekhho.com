import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  posts: null,
  isMute: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserProfile: (state, actions) => {
      state.user = actions.payload;
      state.isAuthenticated = !!state.user
    },
    setUserPost: (state, actions) => {
      state.posts = actions.payload;
    },
    updateParticularPost: (state, action) => {
      state.posts[action.payload.index]= action.payload.post 
    },
    updateMyPosts: (state, action) => {
      if(state.posts){
        state.posts= [ ...state.posts, action.payload ]
      }
    },
    setUserMute: (state, action) => {
      state.isMute = action.payload
    }
  },
});

export const { setUserProfile, setUserPost, updateParticularPost,updateMyPosts, setUserMute } = authSlice.actions;
export default authSlice.reducer;