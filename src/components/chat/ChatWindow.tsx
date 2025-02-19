import { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, Info, Loader2Icon, XCircle, Paperclip, Cross } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { MessageBubble } from "./MessageBubble";
import { RootState } from "../../store/store";
import api from "../../services/api/axiosConfig";
import defaultImage from "/assets/image.png";
import { addCharts, addMessage, setMessages, setSelectedChat, setUnseenCount } from "../../store/slices/chatSlice";
import toast from "react-hot-toast";
import { id } from "date-fns/locale";
import { updateUserProfile } from "../../store/slices/authSlice";

interface ChatWindowProps {
    chatId: string;
    users: Array<{
        _id: string;
        profilePicture?: string;
        fullName: string;
    }>;
}

export default function ChatWindow({ chatId, users }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [chat, setChat] = useState<{
        _id: string;
        profilePicture?: string;
        fullName: string;
    } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const chatMessages = useSelector(
        (state: RootState) => state.chat.messages[chatId] || []
    );
    const unSeenMsgCount = useSelector((state: RootState) => state.chat?.unSeenCount);
    const [sendLoading, setSendLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const markUnSeenMsg = async (chatId: string) => {
        if (unSeenMsgCount[chatId]) {
            try {
                const response = await api.post(`/message/setunseenmsg?id=${chatId}`);
                //(response.data);
            } catch (error) {
                console.error('Error marking unseen messages:', error);
            }
        }
    };

    useEffect(() => {
        dispatch(setSelectedChat(chatId));
        dispatch(setUnseenCount({ userId: chatId, unseenCount: 0 }));
        markUnSeenMsg(chatId);
    }, [chatId, chatMessages, dispatch]);

    const fetchAndAddUser = async () => {
        try {
            const response = await api.get(`/message/info?id=${chatId}`);
            const user = response.data?.user;
            if (user) {
                setChat(user);
            }
        } catch (error) {
            console.error("Error fetching new user info:", error);
        }
    };

    useEffect(() => {
        const selectedChat = users.find((user) => user._id === chatId);

        if (selectedChat) {
            setChat(selectedChat);
        } else {
            fetchAndAddUser();
        }
    }, [chatId, users]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, chatId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSendLoading(true);
        try {
            const response = await api.post(`/message/send?id=${chatId}`, { message: newMessage });
            const message = response.data.chat;

            dispatch(addMessage({ chatId, message }));

            const isUserInList = users ? users.some((user) => user._id === chatId) : false;

            if (!isUserInList && chat) {
                dispatch(addCharts(chat));
            }

            setNewMessage("");
            scrollToBottom();
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSendLoading(false);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);

        setUploadLoading(true);
        setUploadError(false);

        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.post(`/message/send?id=${chatId}`, formData);
            const message = response.data.chat;
            setFile(null)
            dispatch(addMessage({ chatId, message: message }));
            scrollToBottom();

        } catch (error) {
            // console.error("Error uploading file:", error);
            toast.error("unsupport file format ")
        } finally {
            setUploadLoading(false);
            setFile(null)

        }
    };

    const retryUpload = () => {
        if (file) {
            handleFileInput({ target: { files: [file] } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const removeFilePreview = () => {
        setUploadError(false);
    };
    // block feature

    const crntUser = useSelector((state) => state?.auth?.user);
    //(crntUser);

    const [blockLoading, setBlockLoading] = useState<boolean>(false);
    const [Block, setBlock] = useState({
        blockedBy: null,
        blockedMe: null,
    });

    useEffect(() => {
        const blockedMe = crntUser?.blockedBy?.find((id) => id === chat?._id);
        if (blockedMe) {
            setBlock((prev) => ({ ...prev, blockedMe: blockedMe }));
            return;
        } else {
            setBlock((prev) => ({ ...prev, blockedMe: null }));
        }
        const blockedId = crntUser?.block?.find((id) => id === chat?._id);
        if (blockedId) {
            setBlock((prev) => ({ ...prev, blockedBy: blockedId }));
            return;
        } else {
            setBlock((prev) => ({ ...prev, blockedBy: null }));
        }

    }, [chat, crntUser])

    const handleBlock = async () => {
        setBlockLoading(true);
        //(chat?._id);
        try {
            await api.post('/user/blockUser', { id: chat?._id });
            // setIsBlocked(chat?._id);
            const newArray = { ...crntUser, block: [...crntUser.block, chat?._id] };
            dispatch(updateUserProfile(newArray));
        } catch (error) {
            //(error);
            toast.error(error?.response?.data?.message || "something went wrong!");
        } finally {
            setBlockLoading(false)
        }
    }

    const handleUnblock = async () => {
        setBlockLoading(true);
        try {
            const response = await api.delete(`/user/unblockUser?id=${chat?._id}`);
            //(response.data);
            dispatch(updateUserProfile(response.data.user));
        } catch (error) {
            //(error);
            toast.error(error?.response?.data?.message || "something went wrong!");
        } finally {
            setBlockLoading(false)
        }
    }

    return (
        <div className="h-full w-full flex flex-col dark:bg-gray-900">
            {chat ? (
                <>
                    {/* Chat Header */}
                    <div className="h-full w-full overflow-x-hidden flex flex-col dark:bg-gray-900">
                        {/* Chat Header */}
                        <div className="p-4 border-b w-full dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-900">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={chat.profilePicture || defaultImage}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="font-medium dark:text-white">{chat.fullName}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {
                                    Block.blockedBy ?
                                        <button
                                            disabled={blockLoading}
                                            onClick={handleUnblock}
                                            className="flex justify-center items-center text-red-500 w-[80px] h-[40px] font-medium border px-3 py-1.5 border-gray-300 rounded-lg"
                                        >
                                            {
                                                blockLoading ?
                                                    <Loader2Icon className="animate-spin text-blue-500 w-6 h-6" /> :
                                                    'Unblock'
                                            }

                                        </button>
                                        :
                                        <button
                                            onClick={handleBlock}
                                            disabled={blockLoading}
                                            className="flex justify-center items-center text-red-500 w-[66px] h-[38px] font-medium border px-3 py-1.5 border-gray-300 rounded-lg"
                                        >
                                            {
                                                blockLoading ?
                                                    <Loader2Icon className="animate-spin text-blue-500 w-6 h-6" /> :
                                                    'Block'
                                            }

                                        </button>

                                }
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1  overflow-y-auto p-2 space-y-2 max-h-[calc(100vh-12rem)]">
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
                            {file && (
                                <div className="relative max-w-44 ml-auto bg-gray-100 rounded-lg overflow-hidden">
                                    {/* File Preview Image */}
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="unsupport file "
                                        className={`object-cover w-full h-full ${uploadLoading ? "opacity-50" : ""}`}
                                    />

                                    {/* Loading Spinner Overlay */}
                                    {uploadLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                            <Loader2Icon className="animate-spin text-white w-6 h-6" />
                                        </div>
                                    )}

                                    {/* Retry Button Overlay */}
                                    {/* {uploadError && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                            <button
                                                onClick={retryUpload}
                                                className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    )} */}

                                    {/* Cross Icon for Removing the File Preview */}
                                    <button
                                        onClick={removeFilePreview} // Define this function to clear the file preview
                                        className="absolute top-1 right-1 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-900"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}


                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}


                        <div className="relative p-4 border-t w-full dark:border-gray-700 bg-white dark:bg-gray-900">
                            {
                                Block.blockedBy ?
                                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-70 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm rounded-md">
                                        You have blocked this user.
                                    </div> :
                                    Block.blockedMe && (
                                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-70 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm rounded-md">
                                            You are blocked and cannot send messages.
                                        </div>
                                    )
                            }

                            <form onSubmit={handleSend} className={`${Block.blockedBy || Block.blockedMe ? "opacity-50 pointer-events-none" : ""}`}>
                                <div className="flex items-center gap-2">
                                    {/* File Input Icon */}

                                    {
                                        !(Block.blockedBy || Block.blockedMe) && (
                                            <label className={`cursor-pointer p-2 text-gray-500 hover:text-blue-500 ${Block.blockedBy || Block.blockedMe ? "cursor-not-allowed text-gray-400 hover:text-gray-400" : ""}`}>
                                                <input type="file" onChange={handleFileInput} className="hidden" />
                                                <Paperclip className="w-5 h-5" />
                                            </label>
                                        )
                                    }

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className={`flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none dark:text-white ${Block.blockedBy || Block.blockedMe ? "cursor-not-allowed opacity-50" : ""}`}
                                        disabled={sendLoading || Block.blockedBy || Block.blockedMe}
                                    />

                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || sendLoading || Block.blockedBy || Block.blockedMe}
                                        className={`p-2 text-blue-500 disabled:opacity-50`}
                                    >
                                        {sendLoading ? <Loader2Icon className="animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                        </div>



                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a chat to start messaging.
                </div>
            )}
        </div>
    );
}




{/* <div className="p-4 border-t w-full dark:border-gray-700 bg-white dark:bg-gray-900">

{isBlocked && (
    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-70 flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm rounded-md">
        User is blocked, unblock to send message.
    </div>
)}

<form onSubmit={handleSend}>
    <div className="flex items-center gap-2">
        <label className="cursor-pointer p-2 text-gray-500 hover:text-blue-500">
            <input
                type="file"
                onChange={handleFileInput}
                className="hidden"
                disabled={isBlocked}
            />
            <Paperclip className="w-5 h-5" />
        </label>
        <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none dark:text-white`}
            disabled={sendLoading || isBlocked}
        />
        <button
            type="submit"
            disabled={!newMessage.trim() || sendLoading || isBlocked}
            className="p-2 text-blue-500 disabled:opacity-50"
        >
            {sendLoading ? <Loader2Icon className="animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
    </div>
</form>
</div> */}