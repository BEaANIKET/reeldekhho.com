import { useState } from 'react';
import { Search } from 'lucide-react';
import { ChatPreview } from './ChatPreview';
import { useNavigate } from 'react-router-dom';

export default function ChatList({ onSelectChat, chats }: { onSelectChat: (chatId: string) => void, chats: [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    // console.log(chats);

    const filteredChats = chats?.filter(chat =>
        chat?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const navigate = useNavigate()

    return (
        <div className="h-full flex flex-col overflow-y-scroll border-r dark:border-gray-700">
            <div className="p-4 border-b dark:border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search messages"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 pl-8 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none dark:text-white"
                    />
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredChats?.map(chat => (
                    <ChatPreview
                        key={chat._id}
                        chat={chat}
                        onClick={() => navigate('/messages/' + chat._id)}
                    />
                ))}
            </div>
        </div>
    );
}