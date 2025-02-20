import React, { useEffect } from "react";
import { FiBell, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { markAllAsSeen } from "../store/slices/notificationsSlices";
import api from "../services/api/axiosConfig";

const NotificationSidebar = ({ isOpen, setIsOpen }) => {
    // const { notifications } = useNotifications();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const unseenCount = useSelector(state => state?.notifications?.unseenNotiCount)
    const notifications = useSelector(state => state?.notifications?.notifications)

    const markAllNotificationsAsSeen = async () => {
        try {
            await api.post('/notification/seen');
            dispatch(markAllAsSeen());
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
        }
    };


    useEffect(() => {
        if (isOpen && unseenCount) {
            markAllNotificationsAsSeen();
        }
    }, [isOpen, markAllNotificationsAsSeen]);

    // Format date for display
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[#004969] text-white">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-blue-600"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Notifications List */}
                <div className="p-4 overflow-y-auto h-full">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                className={`flex cursor-pointer items-center gap-4 p-3 mb-3 rounded-md shadow-sm ${notif.seen ? "bg-gray-100" : "bg-blue-100"
                                    }`}
                            >
                                {/* Profile Picture */}
                                <img
                                    onClick={() => navigate('/seller/' + notif.user._id)}
                                    src={notif?.user?.profilePicture}
                                    alt={notif?.user?.fullName || "User"}
                                    className="w-10 h-10 overflow-hidden rounded-full object-cover"
                                />

                                {/* Notification Details */}
                                <div onClick={() => navigate('/reels/' + notif?.referenceId)}>
                                    <p className="font-medium text-gray-800">
                                        {notif?.user?.fullName || "Unknown User"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {notif.content}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatDate(notif.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No notifications yet.</p>
                    )}
                </div>
            </div>

            {/* Overlay (optional) */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black opacity-50 z-30"
                ></div>
            )}
        </>
    );
};

export default NotificationSidebar;
