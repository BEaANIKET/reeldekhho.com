import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../services/api/axiosConfig';
import { RootState } from '../store/store';
import { setChats, setMessages, addMessage, setSelectedChat } from '../store/slices/chatSlice';

const useChat = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const socket = useSelector((state: RootState) => state.socket.value);
    const chats = useSelector((state: RootState) => state.chat.chats);
    // console.log("charts", chats);

    const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get('/message/getee');
                // console.log(response.data);

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
    }, [dispatch]);

    useEffect(() => {

        const fetchChatById = async (chatId: string) => {
            try {
                const response = await api.get(`/message/info?id=${chatId}`);
                const newChat = response.data?.user;
                if (newChat) {
                    // console.log("new charts", newChat);

                    dispatch(setChats([...chats, newChat]));
                    dispatch(setSelectedChat(response.data?.chat));
                }
            } catch (error) {
                console.error('Error fetching chat by ID:', error);
            }
        };

        if (id) {
            const chat = chats.find((chat) => chat._id === id);
            if (chat) {
                dispatch(setSelectedChat(chat));
            } else {
                fetchChatById(id);
            }
        } else {
            dispatch(setSelectedChat(null));
        }
    }, [id, chats, dispatch]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: any) => {
            console.log(data);

            dispatch(addMessage(data.senderId, data.message));
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, dispatch]);


    return { chats, selectedChat };
};

export default useChat;