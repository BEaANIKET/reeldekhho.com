import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import useChat from '../hooks/useChat';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function MessagesPage() {
    const navigate = useNavigate();
    const user = useSelector((state) => state?.auth?.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, []);

    const { chats, selectedChat } = useChat();

    return (
        <div className="h-[calc(100vh-4rem)] w-full flex bg-white dark:bg-gray-900 overflow-hidden">
            {/* Chat List */}
            <div
                className={`${selectedChat ? 'hidden md:block' : 'block'
                    } w-full md:w-96 border-r dark:border-gray-700 overflow-y-auto`}
            >
                <ChatList
                    chats={chats}
                    onSelectChat={(chatId) => {
                        navigate(`/messages/${chatId}`);
                    }}
                />
            </div>

            {/* Chat Window */}
            <div
                className={`${selectedChat ? 'block' : 'hidden'
                    } md:block w-full h-full overflow-hidden`}
            >
                {selectedChat ? (
                    <div className="h-full w-full flex flex-col">
                        {/* Back button for mobile view */}
                        <button
                            onClick={() => navigate('/messages')}
                            className="md:hidden p-4 flex items-center text-gray-600 dark:text-gray-300"
                        >
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            Back to messages
                        </button>
                        <div className="w-full h-full overflow-y-auto">
                            <ChatWindow chats={chats} chatId={selectedChat._id} />
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
}
