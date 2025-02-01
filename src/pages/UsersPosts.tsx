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
} from "lucide-react";
import { formatTimeAgo } from "../utils/dateUtils";
import api from "../services/api/axiosConfig";
import { updateParticularPost } from "../store/slices/authSlice";
// import ReelCard from "../components/reels/ReelCard";
// import Post from "../components/Post";
// import useSavedPost from "../hooks/post/useSavedpost";

const UserPosts = () => {
    const user = useSelector((state) => state.auth.user);
    const userPost = useSelector((state) => state.auth.posts);
    // console.log('line number 253: ',userPost);
    
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
    },[])

    const updateState= () => {
        console.log(userPost);
        const newArray= userPost.slice(postIndex);
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
                    <div
                        key={post?._id}
                        data-post-id={post?._id} // Unique identifier for scrolling
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
                            <button className="dark:text-white">
                                <MoreVertical className="cursor-pointer" />
                            </button>
                        </div>
                        <p className="dark:text-white px-3 pb-2">{post.caption}</p>
                        <div className="relative">
                            {post.file.fileType.includes("video") ? (
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
                                    <Heart className="w-6 h-6 dark:text-white cursor-pointer" />
                                    <MessageCircle className="w-6 h-6 dark:text-white cursor-pointer" />
                                    <Send className="w-6 h-6 dark:text-white cursor-pointer" />
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
                                            {isLoading[post._id] ? <Loader2 className="animate-spin"/> : 'Boost'}
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
                            <p className="text-gray-400 text-xs uppercase">
                                {formatTimeAgo("5day")}
                            </p>
                        </div>
                    </div>
                    // <Post post={post} />
                ))}
        </div>
    );
};

export default UserPosts;
