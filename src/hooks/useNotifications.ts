import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import api from '../services/api/axiosConfig';
import { addNotification, markAllAsSeen, setNotifications } from '../store/slices/notificationsSlices';

const useNotifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notifications?.notifications);
    const unseenCount = useSelector((state: RootState) => state?.notifications?.unseenNotiCount);
    const socket = useSelector((state: RootState) => state.socket.value);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/notification/get');
                dispatch(setNotifications(response.data.notifications));
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (notification: any) => {
            dispatch(addNotification(notification));
        };

        socket.on('newNotifications', handleNewNotification);

        return () => {
            socket.off('newNotifications', handleNewNotification);
        };
    }, [socket, dispatch]);


    return {
        notifications,
        unseenCount,
    };
};

export default useNotifications;