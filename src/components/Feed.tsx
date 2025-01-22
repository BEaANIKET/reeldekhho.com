
import { lazy, Suspense, useCallback, useEffect } from 'react';
import Suggestions from './Suggestions';
import useGetPosts from '../hooks/post/useGetPost';
import { useSelector } from 'react-redux';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import useSavedPost from '../hooks/post/useSavedpost';
import HeaderStatic from './HeaderStatic';
import { User } from 'lucide-react';
const Post = lazy(() => import('./Post'));

const LoaderSkeloton = () => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-14 dark:bg-black bg-white animate-pulse rounded-md mb-2"></div>
      <div className="flex max-w-lg h-fit">
        {/* Feed Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Post Skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-black rounded-lg shadow-md p-4 space-y-4 animate-pulse">
              {/* Post Header */}
              <div className="flex items-center space-x-4">
                <div className="bg-gray-400 w-10 h-10 rounded-full"></div>
                <div className="bg-gray-400 h-6 w-24 rounded"></div>
              </div>

              {/* Post Image or Video */}
              <div className="bg-gray-400 w-full h-80 rounded-lg mt-4"></div>

              {/* Post Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="space-x-4 flex">
                  <div className="bg-gray-400 w-6 h-6 rounded-full"></div>
                  <div className="bg-gray-400 w-6 h-6 rounded-full"></div>
                  <div className="bg-gray-400 w-6 h-6 rounded-full"></div>
                </div>
                <div className="bg-gray-400 w-12 h-6 rounded"></div>
              </div>

              {/* Post Caption */}
              <div className="bg-gray-400 h-6 w-3/4 rounded mt-2"></div>
              <div className="bg-gray-400 h-6 w-1/2 rounded mt-1"></div>

              {/* Comments Section */}
              <div className="bg-gray-400 h-6 w-2/3 rounded mt-3"></div>
              <div className="bg-gray-400 h-6 w-3/4 rounded mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Feed() {
  const { loading, error, loadMorePosts } = useGetPosts();
  const posts = useSelector((state) => state?.post?.posts);
  const user = useSelector((state) => state?.auth?.user);

  const observerRef = useIntersectionObserver(
    useCallback(() => {
      loadMorePosts();
    }, [loadMorePosts]),
    () => { },
    { threshold: 0.3 }
  );

  if (loading) {
    return <LoaderSkeloton />;
  }

  return (
    <>
      <HeaderStatic />
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 margintopo">
        {/* Posts Area */}
        <div className="lg:col-span-2 mx-auto md:mt-0 max-w-2xl">
          <Suspense fallback={<div> </div>}>
            <div className=''>
              {posts?.length > 0 ? (
                posts.map((post, index) => <Post key={index} post={post} />)
              ) : (
                <div className="text-center text-gray-500">No posts available</div>
              )}
            </div>
          </Suspense>

          {/* last div  */}
          <div className="w-full dark:text-white text-black text-center mt-3" ref={observerRef}>
            Loading ...
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="hidden lg:block">
          <Suspense fallback={<div>Loading Suggestions...</div>}>
            <Suggestions />
          </Suspense>
        </div>
      </div>
    </>
  );
}
