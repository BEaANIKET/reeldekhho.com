import { Grid, Bookmark, Heart, LoaderIcon, Plus, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api/axiosConfig';
import { useDispatch } from 'react-redux';
import { updateParticularPost } from '../../store/slices/authSlice';
// import useGetPost from '../../hooks/profile/useGetPost';
// import { useSelector } from 'react-redux';
// import { ProfilePostSkeloton } from './ProfilePostSkeloton';

const ProfileGrid = ({ post }) => {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const response = await api.get(`/post/getview?postId=${post._id}`);
        setViewCount(response.data.viewCount);
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchViewCount();
  }, [post._id]);

  return (
    <div className="">
      {/* Other post content */}
      <div className="md:flex gap-3  hidden sm:gap-6 md:gap-9 text-white">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
          <span className="font-semibold">{post?.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" />
          </svg>
          <span className="font-semibold">{post?.comments || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 3a9 9 0 11-9 9 9.01 9.01 0 019-9zm-1 5H9a1 1 0 000 2h3v5a1 1 0 002 0V9a1 1 0 00-1-1z" />
          </svg>
          <span className="font-semibold flex items-center justify-center">
            {viewCount} {/* Show the view count here */}
          </span>
        </div>
      </div>

      <div className=" absolute bottom-0 left-0 flex items-center gap-1">
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 3a9 9 0 11-9 9 9.01 9.01 0 019-9zm-1 5H9a1 1 0 000 2h3v5a1 1 0 002 0V9a1 1 0 00-1-1z" />
        </svg>
        <span className="font-semibold flex items-center justify-center">
          {viewCount} {/* Show the view count here */}
        </span>
      </div>

      {/* <button
        onClick={(e) => handleBoostClick(e, post._id)}
        disabled={post.isBoosted.status}
        className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transform transition-all duration-300 ease-in-out
          ${post.isBoosted.status
            ? 'bg-gradient-to-r from-green-400 to-green-500 cursor-not-allowed scale-105'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 hover:scale-105'
          } text-white`}
      >
        {isLoading[post?._id] ? (
          <LoaderIcon className='animate-spin w-4 h-4' />
        ) : post.isBoosted.status ? (
          <span className="flex items-center space-x-1 px-1 transition-opacity duration-200">
            <span className=" text-[0.5rem] sm:text-xs font-medium whitespace-nowrap">Boosted</span>
          </span>
        ) : (
          <Plus className="sm:w-5 sm:h-5 w-[0.85rem] h-[0.85rem] animate-pulse" />
        )}
      </button> */}
    </div>
  );
};
const ProfileGrid2 = ({ post }) => {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const response = await api.get(`/post/getview?postId=${post._id}`);
        setViewCount(response.data.viewCount);
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchViewCount();
  }, [post._id]);

  return (
    <div className="">
      {/* Other post content */}

      <div className=" absolute bottom-0 left-0 flex items-center gap-1 text-white">
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
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

      {/* <button
        onClick={(e) => handleBoostClick(e, post._id)}
        disabled={post.isBoosted.status}
        className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transform transition-all duration-300 ease-in-out
          ${post.isBoosted.status
            ? 'bg-gradient-to-r from-green-400 to-green-500 cursor-not-allowed scale-105'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 hover:scale-105'
          } text-white`}
      >
        {isLoading[post?._id] ? (
          <LoaderIcon className='animate-spin w-4 h-4' />
        ) : post.isBoosted.status ? (
          <span className="flex items-center space-x-1 px-1 transition-opacity duration-200">
            <span className=" text-[0.5rem] sm:text-xs font-medium whitespace-nowrap">Boosted</span>
          </span>
        ) : (
          <Plus className="sm:w-5 sm:h-5 w-[0.85rem] h-[0.85rem] animate-pulse" />
        )}
      </button> */}
    </div>
  );
};

