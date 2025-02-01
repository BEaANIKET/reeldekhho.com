import { useEffect, useRef, useState } from "react";
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
import { formatTimeAgo } from "../utils/dateUtils";
import api from "../services/api/axiosConfig";
import { updateParticularPost } from "../store/slices/authSlice";
import useSavedPost from "../hooks/post/useSavedpost";
import useHandleLikes from "../hooks/post/useHandleLike";
import { BiDotsVertical } from "react-icons/bi";
import CommentSection from "../components/interactions/CommentSection";
import useHandleComment from "../hooks/post/useHandleComments";
import ShareButton from "../components/ShareBtn";


const PostComponents = ({ post, handleBoostClick, user, isLoading, savedPost }) => {

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
            key={post?._id}
            data-post-id={post?._id}
            className="bg-white relative w-screen max-w-lg dark:bg-gray-800 rounded-lg"
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <img
                        src={user?.profilePicture}
                        alt={user?.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold dark:text-white">
                        {user?.fullName}
                    </span>
                </div>
                <button onClick={handleThreeDot} className="dark:text-white">
                    <MoreVertical className="cursor-pointer" />
                </button>
            </div>
            <p className="dark:text-white px-3 pb-2">{post.caption}</p>
            <div className="relative">
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
                                className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
                            />
                        </button>
                        <span style={{ marginLeft: '6px', fontSize: '17px' }} className=" dark:text-white">{likes} {likes > 1 ? "Likes" : "Like"}</span>

                        <MessageCircle className="w-6 h-6 dark:text-white cursor-pointer" />
                        <button onClick={() => setIsShareOpen(true)}>
                            <Send className="w-6 h-6 dark:text-white" />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {post?.isBoosted.status ? (
                            <button
                                disabled={true}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 
                                bg-blue-50 text-blue-600
                                hover:bg-blue-100
                                transition-colors duration-200 
                                border border-blue-200"
                            >
                                <Rocket size={14} className="inline-block" />
                                Boosted
                            </button>
                        ) : (

                            (<button
                                disabled={isLoading[post._id] ? true : false}
                                onClick={(e) => handleBoostClick(e, post._id)}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium border dark:border-gray-600
                            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                {isLoading[post._id] ? <Loader2 className="animate-spin" /> : 'Boost'}
                            </button>)
                        )}
                        <button
                            onClick={() => alert('Feature coming soon!')}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border dark:border-gray-600
                            hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            Insights
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
const UserPosts = () => {
    const user = useSelector((state) => state.auth.user);
    const userPost = useSelector((state) => state.auth.posts);
    const savedPost = useSelector((state) => state?.savedPosts?.saved_Posts)

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch()

    const paramValue = searchParams.get("id"); // Get the post ID from the URL
    const postIndex = userPost?.findIndex((p) => p._id === paramValue);

    const [displayedPosts, setDisplayedPosts] = useState([]);

    const [isLoading, setIsLoading] = useState({});

    useEffect(() => {
        if (!userPost || postIndex === -1) return navigate("/profile");
        console.log("hello in useeffect");

        // Prepend previous posts
        setDisplayedPosts(() => {
            if (!userPost) return [];
            return userPost.slice(postIndex); // Start with the current post and older posts
        })
        let previousPosts = userPost.slice(0, postIndex);

        setDisplayedPosts((prev) => [...previousPosts, ...prev]);
    }, [userPost]);

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

    const updateState = () => {
        console.log(userPost);
        const newArray = userPost.slice(postIndex);
        setDisplayedPosts(newArray);
        let previousPosts = userPost.slice(0, postIndex);
        setDisplayedPosts((prev) => [...previousPosts, ...prev]);
    }


    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBoostClick = async (e: any, postId: String) => {
        e.stopPropagation();
        setIsLoading((prev) => ({ ...prev, [postId]: true }));
        try {

            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                throw new Error('Failed to load Razorpay script');
            }

            const orderRes = await api.post("/post/boostPost", {
                postId: postId,
                amount: 500 * 100
            })

            console.log(orderRes);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderRes?.data.order.amount,
                currency: 'INR',
                name: 'Boost Post',
                description: `Boosting post with post-id: ${postId}`,
                order_id: orderRes?.data.order.id,
                handler: async (response: any) => {

                    const verifyPayment = await api.post('/post/boost-post/verify-payment', {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        postId: postId
                    })
                    // console.log(verifyPayment.data.post);
                    const index = userPost.findIndex((post: any) => post?._id === verifyPayment.data.post._id);
                    console.log(index);

                    const updatedPost = verifyPayment.data.post;
                    console.log(updatedPost)

                    dispatch(updateParticularPost({
                        index,
                        post: updatedPost
                    }))
                    setDisplayedPosts([]);
                    updateState();
                },
                prefill: {
                    name: 'User Name', // You can get this from your user context
                    email: 'user@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3B82F6'
                }
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (err) {

            if (err?.response) {
                console.log(err?.response?.data)
                alert('Payment verification failed. Please contact support.');
            } else {
                console.log(err);
            }
        } finally {
            setIsLoading((prev) => ({ ...prev, [postId]: false }));
        }
    };

    console.log(displayedPosts);

    return (
        <div className=" max-w-3xl mx-auto" ref={containerRef}>
            <header className="flex items-center gap-4 mb-6">
                <ArrowLeft
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => navigate("/profile")}
                />
                <h1 className="text-2xl font-bold">Posts</h1>
            </header>

            {userPost &&
                displayedPosts.map((post: any) => (
                    <PostComponents post={post} handleBoostClick={handleBoostClick} user={user} isLoading={isLoading} savedPost={savedPost} />
                    // <Post post={post} />
                ))}
        </div>
    );
};

export default UserPosts;
