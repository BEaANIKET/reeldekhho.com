import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import chatReducer from './slices/chatSlice';
import postSlices from './slices/postSlices'
import savedPostSlice from './slices/savedPost'
import socketReducer from './slices/socketSlices';
import notificationsSlices from './slices/notificationsSlices'
import reviewSlice from './slices/reviewSlice'
import userFollowSlice from './slices/userFollowSlice'
import SellerDataSlice from './slices/sellerSlice'
import headersSlice from './slices/headersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    chat: chatReducer,
    post: postSlices,
    savedPosts: savedPostSlice,
    socket: socketReducer,
    notifications: notificationsSlices,
    reviews: reviewSlice,
    userFollow: userFollowSlice,
    SellerSlice: SellerDataSlice,
    header: headersSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.value'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
