import { useEffect, useState } from "react";
import { LuCircleX } from "react-icons/lu";
import api from "../services/api/axiosConfig";

const LikeList = ({ setLikeCard, likedPostId }: { setLikeCard: (value: boolean) => void; likedPostId: string }) => {
    const [likedUser, setLikedUser] = useState([]);
    const [LikedLoading, setLikedLoading] = useState(true);

    async function getLikedUser() {
        try {
            const res = await api.get(`/like/getlikes?id=${likedPostId}`);
            //(res.data);
            setLikedUser(res.data);
        } catch (error) {
            //(error);
            setLikeCard(false)
        } finally {
            setLikedLoading(false)
        }
    }

    useEffect(() => {
        getLikedUser()
    }, [])

    if (LikedLoading) {
        return <ul className="space-y-3 overflow-y-auto max-h-[60vh] fixed px-4 py-6 w-[75vw] max-w-md bg-white rounded-lg z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg">
            {Array(6).fill(0).map((_, index) => (
                <li key={index} className="flex items-center p-1 space-x-3 rounded-md">
                    <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </li>
            ))}
        </ul>;
    }

    return (
        <div className="fixed px-4 py-6 w-[75vw] max-w-md max-h-[80vh] bg-white rounded-lg z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg">
            {/* Close Button */}
            <button
                onClick={() => setLikeCard(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
            >
                <LuCircleX size={24} />
            </button>

            {/* Title */}
            <h1 className="text-center text-lg font-bold mb-4">Likes</h1>

            {/* Users List */}
            <ul className="space-y-3 overflow-y-auto max-h-[60vh]">
                {likedUser.map((user) => (
                    user?.userId.length ? (
                        <li key={user?._id} className="flex items-center p-1 space-x-3 rounded-md hover:bg-gray-100">
                            <img src={user?.userId[0]?.profilePicture} alt={user.userId[0]?.fullName} className="w-6 h-6 rounded-full border" />
                            <span className="text-gray-700 font-medium">{user.userId[0]?.fullName}</span>
                        </li>
                    ) : null
                ))}
            </ul>
        </div>
    );
}

export default LikeList