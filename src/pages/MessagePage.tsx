import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function MessagesPage() {
    const navigate = useNavigate();
    const user = useSelector((state) => state?.auth?.user);
    const { id } = useParams();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const users = useSelector((state) => state.chat?.chats);


    return (
        <div className="h-[calc(100vh-4rem)] w-full flex bg-white dark:bg-gray-900 overflow-hidden">
            {/* Chat List Section */}
            <div
                className={`${id ? 'hidden md:block' : 'block'} 
                    w-full md:w-96 border-r dark:border-gray-700 overflow-y-auto`}
            >
                <ChatList
                    onSelectChat={(chatId) => navigate(`/messages/${chatId}`)}
                />
            </div>

            {/* Chat Window Section */}
            <div
                className={`${id ? 'block' : 'hidden'} 
                    md:block w-full h-full overflow-hidden`}
            >
                {id ? (
                    <div className="h-full w-full flex flex-col">
                        {/* Mobile Back Button */}
                        <button
                            onClick={() => navigate('/messages')}
                            className="md:hidden p-4 flex items-center text-gray-600 dark:text-gray-300"
                        >
                            <ArrowLeft className="w-6 h-6 mr-2" />
                            Back to messages
                        </button>
                        {/* Chat Window */}
                        <div className="w-full h-full overflow-y-auto">
                            <ChatWindow users={users} chatId={id} />
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
