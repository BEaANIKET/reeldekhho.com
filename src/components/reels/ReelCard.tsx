import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Music2, User } from 'lucide-react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import useHandleReelsLikes from '../../hooks/reels/useHandleLikes';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { BsWhatsapp } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import useHandleComment from '../../hooks/post/useHandleComments';
import { BiDotsVertical } from 'react-icons/bi';
import CommentSection from '../interactions/CommentSection';
import ShareButton from '../ShareBtn';
import GetLocation from '../interactions/GetLocation';
import api from '../../services/api/axiosConfig';
import LikeList from '../LikeList';

interface ReelCardProps {
  reel: {
    _id: string;
    userId: string;
    file: {
      url: string;
      fileType: string;
      publicId: string;
    };
    caption: string;
    price: number;
    category: string;
    location: string;
    likes: number;
    createdAt: string;
    updatedAt: string;
    user: {
      _id: string;
      fullName: string;
      profilePicture: string;
    };
  };
}

export default function ReelCard({ reel }: ReelCardProps) {
  const { isLoggedIn } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isVideoPlay, setIsVideoPlay] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const navigate = useNavigate();
  const { isLiked, likeCount, likePost } = useHandleReelsLikes(reel._id);
  const { getComment, createComment, deleteComment, comments } = useHandleComment(reel._id)
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [loader, setLoader] = useState({
    addLoader: false,
    removeLoader: false,
  })
  const [showPopup, setShowPopup] = useState(false);

  const videoRef = useIntersectionObserver(
    () => setIsVideoPlay(true),
    () => setIsVideoPlay(false),
    { threshold: 0.5 }
  );

  useEffect(() => {
    if (videoRef.current && reel.file.url.includes('video/')) {
      if (isVideoPlay) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoPlay, reel.file.fileType]);

  const handleLike = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await likePost(postMessage._id);
  };

  const handleSave = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleReelsClick = (event: React.MouseEvent) => {
    // Prevent handling clicks on child elements (like the comment section)
    if (event.target instanceof HTMLElement && event.target.closest('.comment-popup')) {
      return;
    }

    if (reel.file.url.includes('video/')) {
      if (videoRef.current?.paused) {
        videoRef.current.play();
      } else {
        videoRef.current?.pause();
      }
    }
  };


  const handleCommentClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent video pause when opening comments
    setIsCommentOpen(true);
  };

  const iconClicked = (url: string) => {
    window.location.href = url;
  };

  const closeCommentPopup = () => {
    setIsCommentOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!loader.removeLoader) {
      setLoader((prev) => ({ ...prev, removeLoader: true }));
      deleteComment(id)
      setShowPopup(false);
      setLoader((prev) => ({ ...prev, removeLoader: false }));
    }

  };
  const [localLikes, setLocalLikes] = useState(reel.likes);
  const [isShareOpen, setIsShareOpen] = useState(false);
  // //(" this is reels ->  ", reel);


  useEffect(() => {
    const setView = async () => {
      try {
        const response = await api.post(`/post/view?postId=${reel._id}`)
        //(response.data);
      } catch (error) {
        //(error.message);
      }
    }


    setView();
  }, [])

  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const response = await api.get(`/post/getview?postId=${reel._id}`);
        setViewCount(response.data.viewCount);
      } catch (error) {
        console.error('Error fetching view count:', error.messages);
      }
    };

    if (reel && reel._id) {
      fetchViewCount();
    }

  }, [reel, reel?._id]);

  //(reel?.user);

  const [likeCard, setLikeCard]= useState(false);
  const [likedPostId, setLikedPostId] = useState('');


  return (
    <div
      onClick={handleReelsClick}
      style={{
        textShadow: '3px 2px 2px black'
      }}
      className="reel relative z-10 text-[#f2f2f2] font-extrabold h-[100dvh] bg-black bg-inherit w-full bg-contain bg-center snap-start overflow-hidden"
    >
      <div className=' relative flex items-center justify-center h-full w-full'>
        <div className=' absolute bg-black  flex w-full justify-between  top-4  left-0 right-0  '>
          <div className=' cursor-pointer z-50 bg-black p-2 rounded-md '>
            {reel.user?.longitude && reel.user?.lattitude ? <GetLocation link={reel.user?.googleMapLink} createdDate={reel.createdAt} longitude={reel.user.longitude} lattitude={reel.user.lattitude} /> : null}
          </div>

          <div className="flex items-center gap-1 p-2 rounded-md  text-xs ">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
            <span className="font-semibold flex items-center justify-center">
              {viewCount} {/* Show the view count here */}
            </span>
          </div>
        </div>

        {reel.file.url.includes('image/') ? (
          <img
            src={reel.file.url}
            alt={reel.caption || 'Reel Image'}
            className=" object-contain object-center"
            loading="lazy"
          />
        ) : (
          <video
            ref={videoRef}
            key={reel._id}
            src={reel.file.url}
            className=" object-contain "
            loop
            playsInline
          />
        )}
      </div>


      {/* Overlay */}
      <div className="absolute inset-0 bottom-12 top-0">
        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0   w-full right-12 p-4">

          <Link to={`/seller/${reel.user._id}`} className=" flex items-center  space-x-2 mb-3">
            <img
              src={reel.user.profilePicture || 'https://cdn.pixabay.com/photo/2023/12/04/06/14/ai-generated-8428762_1280.jpg'}
              alt={`${reel.user.fullName}'s avatar`}
              className="w-8 h-8 rounded-full border border-white"
              loading="lazy"
            />

            {/* </div> */}
            <span className=" p-2 text-md ">
              {reel.user.fullName || 'Unknown User'}
            </span>
          </Link>

          {/* Caption */}
          <p className=" text-sm font-normal mb-2 line-clamp-2">{reel.caption}</p>

          {/* Music */}
          <div className="flex text-sm font-normal items-center space-x-2 ">
            <Music2 className="w-3 h-3" />
            <span className="text-xs">{reel.category}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute  bottom-4 right-2 space-y-4">
          <button
            onClick={() => iconClicked(`https://wa.me/${reel?.user?.phone}`)}
            className="flex  rounded-full p-2 flex-col items-center"
          >
            <BsWhatsapp
              className={`w-6 h-6 transition-colors `}
            />
          </button>
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLike}
                className="flex flex-col rounded-full p-2 items-center"
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : ''
                    }`}
                />
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setLikedPostId(reel._id);
                    setLikeCard(true)
                  }}
                  className=" text-xs mt-1">{likeCount.toLocaleString()}</span>
              </button>

              <button
                onClick={handleCommentClick}
                className="flex flex-col  rounded-full p-2 items-center"
                aria-label="Comment"
              >
                <MessageCircle className="w-6 h-6 " />
                <span className=" text-xs mt-1"> {comments.length || 0} </span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="flex flex-col items-center rounded-full p-2 "
              >
                <Send className="w-6 h-6 " />
              </button>

              <button
                onClick={handleSave}
                className="flex flex-col items-center  rounded-full p-2"
                aria-label={isSaved ? 'Unsave' : 'Save'}
              >
                <Bookmark
                  className={`w-6 h-6 transition-colors ${isSaved ? ' fill-current' : ''
                    }`}
                />
              </button>


            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/signup')}
                className="flex flex-col items-center  rounded-full p-2 "
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : ''
                    }`}
                />
                <span className=" text-xs mt-1">{likeCount.toLocaleString()}</span>
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="flex flex-col items-center  rounded-full p-2"
                aria-label="Comment"
              >
                <MessageCircle className="w-6 h-6 " />
                <span className=" text-xs mt-1"> {comments?.length || 0} </span>
              </button>

              <button
                onClick={() => setIsShareOpen(true)}
                className="flex flex-col items-center  rounded-full p-2"
              >
                <Send className="w-6 h-6 " />
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="flex flex-col items-center  rounded-full p-2"
                aria-label={isSaved ? 'Unsave' : 'Save'}
              >
                <Bookmark
                  className={`w-6 h-6 transition-colors ${isSaved ? ' fill-current' : ''
                    }`}
                />
              </button>
            </>
          )}
        </div>
        <ShareButton
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          reelId={reel._id}
        />
      </div>

      {isCommentOpen ? (
        <div
          className={`absolute z-50  overflow-y-scroll bottom-0 left-0 right-0 bg-gray-900  p-4 rounded-t-lg transform transition-transform duration-300 ${isCommentOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          style={{ height: '50%' }}
        >
          <div className="flex sticky top-0 bg-inherit z-40  justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Comments</h2>
            <button
              onClick={closeCommentPopup}
              className=" hover:text-gray-400"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 comment-popup w-full h-full">
            {comments && comments.length ?
              (comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-4 mb-2">
                  <img
                    src={comment.user.profilePicture}
                    alt={comment.user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-grow h-full items-start flex flex-col">
                    <p className="font-semibold dark:">{comment.user.fullName}</p>
                    <p className="dark:">{comment.text}</p>
                  </div>

                  <div className="relative">
                    <BiDotsVertical
                      className="dark: text-black text-lg cursor-pointer"
                      onClick={() => setShowPopup((prev) => (prev === comment._id ? false : comment._id))}
                    />
                    {showPopup === comment._id && (
                      <div className="absolute top-full right-[21px] mt-[-24px] rounded-sm">
                        <p
                          className="  font-semibold rounded-sm cursor-pointer text-sm p-2 bg-red-500  hover:underline"
                          onClick={() => handleDelete(comment._id)}
                        >
                          {loader.removeLoader ? 'loading...' : 'Delete'}
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ))) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No comments yet
                </div>
              )
            }
          </div>

          <div className=' sticky bottom-14 bg-inherit z-40 top-0 w-full '>
            < CommentSection postId={reel._id} createComment={createComment} loader={loader} setLoader={setLoader} />
          </div>

        </div>
      ) : (
        <div>
          No any comment yet
        </div>
      )
      }


      {
        likeCard && (
          <LikeList setLikeCard={setLikeCard} likedPostId={likedPostId} />
        )
      }


      {
        likeCard && (
          <div
            onClick={() => {
              setLikeCard(false)
            }
            }
            className='fixed w-screen h-screen left-0 bg-[#0000005b] top-0 z-40'>
          </div>
        )
      }


    </div>
  );
}
