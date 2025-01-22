import { lazy, Suspense } from 'react';
import Suggestions from './Suggestions';
import useGetPosts from '../hooks/post/useGetPost';
import { useSelector } from 'react-redux';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import HeaderStatic from './HeaderStatic'
const Post = lazy(() => import('./Post'));

export default function Feed() {
  const { loading, error, loadMorePosts } = useGetPosts();
  const posts = useSelector((state) => state.post.posts);

  const observerRef = useIntersectionObserver(
    loadMorePosts,
    () => { },
    { threshold: 0.3 }
  );

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center text-black">
        Loading posts...
      </div>
    );
  }
  return (
    <>
      <HeaderStatic />
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 margintopo">

        {/* Posts Area */} 
        <div className=" lg:col-span-2 mx-auto md:mt-0 max-w-2xl">

          <Suspense
            fallback={
              <div className="w-full h-full flex justify-center items-center text-black">
                Loading post...
              </div>
            }
          >
            <div className=""> 
              {posts?.length > 0 ? (
                posts.map((post) => <Post key={post._id} post={post} />)
              ) : (
                <div className="text-center text-gray-500">No posts available</div>
              )}
            </div>
          </Suspense>
          <div ref={observerRef} className="w-full text-center dark:text-white text-black h-10 bg-transparent">
            Loading ...
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="hidden lg:block">
          <Suggestions />
        </div>
      </div>
    </>
  );
}
