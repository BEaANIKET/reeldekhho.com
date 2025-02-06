import { User, Check, UserPlus, Frown, Lock, Loader2Icon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import FollowSkeleton from "./FollowSkeleton";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../../services/api/axiosConfig";

const Followers = () => {
    const { id } = useParams();
    const { followers, followLoading,getFollowData } = useFollow({ id });
    const user = useSelector((state) => state?.auth.user)
    const [loading, setLoading]= useState<any>({});
    console.log(user);
    console.log(followers);
    

    if (followLoading) {
        return <FollowSkeleton />;
    }

    // if (followError) {
    //     return <div>Error loading followers.</div>;
    // }

    const handleClick = async(followId, btnId) => {
        console.log(followId,btnId);
        
        setLoading((prev:any) => ({ ...prev, [followId]:true }));
        try{
           if(btnId==='follow') {
            await api.post(
                `/follow/createFollower?id=${followId}`
              );
            getFollowData(id)
        }  
        }catch(error:any) {
            alert(error.response.data.message || "Error in following")
        }finally{
            setTimeout(() => setLoading((prev:any) => ({ ...prev, [followId]:false })), 2000)
        }
        // setTimeout(() => setLoading((prev:any) => ({ ...prev, [followId]:false })), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-4 border-b">
                    <h1 className="text-xl font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" /> Followers
                    </h1>
                </div>

                {/* Followers List */}
                {
                    followers.length !== 0 ?
                        (
                            <div className="divide-y">
                                {followers.map((follower) => (
                                    <div key={follower._id} className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                <img
                                                    src={follower?.followerDetails.profilePicture}
                                                    className="w-full h-full object-cover rounded-full"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/seller/${follower?.followerDetails._id}`}>
                                                        <p className="font-medium">{follower?.followerDetails.fullName}</p>
                                                    </Link>
                                                    {follower.isFollowingMe && (
                                                        <span className="text-[10px] hidden sm:block text-sm text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                            Follows you
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        {follower.followerDetails.occupation}
                                                    </p>
                                                    {/* {follower.isFollowingMe && (
                                                        <span className="text-[10px] block sm:hidden text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                            Follows you
                                                        </span>
                                                    )} */}  
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                disabled={loading[follower.followerDetails._id] || follower.isFollowedByMe || follower.followerDetails._id === user._id}
                                                onClick={(e) => handleClick( follower.followerDetails._id , e.currentTarget.id )}
                                                id={follower.isFollowedByMe || follower.followerDetails._id === user._id ? 'following' : 'follow'}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium 
                                                    ${follower.isFollowedByMe ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                    : follower.followerDetails._id === user._id ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-not-allowed' : "bg-blue-500 hover:bg-blue-600 text-white"}
                                        }`}
                                            >
                                                {follower.isFollowedByMe ? (
                                                    <>
                                                        <Check className="sm:w-4 sm:h-4 w-3 h-3" /> Following
                                                    </>
                                                ) : (
                                                    follower.followerDetails._id === user._id ? (
                                                        <>
                                                            <Lock className="sm:w-4 sm:h-4 w-3 h-3" /> Restricted
                                                        </>
                                                    ) :
                                                        (
                                                            <>
                                                                {loading[follower.followerDetails._id] ? <Loader2Icon className="animate-spin sm:w-4 sm:h-4 w-3 h-3" /> : <UserPlus className="sm:w-4 sm:h-4 w-3 h-3" />} Follow
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
                                <p className="text-lg font-medium text-gray-700">No Followers Found</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    When someone follows the user, they'll appear here.
                                </p>
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default Followers;