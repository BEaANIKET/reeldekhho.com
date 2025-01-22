import { MapPin, FilePlus } from "lucide-react";
import { useSelector } from "react-redux";
import useGetProfile from "../../hooks/profile/useGetProfile";
import { BsChat } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { ProfileSkeloton } from "./ProfileSkeloton";
import { useState } from "react";
import ShareFeature from "./ShareFeature";

export default function ProfileHeader(props: any) {
  const totalposts = props.value;
  const following = props.following;
  const followers = props.followers;

  const { loading, error } = useGetProfile();

  const Navigate = useNavigate();

  const [video, setVideo] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const user = useSelector((state: any) => state?.auth?.user);

  const handleShare = () => {
    setIsShareOpen(true)
  };

  if (loading) {
    return <ProfileSkeloton />;
  }

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-screen-lg mx-auto mt-2 sm:mt-5 md:mt-10 px-4">
        {/* Profile Section */}
        <div className="flex flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[25%] overflow-hidden">
              <img
                src={user?.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="sm:hidden flex items-center justify-start gap-4 ">
              <h1 className="text font-semibold text-gray-800 dark:text-gray-200">
                {user?.fullName}
              </h1>
            </div> */}
          </div>

          {/* User Info Section */}
          <div className="flex-grow">
            {/* Username and Follow Button */}
            <div className="flex items-center  justify-start gap-4 ">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
                {user?.fullName}
              </h1>
              <div className="flex gap-4">
                <BsChat
                  onClick={() => iconClick("/messages")}
                  className="w-6 h-6 text-gray-500 cursor-pointer"
                />
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
                <div>
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                    {followers || 0}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">
                    followers
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-gray-800 dark:text-gray-200 text-center">
                    {following || 0}
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
          className=" flex-1 px-4 py-1 border rounded-md text-base sm:text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
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
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="relative w-full h-[9.5rem] sm:h-60 md:h-72 lg:h-80 overflow-hidden rounded-lg">
            {video ? (
              <video
                src={`${import.meta.env.VITE_ADMIN_URL}/public/Images/${props?.smallvideo}`}
                autoPlay
                loop
                muted
                controls
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                <div className="text-center">
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-2">
                    <FilePlus className="h-12 w-12" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                    Add Video
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
