interface Chat {
    id: string;
    username: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}
import image from '/assets/image.png'

export function ChatPreview({ chat, onClick, unSeenCount }: { chat: Chat; onClick: () => void; unSeenCount: number }) {

    return (
        <button
            onClick={onClick}
            className="w-full p-4 flex relative items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
            <img
                src={chat.profilePicture || image}
                alt={'Load..'}
                className="w-12 h-12 overflow-hidden rounded-full object-cover"
            />

            <div className="flex-1 text-left">
                <div className="flex justify-between items-center">
                    <span className={`font-medium dark:text-white ${chat?.unread ? 'font-semibold' : ''}`}>
                        {chat.fullName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat?.timestamp}
                    </span>
                </div>
                <p className={`text-sm truncate ${chat?.unread
                    ? 'text-black dark:text-white font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {chat?.lastMessage}
                </p>
            </div>

            {unSeenCount ? (
                <div className=' flex items-center justify-center '>
                    <p className=' text-blue-500 font-bold '> {unSeenCount} </p>
                    <div className="w-4 h-4 absolute top-3 left-2 rounded-full bg-blue-500" />
                </div>
            ) : null}
        </button>
    );
}