import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const SavedPage = () => {

    const savedPosts = useSelector((state) => state?.savedPosts?.saved_Posts)
    const navigate = useNavigate();

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Saved Posts</h1>
            <div className="grid grid-cols-3 gap-4">
                {
                    savedPosts && savedPosts.length && savedPosts.map((posts) => {
                        return (
                            <div
                                onClick={() => navigate(`/reels/${posts?.postId._id}`)}
                                key={posts._id}
                                className="relative aspect-square group cursor-pointer">
                                <div className="relative aspect-square group">
                                    {/* Check File Type */}
                                    {["mp4", "webm", "mov"].includes(posts?.postId?.file?.fileType?.toLowerCase()) ? (
                                        <video
                                            src={posts.postId.file?.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        ></video>
                                    ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(posts?.postId.file?.fileType?.toLowerCase()) ? (
                                        <img
                                            src={posts.postId.file?.url}
                                            alt={posts?.postId.caption || "Post Image"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                            Unsupported Format
                                        </div>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex gap-3 sm:gap-6 md:gap-9 text-white">
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
                                            <span className="font-semibold">{posts?.postId.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" />
                                            </svg>
                                            <span className="font-semibold">{posts?.postId.comments || 0}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>

    );
};

export default SavedPage;