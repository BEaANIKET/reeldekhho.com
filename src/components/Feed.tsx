
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Suggestions from './Suggestions';
import useGetPosts from '../hooks/post/useGetPost';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import HeaderStatic from './HeaderStatic';
import toast from 'react-hot-toast';
import api from '../services/api/axiosConfig';
import LikeList from './LikeList';
import { useLocation } from 'react-router-dom';
// import { User } from 'lucide-react';
const Post = lazy(() => import('./Post'));

const LoaderSkeloton = () => {
  return (
    <div className="flex flex-col  w-screen max-w-lg items-center ">
      <div className="flex max-w-lg h-fit  w-full">
        {/* Feed Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 w-full flex flex-col items-center justify-center">
          {/* Post Skeleton */}
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-black w-full rounded-lg shadow-md p-4 space-y-4 animate-pulse">
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

export default function Feed({ homeClick }) {
  const { loading, error, fetchPosts, loadMorePosts, posts } = useGetPosts();
  const reportString = 'cursor-pointer ml-5';
  const [curntPostId, setCurntPostId] = useState(null);
  const [likedPostId, setLikedPostId] = useState('');

  const { pathname = '/' } = useLocation()
  const [reportBottomSheet, setReportBottomSheet] = useState(false);
  const [likeCard, setLikeCard] = useState(false)

  const reportRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useIntersectionObserver(
    useCallback(() => {
      loadMorePosts();
    }, [loadMorePosts]),
    () => { },
    { threshold: 0.3 }
  );

  useEffect(() => {
    if (!posts?.length) {
      fetchPosts();
    }
  }, [])



  const handleSubmitReport = async (event: HTMLParagraphElement) => {
    const reportMessage = event?.currentTarget.id;
    try {
      const response = await api.post(`/post/report-post?id=${curntPostId}`, { message: reportMessage });
      //(response.data);
      toast.success("Post Reported Successfully");
    } catch (error) {
      //(error)
      toast.error(error?.response?.data.message || "Something went wrong!");
    } finally {
      setReportBottomSheet(false);
      setCurntPostId(null);
    }
  }


  return (
    <>
      <HeaderStatic />

      <div className="max-w-4xl mx-auto  container flex  margintopo">
        {/* Posts Area */}
        {
          loading ? (
            <div className=' w-full flex justify-center' >
              <LoaderSkeloton />
            </div>
          ) : (
            <div className="lg:col-span-2 mx-auto md:mt-0 max-w-2xl">
              <Suspense fallback={<div> </div>}>
                <div className=''>
                  {posts && posts.length && posts?.length > 0 ? (
                    posts.map((post, index) =>
                      <Post
                        key={index}
                        post={post}
                        setCurntPostId={setCurntPostId}
                        setReportBottomSheet={setReportBottomSheet}
                        setLikeCard={setLikeCard}
                        setLikedPostId={setLikedPostId}
                      />)
                  ) : (
                    <div className=' w-full flex justify-center' >
                      <LoaderSkeloton />
                    </div>
                  )}
                </div>
              </Suspense>

              {/* last div  */}
              <div className="w-full dark:text-white text-black text-center mt-3" ref={observerRef}>
                Loading ...
              </div>
            </div>

          )
        }

        {/* Suggestions Sidebar */}
        <div className="hidden lg:block">
          <Suspense fallback={<div>Loading Suggestions...</div>}>
            <Suggestions />
          </Suspense>
        </div>

        {
          likeCard && (
            <LikeList setLikeCard={setLikeCard} likedPostId={likedPostId} />
          )
        }


        {
          (reportBottomSheet || likeCard) && (
            <div
              onClick={() => {
                setReportBottomSheet(false)
                setLikeCard(false)
              }
              }
              className='fixed w-screen h-screen left-0 bg-[#0000005b] top-0 z-40'>
            </div>
          )
        }

        {
          reportBottomSheet && (
            <div ref={reportRef} className='fixed bottom-0 bg-[#dfdddd] w-full px-4 py-8 z-50 flex flex-col gap-2 rounded-t-3xl'>
              <div className='w-8 h-1.5 rounded-md bg-[#00000081] self-center'></div>
              <h1 className='font-bold text-lg text-center'>Report</h1>
              <h2 className='font-bold text-center'>Why are you Reporting this post?</h2>

              <p
                onClick={handleSubmitReport}
                id="I just don't like it"
                className={reportString}
              >
                I just don't like it
              </p>
              <p
                onClick={handleSubmitReport}
                id='Sexual or nudity'
                className={reportString}
              >
                Sexual or nudity
              </p>
              <p
                onClick={handleSubmitReport}
                id='Violence,hate or exploitation'
                className={reportString}
              >
                Violence,hate or exploitation
              </p>
              <p
                onClick={handleSubmitReport}
                id='Scam, Fraud or spam'
                className={reportString}
              >
                Scam, Fraud or spam
              </p>
              <p
                onClick={handleSubmitReport}
                id='False information'
                className={reportString}
              >
                False information
              </p>
            </div>
          )
        }

      </div >

    </>
  );
}
