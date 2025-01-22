import { useEffect, useState, useRef } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, BookmarkX, Flag } from 'lucide-react';
import { IoVolumeMute } from 'react-icons/io5';
import { GoUnmute } from 'react-icons/go';
import CommentSection from './interactions/CommentSection';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import useHandleLikes from '../hooks/post/useHandleLike';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserMute, setUserProfile } from '../store/slices/authSlice';
import useHandleComment from '../hooks/post/useHandleComments';
import { BiDotsVertical } from 'react-icons/bi';
import useSavedPost from '../hooks/post/useSavedpost';
import GetLocation from './interactions/GetLocation';
import { formatTimeAgo } from '../utils/dateUtils';
import ShareButton from './ShareBtn';
import api from '../services/api/axiosConfig';
interface PostProps {
  post: {
    id: number;
    username: string;
    avatar: string;
    file: {
      fileType: string;
      url: string;
    };
    caption: string;
    user: {
      fullName: string;
      profilePicture: string;
      // longitude: string;
      // lattitude:string;
    };
    createdAt: string;
  };
}

const identifyMediaType = (fileType: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'];

  const lowerCaseType = fileType?.toLowerCase();
  return imageExtensions.some((ext) => lowerCaseType.includes(ext))
    ? 'image'
    : videoExtensions.some((ext) => lowerCaseType.includes(ext))
      ? 'video'
      : 'unknown';
};

