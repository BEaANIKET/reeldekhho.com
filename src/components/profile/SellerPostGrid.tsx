import { Grid, Bookmark, Heart, Plus, LoaderIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SellerPostGrid(props: any) {
  const [posts, setPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (props.posts && Array.isArray(props.posts[0])) {
      setPosts(props.posts[0]);
    } else {
      setPosts(props.posts);
    }
  }, [props.posts]);

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
          {/* <button className="flex items-center space-x-2 px-4 py-4 text-gray-500 hover:text-gray-900">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">SAVED</span>
          </button> */}
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
                controls
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
            
          </div>
        ))}
      </div>
    </div>
  );
}