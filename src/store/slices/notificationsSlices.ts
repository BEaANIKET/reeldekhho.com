import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
    id: string;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    user: {
        _id: string;
        profilePicture: string;
        fullName: string;
    };
    referenceId: string;
    seen: boolean;
}

interface NotificationsState {
    notifications: Notification[];
    unseenNotiCount: number;
}

const initialState: NotificationsState = {
    notifications: [],
    unseenNotiCount: 0,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.unseenNotiCount = action.payload.filter(notif => !notif.seen).length;
        },
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.seen) {
                state.unseenNotiCount += 1;
            }
        },
        markAllAsSeen: (state) => {
            state.notifications = state.notifications.map(notif => ({ ...notif, seen: true }));
            state.unseenNotiCount = 0;
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.map(notif =>
                notif.id === action.payload ? { ...notif, isRead: true } : notif
            );
        },
        setUnSeenCount: (state, action) => {
            state.unseenNotiCount = action.payload;
        }
    },
});

export const { setNotifications, addNotification, markAllAsSeen, markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;