export default function PostGrid(props) {
  //(props);
  const navigate = useNavigate();
  const posts = props.posts;

  // const dispatch = useDispatch();

  // const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // const loadRazorpayScript = () => {
  //   return new Promise((resolve) => {
  //     const script = document.createElement('script');
  //     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //     script.onload = () => resolve(true);
  //     script.onerror = () => resolve(false);
  //     document.body.appendChild(script);
  //   });
  // };

  // const handleBoostClick = async (e: any, postId: String) => {
  //   e.stopPropagation();
  //   setIsLoading((prev) => ({ ...prev, [postId]: true }));
  //   try {

  //     const isScriptLoaded = await loadRazorpayScript();
  //     if (!isScriptLoaded) {
  //       throw new Error('Failed to load Razorpay script');
  //     }

  //     const orderRes = await api.post("/post/boostPost", {
  //       postId: postId,
  //       amount: 500 * 100
  //     })

  //     //(orderRes);

  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: orderRes?.data.order.amount,
  //       currency: 'INR',
  //       name: 'Boost Post',
  //       description: `Boosting post with post-id: ${postId}`,
  //       order_id: orderRes?.data.order.id,
  //       handler: async (response: any) => {

  //         const verifyPayment = await api.post('/post/boost-post/verify-payment', {
  //           razorpay_payment_id: response.razorpay_payment_id,
  //           razorpay_order_id: response.razorpay_order_id,
  //           razorpay_signature: response.razorpay_signature,
  //           postId: postId
  //         })
  //         // //(verifyPayment.data.post);
  //         const index = posts.findIndex((post) => post?._id === verifyPayment.data.post._id);
  //         const updatedPost = verifyPayment.data.post;

  //         dispatch(updateParticularPost({
  //           index,
  //           post: updatedPost
  //         }))
  //       },
  //       prefill: {
  //         name: 'User Name', // You can get this from your user context
  //         email: 'user@example.com',
  //         contact: '9999999999'
  //       },
  //       theme: {
  //         color: '#3B82F6'
  //       }
  //     };

  //     const razorpay = new (window as any).Razorpay(options);
  //     razorpay.open();
  //   } catch (err) {

  //     if (err?.response) {
  //       // //(err?.response?.data)
  //       alert('Payment verification failed. Please contact support.');
  //     } else {
  //       // //(err);
  //     }
  //   } finally {
  //     setIsLoading((prev) => ({ ...prev, [postId]: false }));
  //   }
  // };


  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Post Type Navigation */}
        <div className="flex justify-center border-t dark:border-gray-700">
          <div className="flex space-x-12">
            <button className="flex items-center space-x-2 px-4 py-4 border-t-2 border-black dark:border-white -mt-px">
              <Grid className="w-4 h-4" />
              <span className="text-sm font-medium">POSTS</span>
            </button>
            {/* <button className="flex items-center space-x-2 px-4 py-4 text-gray-500 hover:text-gray-900">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm font-medium">SAVED</span>
            </button> */}
          </div>
        </div>

        {/* Instagram-style Grid */}
        {
          posts && posts.length ?
            (
              <div className="grid grid-cols-3 w-full gap-1 mt-4">
                {posts.map((post: any) => (

                  <div onClick={() => {
                    navigate(`/posts?id=${post._id}`);
                  }} key={post._id} className="relative aspect-square group cursor-pointer">
                    {["mp4", "webm", "mov"].includes(post?.file?.fileType?.toLowerCase()) ? (
                      <video
                        src={post.file.url}
                        className="w-full h-full object-cover"
                      ></video>
                    ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(post?.file?.fileType?.toLowerCase()) ? (
                      <img
                        src={post?.file.url}
                        alt={post?.caption || "Post Image"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        Unsupported Format
                      </div>
                    )}

                    <div className="absolute  inset-0 bg-black  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 md:flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ProfileGrid post={post} />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <ProfileGrid2 post={post} />
                    </div>


                  </div>

                ))}
              </div>
            ) : (
              <div className=' w-full text-center mt-3  font-medium opacity-70'>No Post Found</div>
            )
        }
      </div>
    </>

  );
}