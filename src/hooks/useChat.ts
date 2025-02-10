import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../services/api/axiosConfig';
import { RootState } from '../store/store';
import { setMessages, setChats, addMessage, setSelectedChat, setUnseenCount, addCharts } from '../store/slices/chatSlice';

const useChat = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const socket = useSelector((state: RootState) => state.socket.value);
    const chats = useSelector((state: RootState) => state.chat.chats);
    const logedinUser = useSelector((state: RootState) => state.auth.user);
    const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
    const unseenCountMessage = useSelector(state => state?.chat?.unSeenCount);

    /**
     * Fetch all chats for the logged-in user.
     */
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get('/message/getee');
                //(response.data, 'User chats:');
                if (response.data && Array.isArray(response.data)) {
                    dispatch(setChats(response.data));
                } else {
                    console.error('Invalid response format for chats');
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();
    }, [dispatch, logedinUser]);

    /**
     * Fetch messages for a specific chat by its user ID.
     */
    const fetchChatByUserId = async (chatId: string) => {
        try {
            const response = await api.get(`/message/get?id=${chatId}`);
            //(response.data, "fdsfsdfsdf");

            const messages = response.data?.conversation?.messages;
            const unseenMessage = response?.data?.unseenCount;
            //(unseenMessage);

            if (messages) {
                dispatch(setUnseenCount({ userId: chatId, unseenCount: unseenMessage }));
                dispatch(setMessages({ chatId, messages }));
            } else {
                console.error('No messages found for chat:', chatId);
            }
        } catch (error) {
            console.error('Error fetching chat by ID:', error);
        }
    };

    useEffect(() => {
        if (chats && chats.length) {
            chats.forEach(chat => {
                fetchChatByUserId(chat._id);
            });
        }
    }, [chats, logedinUser]);

    const fetchAndAddUser = async (chatId: string) => {
        try {
            const response = await api.get(`/message/info?id=${chatId}`);
            const user = response.data?.user;
            if (user) {
                dispatch(addCharts(user));
            }
        } catch (error) {
            console.error("Error fetching new user info:", error);
        }
    };

    /**
     * Listen for new messages via the socket.
     */
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: any) => {
            //('New message received:', data);
            if (!chats.some(chat => chat._id === data.senderId) && logedinUser?._id !== data.senderId) {
                fetchAndAddUser(data.senderId);
                dispatch(setUnseenCount({ userId: data.senderId, unseenCount: 1 }));
            } else {
                //(unseenCountMessage);
                if (logedinUser?._id !== data.senderId) {
                    const currentUnseenCount = unseenCountMessage[data.senderId] || 0;
                    dispatch(setUnseenCount({ userId: data.senderId, unseenCount: currentUnseenCount + 1 }));
                }
            }
            dispatch(addMessage({ chatId: data?.senderId, message: data }));
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, dispatch, chats, unseenCountMessage, logedinUser]);




    return {
        fetchChatByUserId,
        selectedChat,
        chats,
    };
};

export default useChat;
