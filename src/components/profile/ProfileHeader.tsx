import { MapPin, FilePlus } from "lucide-react";
import { useSelector } from "react-redux";
import useGetProfile from "../../hooks/profile/useGetProfile";
import { BsChat } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ProfileSkeloton } from "./ProfileSkeloton";
import { useEffect, useState } from "react";
import ShareFeature from "./ShareFeature";
import { Button, Modal, Image } from 'antd';

export default function ProfileHeader(props: any) {
  const totalposts = props.value;
  const { loading, error } = useGetProfile();

  const Navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const user = useSelector((state: any) => state?.auth?.user);
  const userFollow = useSelector((state: any) => state.userFollow)
  //(userFollow);

  const unseenMsg = useSelector(state => state?.chat?.unSeenCount);
  const [unSeenMsgCount, setUnSeenMsgCount] = useState(0)
  const [popup, setPopup] = useState(false)
  // const 

  useEffect(() => {
    //(unseenMsg);
    const totalUnseen = Object.values(unseenMsg).reduce((sum, count) => sum + count, 0);
    //(totalUnseen);
    setUnSeenMsgCount(totalUnseen)

  }, [unseenMsg])
  const navigate = useNavigate()

  const handleShare = () => {
    setIsShareOpen(true)
  };


  // if (true) {
  //   return < ProfileSkeloton />
  // }

  if (error) {
    return (
      <>
        <div className=" w-full text-center text-red-500">
          Sometching went wronge
        </div>
      </>
    );
  }


  const iconClick = async (e: any) => {
    Navigate(e);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-2">
      <div className="max-w-screen-lg mx-auto mt-2 sm:mt-5 md:mt-10 px-4">
        {/* Profile Section */}
        <div className="flex flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
              <Image
                src={user?.profilePicture}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "50%",
                }}
                alt="Profile Picture"
              />
            </div>

          </div>

          {/* User Info Section */}
          <div className="flex-grow">
            {/* Username and Follow Button */}
            <div className="flex items-center  justify-start gap-4 ">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {user?.fullName}
              </h1>
              <div className="flex relative gap-4">
                <BsChat
                  onClick={() => iconClick("/messages")}
                  className="w-6 h-6 text-gray-500 cursor-pointer"
                />
                {unSeenMsgCount ? (
                  <p className=" absolute top-[-13px] left-[-6px] font-bold text-md flex items-center justify-center p-2 text-white bg-red-500 h-5 w-5 rounded-full "> {unSeenMsgCount} </p>

                ) : (
                  null
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex gap-2">
              <div className="flex space-x-2 sm:space-x-4 md:space-x-8 mt-4">
                <div>
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                    {totalposts}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    posts
                  </span>
                </div>
                <div className="cursor-pointer" onClick={() => navigate(`/followers/${user._id}`)}>
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                    {userFollow?.follower.length || 0}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    followers
                  </span>
                </div>
                <div className=" cursor-pointer" onClick={() => navigate(`/following/${user._id}`)}>
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                    {userFollow?.following.length || 0}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    following
                  </span>
                </div>
              </div>
            </div>

            {/* Full Name and Bio Section */}
            <div className="sm:mt-4 mt-1 bg-gray-300 p-2 rounded-md">
              <h2 className="sm:text-lg text-xs capitalize font-semibold text-gray-800 dark:text-gray-200">
                {user?.occupation}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 sm:text-base text-xs">
                <span>Website @ </span>
                <a href="#" className="text-blue-500 hover:underline">
                  {user?.website}
                </a>{" "}
                | {user?.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* edit button */}
      <div className="sm:mt-4 mt-2 flex gap-4 flex-grow">
        <button
          onClick={() => Navigate("/editProfile")}
          className=" cursor-pointer flex-1 px-4 py-1 border rounded-md text-base sm:text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Edit Profile
        </button>
        <button
          onClick={handleShare}
          className="flex-1 px-4 py-1 border rounded-md text-base sm:text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
        >
          Share Profile
        </button>
      </div>

      <ShareFeature
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        profileId={user?._id}
      />

      {/* Video Card Section */}

      {
        user?.role === 'seller' && (
          <div className="mt-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="relative w-full h-[9.5rem] sm:h-60 md:h-72 lg:h-80 overflow-hidden rounded-lg">
                <video
                  src={`${user?.smallvideo}`}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )
      }

    </div>
  );
}
