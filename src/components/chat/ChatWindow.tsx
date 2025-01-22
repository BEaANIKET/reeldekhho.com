import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Info, Loader2Icon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageBubble } from './MessageBubble';
import { RootState } from '../../store/store';
import api from '../../services/api/axiosConfig';
import image from '/assets/image.png';
import { setMessages, addMessage, setChats } from '../../store/slices/chatSlice';

interface ChatWindowProps {
    chatId: string;
    chats: Array<{
        _id: string;
        profilePicture?: string;
        fullName: string;
    }>;
}

interface Message {
    _id: string;
    senderId: string;
    content: string;
    isOwn: boolean;
    timestamp: string;
}

export default function ChatWindow({ chatId, chats }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socket = useSelector(state => state?.socket?.value)
    const chat = chats.find((c) => c._id === chatId);
    const chatMessages = useSelector((state: RootState) => state.chat.messages[chatId] || []);
    const dispatch = useDispatch();


    useEffect(() => {
        const fetchMessagesAndChatDetails = async () => {
            if (!chatId) return;

            try {
                if (!chat) {
                    const userResponse = await api.get(`/user/info?id=${chatId}`);
                    const user = userResponse.data;
                    dispatch(setChats((prevChats) => {
                        if (!prevChats.find((c) => c._id === user._id)) {
                            return [...prevChats, user];
                        }
                        return prevChats;
                    }));
                }

                setLoading(true);
                const messagesResponse = await api.get(`/message/get?id=${chatId}`);
                dispatch(setMessages({ chatId, messages: messagesResponse.data.messages || [] }));
            } catch (error) {
                console.error('Error fetching messages or chat details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessagesAndChatDetails();
    }, [chatId, chat, dispatch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const response = await api.post(`/message/send?id=${chatId}`, { message: newMessage });
            dispatch(addMessage({ chatId, message: response.data.chat }));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!chat) return <div className="p-4 text-gray-500">Loading chat...</div>;

    return (
        <div className="h-full w-full overflow-x-hidden flex flex-col dark:bg-gray-900">
            {/* Chat Header */}
            <div className="p-4 border-b w-full dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900">
                <div className="flex items-center space-x-3">
                    <img
                        src={chat.profilePicture || image}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium dark:text-white">{chat.fullName}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        <Info className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[calc(100vh-12rem)]">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2Icon className="animate-spin text-blue-500 w-6 h-6" />
                    </div>
                ) : chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet. Start messaging!</div>
                ) : (
                    chatMessages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            message={message}
                            isOwn={message.isOwn}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t w-full dark:border-gray-700 bg-white dark:bg-gray-900">
                <form onSubmit={handleSend}>
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none dark:text-white"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || loading}
                            className="p-2 text-blue-500 disabled:opacity-50"
                        >
                            {loading ? <Loader2Icon className="animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
