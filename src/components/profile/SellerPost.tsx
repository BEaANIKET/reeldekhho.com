import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    MoreVertical,
    Heart,
    Send,
    MessageCircle,
    Rocket,
    Loader2,
    DeleteIcon,
    BookmarkX,
    Delete,
    Bookmark,
} from "lucide-react";
import { formatTimeAgo } from "../../utils/dateUtils"; 
import api from "../../services/api/axiosConfig";
import { updateParticularPost } from "../../store/slices/authSlice";
import useSavedPost from "../../hooks/post/useSavedpost";
import useHandleLikes from "../../hooks/post/useHandleLike";
import { BiCross, BiDotsVertical } from "react-icons/bi";
import CommentSection from "../../components/interactions/CommentSection";
import useHandleComment from "../../hooks/post/useHandleComments";
import ShareButton from "../../components/ShareBtn";


const PostComponents = ({ post,seller, savedPost }) => {

    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [isSaved, setIsSaved] = useState(false);
    const { addSavedPost, removeSavedPost } = useSavedPost()
    const { likeCount: likes, isLiked, likePost } = useHandleLikes(post._id);
    const [showComments, setShowComments] = useState(false);
    const { getComment, createComment, deleteComment, comments } = useHandleComment(post._id)
    const [showPopup, setShowPopup] = useState(false);
    const [loader, setLoader] = useState({
        addLoader: false,
        removeLoader: false,
    })

    const navigate = useNavigate();
    const handleLike = async () => {
        await likePost(post?._id);
    };


    useEffect(() => {
        const value = savedPost.find((save: any) => save?.postId?._id === post?._id)
        if (value) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [savedPost])


    const handleSave = () => {
        addSavedPost(post._id);
        setShowMoreOptions(false);
    }

    const handleUnsave = () => {
        removeSavedPost(post._id);
        setShowMoreOptions(false);
    }

    const [isOverlay, setIsOverlay] = useState(false)

    const handleThreeDot = () => {
        setShowMoreOptions(!showMoreOptions);

        setIsOverlay(true);
    };

    const [commentLoder, setCommentLoder] = useState(false)
    const [isShareOpen, setIsShareOpen] = useState(false);


    const handleDelete = (id: number) => {
        if (!loader.removeLoader) {
            setCommentLoder(true);
            deleteComment(id)
            setShowPopup(false);
            setCommentLoder(false);
        }
    };


    return (
        <div
            data-post-id={post?._id}
            className="bg-white relative w-screen max-w-lg dark:bg-gray-800 rounded-lg"
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <img
                        src={seller?.profilePicture}
                        alt={seller?.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold dark:text-white">
                        {seller?.fullName}
                    </span>
                </div>
                <button onClick={handleThreeDot} className="dark:text-white">
                    <MoreVertical className="cursor-pointer" />
                </button>
            </div>
            <p className="dark:text-white px-3 pb-2">{post.caption}</p>
            <div
                onClick={() => navigate(`/reels/${post?._id}`)}
                className="relative cursor-pointer">
                {post.file.fileType.includes("mp4") ? (
                    <video
                        className="w-full max-h-[60vh] object-cover"
                        muted
                        loop
                        autoPlay
                    >
                        <source
                            src={post?.file.url}
                            type={`video/${post.file.fileType}`}
                        />
                    </video>
                ) : (
                    <img
                        src={post?.file.url}
                        alt="Post Media"
                        className="w-full object-cover min-h-64 max-h-[500px]"
                    />
                )}
            </div>
            <div className="sm:p-4 p-2">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLike}
                            className="transform active:scale-125 transition-transform duration-200"
                        >
                            <Heart
                                className={`w-4 h-4 sm:w-6 sm:h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
                            />
                        </button>
                        <span style={{ marginLeft: '6px' }} className=" dark:text-white text-sm md:text-lg">{likes} {likes > 1 ? "Likes" : "Like"}</span>

                        <button onClick={() => setShowComments((prev) => !prev)}>
                            <MessageCircle className="sm:w-6 sm:h-6 w-4 h-4 dark:text-white cursor-pointer" />
                        </button>

                        <button onClick={() => setIsShareOpen(true)}>
                            <Send className="sm:w-6 sm:h-6 w-4 h-4 dark:text-white" />
                        </button>
                    </div>

                </div>
                <div className="space-y-1">
                    <button
                        className="text-gray-500 dark:text-gray-400 text-sm"
                        onClick={() => setShowComments((prev) => !prev)}
                    >
                        View all comments
                    </button>
                    <p className="text-gray-400 text-xs">
                        {formatTimeAgo(post.createdAt)} ago
                    </p>
                </div>

                {showMoreOptions && (
                    <div
                        // ref={moreOptionsRef}
                        className="absolute top-0 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700"
                    >
                        <div className="py-1">
                            {
                                isSaved ?
                                    <button
                                        onClick={handleUnsave}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                    >
                                        <BookmarkX className="w-5 h-5 mr-2" />
                                        UnSave
                                    </button> :
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                    >
                                        <Bookmark className="w-5 h-5 mr-2" />
                                        Save
                                    </button>
                            }
                            {/* <button
                                onClick={handleDelete}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                            >
                                <span className="material-icons-outlined text-lg mr-2"><Delete className='w-5 h-5' /></span>
                                Delete
                            </button> */}
                        </div>
                    </div>
                )}

                {showComments ? (
                    <div >
                        {comments && comments.length ? comments.map((comment) => (
                            <div key={comment._id} className="flex items-start space-x-4 mb-2">
                                <img
                                    src={comment?.user?.profilePicture}
                                    alt={comment?.user?.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-grow h-full items-start flex flex-col">
                                    <p className="font-semibold dark:text-white">{comment?.user?.fullName}</p>
                                    <p className="dark:text-white">{comment?.text}</p>
                                </div>

                                <div className="relative">
                                    <BiDotsVertical
                                        className="dark:text-white text-black text-lg cursor-pointer"
                                        onClick={() => setShowPopup((prev) => (prev === comment?._id ? false : comment?._id))}
                                    />
                                    {showPopup === comment._id && (
                                        <div className="absolute top-full right-[21px] mt-[-24px] rounded-sm">
                                            <p
                                                className=" text-white font-semibold rounded-sm cursor-pointer text-sm p-2 bg-red-500  hover:underline"
                                                onClick={() => handleDelete(comment?._id)}
                                            >
                                                {commentLoder ? 'loading...' : 'Delete'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )) : null}
                        < CommentSection postId={post._id} createComment={createComment} loader={loader} setLoader={setLoader} />
                    </div>
                ) : null}
            </div>

            {isOverlay && (
                <div onClick={() => {
                    setShowMoreOptions(false)
                    setIsOverlay(false)
                }} className=" inset-0  h-screen w-screen fixed "></div>
            )}

            <ShareButton
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                reelId={post?._id}
            />
        </div>
    )
}

const SellerPost = () => {
    const sellerPost= useSelector((state) => state.SellerSlice.sellerPost);
    const seller= useSelector((state) => state.SellerSlice.seller);
    const savedPost = useSelector((state) => state?.savedPosts?.saved_Posts)

    console.log(seller);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const paramValue = searchParams.get("id"); // Get the post ID from the URL
    const postIndex = sellerPost?.findIndex((p) => p._id === paramValue);

    const [displayedPosts, setDisplayedPosts] = useState([]);

    useEffect(() => {
        setDisplayedPosts(() => {
            if (!sellerPost.length) return [];
            return sellerPost.slice(postIndex);
        })
        let previousPosts = sellerPost.slice(0, postIndex);

        setDisplayedPosts((prev) => [...previousPosts, ...prev]);
    }, [seller]);

    useEffect(() => {
        setTimeout(() => {
            const currentPostElement = document.querySelector(
                `[data-post-id="${paramValue}"]`
            );
            if (currentPostElement) {
                const targetPosition =
                    currentPostElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: targetPosition, behavior: "auto" }); // Instant move without animation
            }
        }, 15);
    }, [])

    // const updateState = () => {
    //     console.log(userPost);
    //     const newArray = userPost.slice(postIndex);
    //     setDisplayedPosts(newArray);
    //     let previousPosts = userPost.slice(0, postIndex);
    //     setDisplayedPosts((prev) => [...previousPosts, ...prev]);
    // }

    console.log(displayedPosts);

    return (
        <div className=" max-w-3xl mx-auto" ref={containerRef}>
            <header className="flex items-center gap-4 mb-6">
                <ArrowLeft
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => navigate(`/seller/${seller._id}`)}
                />
                <h1 className="text-2xl font-bold">Posts</h1>
            </header>

            {seller &&
                displayedPosts.map((post: any) => (
                    <PostComponents post={post} key={post?._id} seller={seller} savedPost={savedPost} />
                ))}
        </div>
    );
};

export default SellerPost;
