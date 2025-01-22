import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/chatSlice';
import api from '../services/api/axiosConfig';

interface Message {
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
}

export function useChat(chatUserId) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const sendMessage = async (message: string): Promise<Message | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post(`/messsage/send?id=${chatUserId}`, {
                message,
            });

            dispatch(addMessage({ chatUserId, }));
            return message;
        } catch (err) {
            setError('Failed to send message');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendMessage,
        isLoading,
        error,
    };
}