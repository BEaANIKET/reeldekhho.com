import { MapPin, Loader2Icon, Star, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoMdChatboxes } from "react-icons/io";
import SellerPostGrid from "./SellerPostGrid";
import useFollow from "../../hooks/useFollow";
import { ProfileSkeloton } from "./ProfileSkeloton";
import ProfileRating from "./ProfileRating";
import api from "../../services/api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setSellerData } from "../../store/slices/sellerSlice";
import { Image, Modal } from "antd";
import ReviewPopupCard from "./ReviewPopup";

export default function SellerProfileHeader() {
  // const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const bottomSheetRef = useRef<HTMLDivElement | HTMLButtonElement>(null);
  const { id } = useParams();
  const [profile, setProfile] = useState(true);
  const [Seller, setSeller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [checkFollowed, setCheckFollowed] = useState(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isRateBottomSheetOpen, setIsRateBottomSheetOpen] = useState(false);

  const navigate = useNavigate()
  const { following, followers, createFollower, removeFollower } = useFollow({ id: id });

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const [reviewId, setReviewId] = useState(undefined);

  const reviewedId = useSelector((state: any) => state.reviews.reviewedUser);
  console.log(reviewedId);
  const [ReviewPopup, setReviewPopup] = useState(false)

  useEffect(() => {
    const reviwedSeller = reviewedId.find((user: any) => user.reviewedId === id);
    //('seller review-', reviwedSeller?.reviewedId)
    setReviewId(reviwedSeller)
  }, [reviewedId]);

  const fetchprofile = async () => {
    try {
      setPageLoading(true)
      const res = await api.post(`/post/getprofile/${id}`);
      dispatch(setSellerData({ post: res.data.sellerposts, seller: res.data.profile }));
      setProfile(res.data.profile);
      setSeller(res.data.sellerposts);
    } catch (error) {

    } finally {
      setPageLoading(false)
    }
  };

  const checkFollowing = () => {
    const val = followers?.find((follow: any) => follow?.followerDetails._id === user?._id)

    if (val) {
      setCheckFollowed(val);
    }
  };

  useEffect(() => {
    const outsideClickDetect = (event: MouseEvent) => {
      if (bottomSheetRef.current && !bottomSheetRef.current.contains(event.target as Node)) {
        setIsBottomSheetOpen(false);
      }
    };

    document.addEventListener('mousedown', outsideClickDetect);

    return () => {
      document.removeEventListener('mousedown', outsideClickDetect)
    };
  }, []);

  useEffect(() => {
    fetchprofile();
  }, [id]);

  useEffect(() => {
    checkFollowing();
  }, [followers]);

  const handleClick = async () => {
    await createFollower(id);
  };

  const handleUnfollow = async () => {
    await removeFollower(id);
    setIsBottomSheetOpen(false);
    setCheckFollowed(null);
  }

  const handleWhatsapp = () => {
    window.open(`https://wa.me/${profile?.phone}`);
  }

  const PopupReview = () => {
    setReviewPopup(true);
  }

  if (pageLoading) {
    return <ProfileSkeloton />;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 pb-2">
        <div className="max-w-screen-lg mx-auto mt-2 sm:mt-5 md:mt-10 px-4">
          {/* Profile Section */}
          <div className="flex flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div onClick={() => setPopup(true)} className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg overflow-hidden flex items-center justify-center">
                {/* <Image
                  src={profile?.profilePicture}
                  alt="Profile Picture"
                  // layout="fill"
                  // objectFit="cover"
                  // objectPosition="top"
                  className=" h-full object-cover "
                /> */}
                <img src={profile?.profilePicture} className="w-full h-full object-cover " alt="" />
              </div>



              <div className="sm:hidden flex items-center justify-start gap-4 ">
                <h1 className="text font-semibold text-gray-800 dark:text-gray-200">
                  {profile?.fullName}
                </h1>
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex-grow">
              {/* Username and Follow Button */}
              <div className="flex items-center justify-start gap-4 ">
                <h1 className="text-xl hidden sm:block md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  {profile?.fullName}
                </h1>
                <div className="flex gap-4">
                  <IoMdChatboxes
                    onClick={() => navigate("/messages/" + profile._id)}
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                  />
                  <FaWhatsapp onClick={handleWhatsapp} className="w-6 h-6 text-green-500 cursor-pointer" />
                  <MapPin onClick={() => window.open(profile.googleMapLink)} className="w-6 h-6 text-blue-500 cursor-pointer" />
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex gap-2">
                <div className="flex space-x-2 sm:space-x-4 md:space-x-8 mt-4">
                  <div>
                    <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                      {Seller.length}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">
                      posts
                    </span>
                  </div>
                  <div>
                    <Link to={`/followers/${id}`}>
                      <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                        {followers?.length || '0'}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        followers
                      </span>
                    </Link>
                  </div>
                  <div>
                    <Link to={`/following/${id}`}>
                      <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                        {following?.length || '0'}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">
                        following
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Full Name and Bio Section */}
              <div className="sm:mt-4 mt-1 bg-gray-300 p-2 rounded-md">
                <h2 className="sm:text-lg text-xs capitalize font-semibold text-gray-800 dark:text-gray-200">
                  {profile?.occupation}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 sm:text-base text-xs">
                  <span>Website @ </span>
                  <a
                    target="_blank"
                    href={`https://${profile?.website}`}
                    className="text-blue-500 hover:underline"
                  >
                    {profile?.website}
                  </a>
                  | {profile?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* edit button */}
        <div className="sm:mt-4 mt-2 flex gap-4 flex-grow">
          {checkFollowed ? (
            <button
              ref={bottomSheetRef}
              onClick={() => setIsBottomSheetOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-1 active:scale-95 border border-green-500 rounded-md text-base sm:text-lg font-semibold bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
              <ChevronDown className={`w-5 h-5 ${isBottomSheetOpen ? 'rotate-180' : 'rotate-0'} transition-transform`} />
              Following
            </button>
          ) : (
            <button
              onClick={handleClick}
              className=" flex-1 flex justify-center items-center px-4 py-1 border rounded-md text-base sm:text-lg font-semibold bg-gray-100 hover:bg-gray-300 dark:bg-gray-800 active:scale-95"
            >
              {loading ? <Loader2Icon className="animate-spin" /> : "Follow"}
            </button>
          )}

          {
            reviewId?.reviewedId === id ?
              <div
                // onClick={}
                className="flex-1 flex justify-center items-center gap-2 px-4 py-1 border rounded-md text-base sm:text-lg font-semibold bg-gray-100 dark:bg-gray-800 "
              > Rated {reviewId?.totalStars} <Star className="text-[#FFAA00] fill-[#FFAA00] w-5 h-5" /> </div>
              :
              <button
                onClick={() => setIsRateBottomSheetOpen(true)}
                className="flex-1 flex justify-center items-center gap-2 px-4 py-1 border rounded-md text-base sm:text-lg font-semibold bg-gray-100 hover:bg-gray-300 dark:bg-gray-800 active:scale-95"
              >
                <Star className="text-[#FFAA00] w-5 h-5" /> {/* Bright and saturated gold */}
                Rate us
              </button>
          }

        </div>

        {/* rating display */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md mt-3">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setReviewPopup(true)}
              className="text-4xl font-bold text-gray-900 cursor-pointer"
            >
              {profile?.totalReviews == 0 ? 0 : (profile?.totalStars / profile?.totalReviews).toFixed(1)}
            </div>
            <div>
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${profile?.totalReviews === 0
                      ? 'text-gray-300'
                      : star <= profile?.totalStars / profile?.totalReviews
                        ? 'text-yellow-500 fill-yellow-500'
                        : star - profile?.totalStars / profile?.totalReviews <= 0.5
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {profile?.totalReviews} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Review Popup */}
        {
          ReviewPopup && (
            <ReviewPopupCard id={id}/>
          )
        }

        {
          ReviewPopup && (
            <div
              onClick={() => setReviewPopup(false)}
              className='fixed w-screen h-screen bg-[#0000005b] top-0 left-0 z-40'>
            </div>
          )
        }

        {isBottomSheetOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div ref={bottomSheetRef} className="w-full bg-white rounded-t-lg p-4">

              <div className="flex justify-center mb-2">
                <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
              </div>

              <h2 className="text-center text-lg font-semibold text-gray-800 mb-4">
                {profile?.fullName}
              </h2>

              <button
                className="block w-full text-left px-4 py-2 text-gray-800 font-semibold cursor-not-allowed"
                disabled
              >
                Following
              </button>
              <button
                onClick={handleUnfollow}
                className="block w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-gray-100"
              >
                Unfollow
              </button>
              <button
                onClick={() => setIsBottomSheetOpen(false)}
                className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {
          isRateBottomSheetOpen
          &&
          <ProfileRating
            setIsRateBottomSheetOpen={setIsRateBottomSheetOpen}
            sellerId={id}
            setProfile={setProfile}
          />
        }

        {/* Video Card Section */}
        {
          profile?.role === 'seller' && (
            <div className="mt-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ">
                <div className="relative w-full h-[9.5rem] sm:h-60 md:h-72 lg:h-80 overflow-hidden rounded-lg">
                  <video
                    src={`${profile?.smallvideo}`}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )
        }
        {
          popup && (
            <div
              onClick={() => setPopup(false)}
              className='fixed w-screen h-screen inset-0 bg-[#0000005b] top-0 z-40'>
            </div>
          )
        }

        {
          popup && (
            <div
              className={`fixed w-[75vw] max-w-md max-h-[80vh] transition-all duration-300 ease-in-out rounded-lg z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 shadow-lg
      ${popup ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
      `}
            >
              {/* Close Button */}
              <img src={profile?.profilePicture} className="w-full object-cover h-full rounded-lg" alt="" />
            </div>
          )
        }





      </div>
      {Seller ? <SellerPostGrid posts={Seller} /> : null}
    </>
  );
}