export default function Post({ post }: PostProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isPlay, setIsPlay] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { likeCount: likes, isLiked, likePost } = useHandleLikes(post._id);
  const isMute = useSelector(state => state.auth.isMute);
  const dispatch = useDispatch();
  const { getComment, createComment, deleteComment, comments } = useHandleComment(post._id)

  const popupRef = useRef<HTMLDivElement | null>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  const [loader, setLoader] = useState({
    addLoader: false,
    removeLoader: false,
  })

  const { addSavedPost, getSavedPosts, removeSavedPost } = useSavedPost()
  const savedPost = useSelector((state) => state.savedPosts.saved_Posts)
  // console.log(savedPost);
  // console.log(post);



  useEffect(() => {
    const value = savedPost.find((save: any) => save.postId._id === post._id)
    if (value) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [savedPost])

  const [isShareOpen, setIsShareOpen] = useState(false);

  const observerRef = useIntersectionObserver(
    () => setIsPlay(true),
    () => setIsPlay(false),
    { threshold: 0.6 }
  )

  useEffect(() => {
    if (observerRef.current) {
      isPlay ? observerRef.current.play() : observerRef.current.pause();
    }
  }, [isPlay]);

  const handleLike = async () => {
    await likePost(post.id);
  };

  const mediaType = identifyMediaType(post.file.fileType);

  const handleMute = () => {
    dispatch(setUserMute(!isMute));
  };
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = (id: number) => {
    if (!loader.removeLoader) {
      setLoader((prev) => ({ ...prev, removeLoader: true }));
      deleteComment(id)
      setShowPopup(false);
      setLoader((prev) => ({ ...prev, removeLoader: false }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowComments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    addSavedPost(post._id);
    setShowMoreOptions(false);
  }

  const handleUnsave = () => {
    removeSavedPost(post._id);
    setShowMoreOptions(false);
  }

  const handleReport = async () => {
    try {
      const response = await api.post(`/post/report-post?id=${post._id}`);
      // console.log(response.data);
    } catch (error) {
      // console.log(error)
      alert(error.response.data.message || "Something went wrong!");
    } finally {
      setShowMoreOptions(false);
    }

  };

  const toggleMoreOption = () => {
    setShowMoreOptions(!showMoreOptions)
  }


  return (
    <div className=" bg-white relative  w-full max-w-lg dark:bg-gray-800 border dark:border-gray-700 rounded-lg mb-4">

      <div className="flex items-center justify-between p-4">
        <Link to={`/seller/${post.user._id}`} className="flex items-center space-x-2">
          <img
            src={post.user.profilePicture}
            alt={post.user.fullName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold dark:text-white">{post.user.fullName}</span>
        </Link>
        <button
          onClick={toggleMoreOption}
          className="dark:text-white"
        >
          <MoreVertical className="cursor-pointer" />
        </button>

        {showMoreOptions && (
          <div
            ref={moreOptionsRef}
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
              <button
                onClick={handleReport}
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
          {/* {post.user.fullName} */}
        </span> {post.caption}
      </p>
      <div className="relative">

        {mediaType === 'video' ? (
          <div
            onClick={() => setIsPlay(false)}
            onDoubleClick={handleLike}
            className="relative min-w-full bg-black sm:min-w-96"

          >
            <video onClick={() => navigate(`/reels/${post._id}`)} ref={observerRef} className="w-full max-h-[60vh] objectcovernow" muted={isMute} loop autoPlay={isPlay}>
              <source src={post.file.url} type={`video/${post.file.fileType}`} />
              Your browser does not support the video tag.
            </video>
            <div
              className="absolute p-4 bottom-2 right-2 z-50"
              onClick={handleMute}
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
            onClick={() => navigate(`/reels/${post._id}`)}
            onDoubleClick={handleLike}
            src={post.file.url}
            alt="Post Media"
            className="w-full object-cover min-h-64 max-h-[500px]"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-4">
            {isLoggedIn ? <> <button
              onClick={handleLike}
              className="transform active:scale-125 transition-transform duration-200"
            >
              <Heart
                className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
              />
            </button> <span style={{ marginLeft: '6px', fontSize: '17px' }} className=" dark:text-white">{likes} {likes > 1 ? "Likes" : "Like"}</span> </> : <> <button
              onClick={() => navigate('/signup')}
              className="transform active:scale-125 transition-transform duration-200"
            >
              <Heart
                className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'dark:text-white'}`}
              />
            </button> <span className="font-semibold dark:text-white">{likes} {likes > 1 ? "Likes" : "Like"}</span> </>}

            {isLoggedIn ? <> <button onClick={() => setShowComments((prev) => !prev)}>
              <MessageCircle className="w-6 h-6 dark:text-white" />
            </button>
              <button onClick={() => setIsShareOpen(true)}>
                <Send className="w-6 h-6 dark:text-white" />
              </button> </> : <> <button onClick={() => navigate('/signup')}>
                <MessageCircle className="w-6 h-6 dark:text-white" />
              </button> <button onClick={() => navigate('/signup')}>
                <Send className="w-6 h-6 dark:text-white" />
              </button></>}
            { }

          </div>
          {post.user?.longitude && post.user?.lattitude ? <GetLocation link={post.user?.googleMapLink} createdDate={post.createdAt} longitude={post.user.longitude} lattitude={post.user.lattitude} /> : null}
          {/* {isLoggedIn ? <button onClick={handleSaved}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''} dark:text-white`} />
          </button> : <button onClick={() => window.location.href = '/signup'}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''} dark:text-white`} />
          </button>} */}



        </div>

        <div className="space-y-2">
          {/* <p className="font-semibold dark:text-white">{likes} likes</p> */}
          {/* <p className="dark:text-white">
            <span className="font-semibold">{post.user.fullName}</span> {post.caption}
          </p> */}
          <button
            className="text-gray-500 dark:text-gray-400 text-sm"
            onClick={() => setShowComments((prev) => !prev)}
          >
            View all comments
          </button>
          <p className="text-gray-400 text-xs uppercase">
            {formatTimeAgo(post.createdAt)}
          </p>
        </div>


        {showComments &&
          <div ref={popupRef} >
            {comments && comments.length && comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-4 mb-2">
                <img
                  src={comment.user.profilePicture}
                  alt={comment.user.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-grow h-full items-start flex flex-col">
                  <p className="font-semibold dark:text-white">{comment.user.fullName}</p>
                  <p className="dark:text-white">{comment.text}</p>
                </div>

                <div className="relative">
                  <BiDotsVertical
                    className="dark:text-white text-black text-lg cursor-pointer"
                    onClick={() => setShowPopup((prev) => (prev === comment._id ? false : comment._id))}
                  />
                  {showPopup === comment._id && (
                    <div className="absolute top-full right-[21px] mt-[-24px] rounded-sm">
                      <p
                        className=" text-white font-semibold rounded-sm cursor-pointer text-sm p-2 bg-red-500  hover:underline"
                        onClick={() => handleDelete(comment._id)}
                      >
                        {loader.removeLoader ? 'loading...' : 'Delete'}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ))}
            < CommentSection postId={post.id} createComment={createComment} loader={loader} setLoader={setLoader} />
          </div>
        }

        <ShareButton
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          reelId={post._id}
        />

      </div>
    </div>
  );
}
