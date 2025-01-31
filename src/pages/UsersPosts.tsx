// import { ArrowLeft, MoreVerticalIcon, Heart, Share2, MoreVertical, Bookmark, BookmarkX, Flag, Send, MessageCircle } from "lucide-react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// // import image from '/assets/image.png';
// import { useCallback, useEffect, useRef, useState } from "react";
// import { identifyMediaType } from "../components/Post";
// // import ShareButton from "../components/ShareBtn";
// import { formatTimeAgo } from "../utils/dateUtils";
// import { GoUnmute } from "react-icons/go";
// import { IoVolumeMute } from "react-icons/io5";
// // import CommentSection from "../components/interactions/CommentSection";
// import { useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

// const UserPosts = () => {
//     const user = useSelector((state) => state.auth.user);
//     const userPost = useSelector((state) => state.auth.posts);
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const containerRef = useRef<HTMLDivElement>(null);

//     const paramValue = searchParams.get('id');
//     const postIndex = userPost?.findIndex((p) => p._id === paramValue);

//     // State for displayed posts
//     const [displayedPosts, setDisplayedPosts] = useState(() => {
//         if (!userPost) return [];
//         return userPost.slice(postIndex); // Start with current post and older posts
//     });

//     // Ref to track the initial scroll position
//     const initialScrollPositionRef = useRef(0);

//     // Function to calculate the initial scroll position
//     const calculateInitialScrollPosition = () => {
//         if (!containerRef.current) return 0;

//         // Calculate the height of the posts before the current post
//         const postHeight = 441.458; // Approximate height of each post (adjust as needed)
//         const postsAbove = userPost.slice(0, postIndex).length;
//         return postsAbove * postHeight;
//     };

//     useEffect(() => {
//         if (!userPost || postIndex === -1) return;

//         // Prepend previous posts
//         const previousPosts = userPost.slice(0, postIndex);
//         setDisplayedPosts((prev) => [...previousPosts, ...prev]);

//         // Calculate and set the initial scroll position
//         initialScrollPositionRef.current = calculateInitialScrollPosition();
//         window.scrollTo(0, initialScrollPositionRef.current);
//     }, [userPost, postIndex]);

//     const [showMoreOptions, setShowMoreOptions] = useState(false)
//     const [isSaved, setIsSaved] = useState(false)
//     const [isMute, setIsMute] = useState(true);
//     const [isPlay, setIsPlay] = useState(true);
//     const [isLiked, setIsLiked] = useState(false);
//     const { id } = useParams();
//     const [isLoggedIn, setIsLoggedIn] = useState(true);
//     const observerRef = useRef(null);

//     return (
//         <div className="p-6 max-w-3xl mx-auto" ref={containerRef}>
//             {/* Header */}
//             <header className="flex items-center gap-4 mb-6">
//                 <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate('/profile')}/>
//                 <h1 className="text-2xl font-bold">Posts</h1>
//             </header>

//             {
//                 userPost && displayedPosts.map((post: any) => {
//                     return (
//                         <div 
//                             key={post?._id}
//                             className=" bg-white relative  w-full max-w-lg dark:bg-gray-800 rounded-lg"
//                         >

//                             <div className="flex items-center justify-between p-4">
//                                 <div className="flex items-center space-x-2">
//                                     <img
//                                         src={user?.profilePicture}
//                                         alt={user?.fullName}
//                                         className="w-8 h-8 rounded-full object-cover"
//                                     />
//                                     <span className="font-semibold dark:text-white">{user?.fullName}</span>
//                                 </div>

//                                 <button
//                                     // onClick={toggleMoreOption}
//                                     className="dark:text-white"
//                                 >
//                                     <MoreVertical className="cursor-pointer" />
//                                 </button>

