import { ArrowLeft, MoreVerticalIcon, Heart, Share2, MoreVertical, Bookmark, BookmarkX, Flag, Send, MessageCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import image from '/assets/image.png';
import { useRef, useState } from "react";
import { identifyMediaType } from "../components/Post";
import ShareButton from "../components/ShareBtn";
import { formatTimeAgo } from "../utils/dateUtils";
import { GoUnmute } from "react-icons/go";
import { IoVolumeMute } from "react-icons/io5";
import CommentSection from "../components/interactions/CommentSection";

const dummyPosts = [
    {
        _id: "678c92d73e3f42a759cbb7a1",
        caption: "#sunset #photography #nature",
        category: "travel",
        createdAt: "2025-01-15T10:30:00.000Z",
        file: {
            url: "https://via.placeholder.com/400x400.png?text=Travel+Post+1",
        },
        likes: 12,
    },
    {
        _id: "678c92d73e3f42a759cbb7a2",
        caption: "#coding #javascript #webdev",
        category: "technology",
        createdAt: "2025-01-18T08:45:00.000Z",
        file: {
            url: "https://via.placeholder.com/400x400.png?text=Tech+Post+1",
        },
        likes: 25,
    },
    {
        _id: "678c92d73e3f42a759cbb7a3",
        caption: "#books #reading #inspiration",
        category: "books",
        createdAt: "2025-01-19T05:51:19.005Z",
        file: {
            url: "https://via.placeholder.com/400x400.png?text=Book+Post+1",
        },
        likes: 3,
    },
];

const user = undefined;

const UserPosts = () => {
    const [showMoreOptions, setShowMoreOptions] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isMute, setIsMute] = useState(true);
    const [isPlay, setIsPlay] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const observerRef = useRef(null);

    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6">
                <ArrowLeft className="w-6 h-6 cursor-pointer" />
                <h1 className="text-2xl font-bold">Posts</h1>
            </header>

            {
                [1, 2, 3, 4, 5, 6].map((post) => {
                    return (
                        <div className=" bg-white relative  w-full max-w-lg dark:bg-gray-800 border dark:border-gray-700 rounded-lg mb-4">

                            <div className="flex items-center justify-between p-4">
                                <Link to={`/seller/gsgfd`} className="flex items-center space-x-2">
                                    <img
                                        // src={post}
                                        // alt={post.user.fullName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="font-semibold dark:text-white">post.user.fullName</span>
                                </Link>
                                <button
                                    // onClick={toggleMoreOption}
                                    className="dark:text-white"
                                >
                                    <MoreVertical className="cursor-pointer" />
                                </button>

                                {showMoreOptions && (
                                    <div
                                        // ref={moreOptionsRef}
                                        className="absolute top-0 right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700"
                                    >
                                        <div className="py-1">
                                            {
                                                isSaved ?
                                                    <button
                                                        // onClick={handleUnsave}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                    >
                                                        <BookmarkX className="w-5 h-5 mr-2" />
                                                        UnSave
                                                    </button> :
                                                    <button
                                                        // onClick={handleSave}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                    >
                                                        <Bookmark className="w-5 h-5 mr-2" />
                                                        Save
                                                    </button>
                                            }
                                            <button
                                                // onClick={handleReport}
                                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                            >
                                                <span className="material-icons-outlined text-lg mr-2"><Flag className='w-5 h-5' /></span>
                                                Report
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="dark:text-white" style={{ paddingLeft: '12px', paddingBottom: '8px', marginTop: '-8px' }}>
                                <span className="font-semibold">
                                    post.user.fullName
                                </span> 
                                post.caption
                            </p>
                            <div className="relative">

                                {2 === 2 ? (
                                    <div
                                        onClick={() => setIsPlay(false)}
                                        // onDoubleClick={handleLike}
                                        className="relative min-w-full bg-black sm:min-w-96"

                                    >
                                        <video onClick={() => navigate(`/reels/post._id`)}  className="w-full max-h-[60vh] objectcovernow" muted={true} loop autoPlay={true}>
                                            {/* <source src={post.file.url} type={`video/${post.file.fileType}`} /> */}
                                            Your browser does not support the video tag.
                                        </video>
                                        <div
                                            className="absolute p-4 bottom-2 right-2 z-50"
                                            // onClick={handleMute}
                                        >
                                            {!isMute ? (
                                                <GoUnmute className="text-white text-xl" />
                                            ) : (
                                                <IoVolumeMute className="text-white text-xl" />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        onClick={() => navigate(`/reels/{post._id}`)}
                                        // onDoubleClick={handleLike}
                                        // src={post.file.url}
                                        alt="Post Media"
                                        className="w-full object-cover min-h-64 max-h-[500px]"
                                    />
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between mb-4">
                                    <div className="flex space-x-4">
                                        {isLoggedIn ? <> <button
                                            // onClick={handleLike}
                                            className="transform active:scale-125 transition-transform duration-200"
                                        >
                                            <Heart
                                                className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
                                            />
                                        </button> <span style={{ marginLeft: '6px', fontSize: '17px' }} className=" dark:text-white">{0} {0 > 1 ? "Likes" : "Like"}</span> </> : <> <button
                                            onClick={() => navigate('/signup')}
                                            className="transform active:scale-125 transition-transform duration-200"
                                        >
                                            <Heart
                                                className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
                                            />
                                        </button> <span className="font-semibold dark:text-white">{0} {0 > 1 ? "Likes" : "Like"}</span> </>}

                                        {isLoggedIn ? <> <button 
                                        // onClick={() => setShowComments((prev) => !prev)}
                                        >
                                            <MessageCircle className="w-6 h-6 dark:text-white" />
                                        </button>
                                            <button 
                                            // onClick={() => setIsShareOpen(true)}
                                            >
                                                <Send className="w-6 h-6 dark:text-white" />
                                            </button> </> : <> <button onClick={() => navigate('/signup')}>
                                                <MessageCircle className="w-6 h-6 dark:text-white" />
                                            </button> <button onClick={() => navigate('/signup')}>
                                                <Send className="w-6 h-6 dark:text-white" />
                                            </button></>}
                                        { }

                                    </div>
                                    {/* {post.user?.longitude && post.user?.lattitude ? <GetLocation link={post.user?.googleMapLink} createdDate={post.createdAt} longitude={post.user.longitude} lattitude={post.user.lattitude} /> : null} */}


                                </div>

                                <div className="space-y-2">
                                    <button
                                        className="text-gray-500 dark:text-gray-400 text-sm"
                                        // onClick={() => setShowComments((prev) => !prev)}
                                    >
                                        View all comments
                                    </button>
                                    <p className="text-gray-400 text-xs uppercase">
                                        {formatTimeAgo('5day')}
                                    </p>
                                </div>

                            </div>
                        </div>
                    );
                })
            }

        </div>
    );
};

export default UserPosts;
