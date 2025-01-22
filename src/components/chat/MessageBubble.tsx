

import { format } from "date-fns";
import { enIN } from "date-fns/locale";

interface Message {
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
}

interface MessageBubbleProps {
    message: Message;
    isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    // Format timestamp in Indian style
    const formattedTimestamp = format(new Date(message.createdAt), "dd MMM yyyy, hh:mm a", {
        locale: enIN,
    });

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} my-2`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
            >
                <p className="whitespace-pre-wrap break-words">{message.message}</p>
                <span
                    className={`block text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    {formattedTimestamp}
                </span>
            </div>
        </div>
    );
}