//                                 {showMoreOptions && (
//                                     <div
//                                         // ref={moreOptionsRef}
//                                         className="absolute top-0 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700"
//                                     >
//                                         <div className="py-1">
//                                             {
//                                                 isSaved ?
//                                                     <button
//                                                         // onClick={handleUnsave}
//                                                         className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
//                                                     >
//                                                         <BookmarkX className="w-5 h-5 mr-2" />
//                                                         UnSave
//                                                     </button> :
//                                                     <button
//                                                         // onClick={handleSave}
//                                                         className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
//                                                     >
//                                                         <Bookmark className="w-5 h-5 mr-2" />
//                                                         Save
//                                                     </button>
//                                             }
//                                             <button
//                                                 // onClick={handleReport}
//                                                 className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
//                                             >
//                                                 <span className="material-icons-outlined text-lg mr-2"><Flag className='w-5 h-5' /></span>
//                                                 Report
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             <p className="dark:text-white" style={{ paddingLeft: '12px', paddingBottom: '8px', marginTop: '-8px' }}>
//                                 {post.caption}
//                             </p>
//                             <div className="relative">

//                                 {identifyMediaType(post?.file.fileType) === 'video' ? (
//                                     <div
//                                         onClick={() => setIsPlay(false)}
//                                         // onDoubleClick={handleLike}
//                                         className="relative min-w-full bg-black sm:min-w-96"

//                                     >
//                                         <video onClick={() => navigate(`/reels/post._id`)} className="w-full max-h-[60vh] objectcovernow" muted={true} loop autoPlay={true}>
//                                             <source src={post?.file.url} type={`video/${post.file.fileType}`} />
//                                             Your browser does not support the video tag.
//                                         </video>
//                                         <div
//                                             className="absolute p-4 bottom-2 right-2 z-50"
//                                         // onClick={handleMute}
//                                         >
//                                             {!isMute ? (
//                                                 <GoUnmute className="text-white text-xl" />
//                                             ) : (
//                                                 <IoVolumeMute className="text-white text-xl" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <img
//                                         onClick={() => navigate(`/reels/{post._id}`)}
//                                         // onDoubleClick={handleLike}
//                                         src={post?.file.url}
//                                         alt="Post Media"
//                                         className="w-full object-cover min-h-64 max-h-[500px]"
//                                     />
//                                 )}
//                             </div>

//                             <div className="p-4">
//                                 <div className="flex justify-between">
//                                     <div className="flex space-x-4">
//                                         {isLoggedIn ? <> <button
//                                             // onClick={handleLike}
//                                             className="transform active:scale-125 transition-transform duration-200"
//                                         >
//                                             <Heart
//                                                 className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
//                                             />
//                                         </button> <span style={{ marginLeft: '6px', fontSize: '17px' }} className=" dark:text-white">{0} {0 > 1 ? "Likes" : "Like"}</span> </> : <> <button
//                                             onClick={() => navigate('/signup')}
//                                             className="transform active:scale-125 transition-transform duration-200"
//                                         >
//                                             <Heart
//                                                 className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
//                                             />
//                                         </button> <span className="font-semibold dark:text-white">{0} {0 > 1 ? "Likes" : "Like"}</span> </>}

//                                         {isLoggedIn ? <> <button
//                                         // onClick={() => setShowComments((prev) => !prev)}
//                                         >
//                                             <MessageCircle className="w-6 h-6 dark:text-white" />
//                                         </button>
//                                             <button
//                                             // onClick={() => setIsShareOpen(true)}
//                                             >
//                                                 <Send className="w-6 h-6 dark:text-white" />
//                                             </button> </> : <> <button onClick={() => navigate('/signup')}>
//                                                 <MessageCircle className="w-6 h-6 dark:text-white" />
//                                             </button> <button onClick={() => navigate('/signup')}>
//                                                 <Send className="w-6 h-6 dark:text-white" />
//                                             </button></>}
//                                         { }

//                                     </div>
//                                     {/* {post.user?.longitude && post.user?.lattitude ? <GetLocation link={post.user?.googleMapLink} createdDate={post.createdAt} longitude={post.user.longitude} lattitude={post.user.lattitude} /> : null} */}


//                                 </div>

