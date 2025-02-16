
import { User, Check, UserPlus, Frown, Lock, Loader2Icon, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import FollowSkeleton from "./FollowSkeleton";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../../services/api/axiosConfig";

const Following = () => {
    const { id } = useParams();
    const { following, followLoading, getFollowData } = useFollow({ id });
    // //('following- ', following);
    const user = useSelector((state) => state?.auth.user)
    const [loading, setLoading] = useState<any>({})
    const navigate = useNavigate()

    if (followLoading) {
        return <FollowSkeleton />;
    }

    const handleClick = async (followId, btnId) => {
        //(followId,btnId);

        setLoading((prev: any) => ({ ...prev, [followId]: true }));
        try {
            if (btnId === 'follow') {
                await api.post(
                    `/follow/createFollower?id=${followId}`
                );
                getFollowData(id)
            }
        } catch (error: any) {
            alert(error.response.data.message || "Error in following")
        } finally {
            setTimeout(() => setLoading((prev: any) => ({ ...prev, [followId]: false })), 2000)
        }
        setTimeout(() => setLoading((prev: any) => ({ ...prev, [followId]: false })), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">

            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <header className="flex items-center gap-4 ">
                        <ArrowLeft
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        {/* <h1 className="text-2xl font-bold">Posts</h1> */}
                    </header>

                    <h1 className="text-xl font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" /> Following
                    </h1>
                </div>

                {/* Followers List */}
                {
                    following && following.length !== 0 ?
                        (
                            <div className="divide-y">
                                {following.map((folloin) => (
                                    <div key={folloin.followedDetails._id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                <img
                                                    src={folloin?.followedDetails.profilePicture}
                                                    className="w-full h-full object-cover rounded-full"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/seller/${folloin?.followedDetails._id}`}>
                                                        <p className="font-medium">{folloin?.followedDetails.fullName}</p>
                                                    </Link>
                                                    {folloin.isFollowingMe && (
                                                        <span className="text-[10px] hidden sm:block text-sm text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                            Follows you
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        {folloin.followedDetails.occupation}
                                                    </p>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">

                                            <button
                                                id={folloin.isFollowedByMe || folloin.followedDetails._id === user._id ? 'following' : 'follow'}
                                                disabled={loading[folloin.followedDetails._id] || folloin.isFollowedByMe || folloin.followedDetails._id === user._id}
                                                onClick={(e) => handleClick(folloin.followedDetails._id, e.currentTarget.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${folloin.isFollowedByMe
                                                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-default"
                                                    : folloin.followedDetails._id === user._id ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-not-allowed' : "bg-blue-500 hover:bg-blue-600 text-white"}
                                        }`}
                                            >
                                                {folloin.isFollowedByMe ? (
                                                    <>
                                                        <Check className="sm:w-4 sm:h-4 w-3 h-3" /> Following
                                                    </>
                                                ) : (
                                                    folloin.followedDetails._id === user._id ? (
                                                        <>
                                                            <Lock className="sm:w-4 sm:h-4 w-3 h-3" /> Restricted
                                                        </>
                                                    ) :
                                                        (
                                                            <>
                                                                {loading[folloin.followedDetails._id] ? <Loader2Icon className="animate-spin sm:w-4 sm:h-4 w-3 h-3" /> : <UserPlus className="sm:w-4 sm:h-4 w-3 h-3" />}  Follow
                                                            </>
                                                        )
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <Frown className="w-12 h-12 text-gray-400 mb-4" /> {/* Icon */}
                                <p className="text-lg font-medium text-gray-700">No Following Found</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    When the user follows someone , they'll appear here.
                                </p>
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default Following;