// import { Grid, Bookmark, Heart, Plus, LoaderIcon } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api/axiosConfig';

// export default function SellerPostGrid(props: any) {
//   const [posts, setPosts] = useState([]);
//   // const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     if (props.posts && Array.isArray(props.posts[0])) {
//       setPosts(props.posts[0]);
//     } else {
//       setPosts(props.posts);
//     }
//   }, [props.posts]);

//   const navigate = useNavigate();

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-4">


//       {/* Post Type Navigation */}
//       <div className="flex justify-center border-t dark:border-gray-700">
//         <div className="flex space-x-12">
//           <button className="flex items-center space-x-2 px-4 py-4 border-t-2 border-black dark:border-white -mt-px">
//             <Grid className="w-4 h-4" />
//             <span className="text-sm font-medium">POSTS</span>
//           </button>
//           {/* <button className="flex items-center space-x-2 px-4 py-4 text-gray-500 hover:text-gray-900">
//             <Bookmark className="w-4 h-4" />
//             <span className="text-sm font-medium">SAVED</span>
//           </button> */}
//         </div>
//       </div>

//       {/* Instagram-style Grid */}
//       <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4">
//         {posts.map((post) => {
//           const [viewCount, setViewCount] = useState(0);

//           const fetchViewCount = async () => {
//             try {
//               const response = await api.get(`/post/getview?postId=${post._id}`);
//               setViewCount(response.data.viewCount);
//             } catch (error) {
//               console.error('Error fetching view count:', error);
//             }
//           };

//           fetchViewCount();
//           return (
//             // onClick={() => navigate(`/reels/${post._id}`)}
//             <div onClick={() => navigate(`/sellerPost?id=${post._id}`)} key={post._id} className="relative aspect-square group cursor-pointer">
//               {/* Check File Type */}
//               {["mp4", "webm", "mov"].includes(post?.file?.fileType?.toLowerCase()) ? (
//                 <video
//                   src={post.file.url}
//                   className="w-full h-full object-cover"
//                 ></video>
//               ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(post?.file?.fileType?.toLowerCase()) ? (
//                 <img
//                   src={post?.file.url}
//                   alt={post?.caption || "Post Image"}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
//                   Unsupported Format
//                 </div>
//               )}

//               <div className=" absolute bottom-0 left-0 flex items-center gap-1 text-white">
//                 <svg
//                   className="w-4 h-4 sm:w-6 sm:h-6"
//                   fill="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />
//                 </svg>
//                 <span className="font-semibold flex items-center justify-center">
//                   {viewCount} {/* Show the view count here */}
//                 </span>
//               </div>

//               {/* Hover Overlay */}
//               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
//                 <div className="flex gap-3 sm:gap-6 md:gap-9 text-white">
//                   <div className="flex items-center gap-1">
//                     <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
//                     <span className="font-semibold">{post?.likes}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" />
//                     </svg>
//                     <span className="font-semibold">{post?.comments || 0}</span>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           )
//         }
//         )}
//       </div>
//     </div>
//   );
// }


import { Grid, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api/axiosConfig";

export default function SellerPostGrid(props: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (props.posts && Array.isArray(props.posts[0])) {
      setPosts(props.posts[0]);
    } else {
      setPosts(props.posts);
    }
  }, [props.posts]);

  useEffect(() => {
    // Fetch view counts for all posts
    const fetchViewCounts = async () => {
      try {
        const viewCountPromises = posts.map(async (post) => {
          const response = await api.get(`/post/getview?postId=${post._id}`);
          return { postId: post._id, viewCount: response.data.viewCount };
        });

        const results = await Promise.all(viewCountPromises);
        const counts = results.reduce((acc, { postId, viewCount }) => {
          acc[postId] = viewCount;
          return acc;
        }, {} as Record<string, number>);

        setViewCounts(counts);
      } catch (error) {
        console.error("Error fetching view counts:", error);
      }
    };

    if (posts.length > 0) {
      fetchViewCounts();
    }
  }, [posts]);

  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Post Type Navigation */}
      <div className="flex justify-center border-t dark:border-gray-700">
        <div className="flex space-x-12">
          <button className="flex items-center space-x-2 px-4 py-4 border-t-2 border-black dark:border-white -mt-px">
            <Grid className="w-4 h-4" />
            <span className="text-sm font-medium">POSTS</span>
          </button>
        </div>
      </div>

      {/* Instagram-style Grid */}
      <div className="grid grid-cols-3 gap-1 mt-4">
        {posts.map((post) => (
          <div
            onClick={() => navigate(`/sellerPost?id=${post._id}`)}
            key={post._id}
            className="relative aspect-square group cursor-pointer"
          >
            {/* Check File Type */}
            {["mp4", "webm", "mov"].includes(post?.file?.fileType?.toLowerCase()) ? (
              <video src={post.file.url} className="w-full h-full object-cover" />
            ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(post?.file?.fileType?.toLowerCase()) ? (
              <img
                src={post?.file.url}
                alt={post?.caption || "Post Image"}
                className="w-full h-full overflow-hidden object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                Unsupported Format
              </div>
            )}

            {/* View Count */}
            <div className="absolute bottom-0 left-0 flex items-center gap-1 text-white">
              <svg
                className="w-4 h-4 sm:w-6 sm:h-6 text-[#f2f2f2]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />
              </svg>
              <span className="font-semibold flex items-center justify-center text-[#f2f2f2]">
                {viewCounts[post._id] || 0} {/* Show the view count here */}
              </span>
            </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