//                                 <div>
//                                     <button
//                                         className="text-gray-500 dark:text-gray-400 text-sm"
//                                     // onClick={() => setShowComments((prev) => !prev)}
//                                     >
//                                         View all comments
//                                     </button>
//                                     <p className="text-gray-400 text-xs uppercase">
//                                         {formatTimeAgo('5day')}
//                                     </p>
//                                 </div>

//                             </div>
//                         </div>
//                     );
//                 })
//             }

//         </div>
//     );
// };
// export default UserPosts;

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MoreVertical, Heart, Send, MessageCircle } from "lucide-react";
import { formatTimeAgo } from "../utils/dateUtils";

const UserPosts = () => {
    const user = useSelector((state) => state.auth.user);
    const userPost = useSelector((state) => state.auth.posts);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const paramValue = searchParams.get("id"); // Get the post ID from the URL
    const postIndex = userPost?.findIndex((p) => p._id === paramValue);

    const [displayedPosts, setDisplayedPosts] = useState(() => {
        if (!userPost) return [];
        return userPost.slice(postIndex); // Start with the current post and older posts
    });

    const [value, setValue]= useState(0);

    useEffect(() => {
        if (!userPost || postIndex === -1) return navigate('/profile');
        console.log('hello in useeffect');
        

        // Prepend previous posts
        let previousPosts = userPost.slice(0, postIndex);
        setDisplayedPosts((prev) => [...previousPosts, ...prev]);

        // setTimeout(() => {
        //     const currentPostElement = document.querySelector(`[data-post-id="${paramValue}"]`);
        //     if (currentPostElement) {
        //         currentPostElement.scrollIntoView({ behavior: "instant", block: "start" });
        //     }
        // }, 15); // Small delay to allow rendering

        // setTimeout(() => {
        //     const currentPostElement = document.querySelector(`[data-post-id="${paramValue}"]`);
        //     if (currentPostElement) {
        //         currentPostElement.scrollIntoView({ behavior: "smooth", block: "start" });
        //     }
        // }, 50);

        setTimeout(() => {
            const currentPostElement = document.querySelector(`[data-post-id="${paramValue}"]`);
            if (currentPostElement) {
                const targetPosition = currentPostElement.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: targetPosition, behavior: "auto" }); // Instant move without animation
            }
        }, 15);

    }, []);

    console.log('hello');

    return (
        <div className="p-6 max-w-3xl mx-auto" ref={containerRef}>
            <header className="flex items-center gap-4 mb-6">
                <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate("/profile")} />
                <h1 className="text-2xl font-bold">Posts</h1>
            </header>

            {userPost &&
                displayedPosts.map((post: any) => (
                    <div
                        key={post?._id}
                        data-post-id={post?._id} // Unique identifier for scrolling
                        className="bg-white relative w-full max-w-lg dark:bg-gray-800 rounded-lg"
                    >
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={user?.profilePicture}
                                    alt={user?.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="font-semibold dark:text-white">{user?.fullName}</span>
                            </div>
                            <button className="dark:text-white">
                                <MoreVertical className="cursor-pointer" />
                            </button>
                        </div>
                        <p className="dark:text-white px-3 pb-2">{post.caption}</p>
                        <div className="relative">
                            {post.file.fileType.includes("video") ? (
                                <video className="w-full max-h-[60vh] object-cover" muted loop autoPlay>
                                    <source src={post?.file.url} type={`video/${post.file.fileType}`} />
                                </video>
                            ) : (
                                <img src={post?.file.url} alt="Post Media" className="w-full object-cover min-h-64 max-h-[500px]" />
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex space-x-4">
                                <button className="transform active:scale-125 transition-transform duration-200">
                                    <Heart className="w-6 h-6 dark:text-white" />
                                </button>
                                <button>
                                    <MessageCircle className="w-6 h-6 dark:text-white" />
                                </button>
                                <button>
                                    <Send className="w-6 h-6 dark:text-white" />
                                </button>
                            </div>
                            <p className="text-gray-400 text-xs uppercase">{formatTimeAgo("5day")}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default UserPosts;
