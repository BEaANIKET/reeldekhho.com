import { Grid, Bookmark, Heart, Plus, LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerPostGrid(props: any) {
  const [posts, setPosts] = useState([]);
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

  useEffect(() => {
    if (props.posts && Array.isArray(props.posts[0])) {
      setPosts(props.posts[0]);
    } else {
      setPosts(props.posts);
    }
  }, [props.posts]);

  const navigate = useNavigate();

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

  //     console.log(orderRes);

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
  //         console.log(verifyPayment.data.post);
  //         const updatedPost= verifyPayment?.data.post
  //         const index= posts.findIndex((post)=> post._id === verifyPayment.data.post._id);
  //         console.log(index);
  //         setPosts((prev) => {
  //           const updatedPosts = [...prev];
  //           updatedPosts[index] = updatedPost;
  //           return updatedPosts;
  //         });
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
  //       console.log(err?.response?.data)
  //       alert('Payment verification failed. Please contact support.');
  //     } else {
  //       console.log(err);
  //     }
  //   } finally {
  //     setIsLoading((prev) => ({ ...prev, [postId]: false }));
  //   }
  // };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Post Type Navigation */}
      <div className="flex justify-center border-t dark:border-gray-700">
        <div className="flex space-x-12">
          <button className="flex items-center space-x-2 px-4 py-4 border-t-2 border-black dark:border-white -mt-px">
            <Grid className="w-4 h-4" />
            <span className="text-sm font-medium">POSTS</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-4 text-gray-500 hover:text-gray-900">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">SAVED</span>
          </button>
        </div>
      </div>

      {/* Instagram-style Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4">
        {posts.map((post) => (
          <div onClick={() => navigate(`/reels/${post._id}`)} key={post._id} className="relative aspect-square group cursor-pointer">
            {/* Check File Type */}
            {["mp4", "webm", "mov"].includes(post?.file?.fileType?.toLowerCase()) ? (
              <video
                src={post.file.url}
                className="w-full h-full object-cover"
                muted
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

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-3 sm:gap-6 md:gap-9 text-white">
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
              </div>
            </div>

            {/* Boost Button */}
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
        ))}
      </div>
    </div>
  );
}