import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api/axiosConfig";
import { Loader2Icon } from "lucide-react";
import { setUserProfile } from "../store/slices/authSlice";

const EditProfile: React.FC = () => {
  const user = useSelector((state: any) => state?.auth?.user);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [loader, setLoader] = useState<boolean>(false);
  const [profilePreview, setProfilePreview] = useState<string | undefined>(user?.profilePicture || "");
  const [profileFile, setProfileFile] = useState<File | undefined>(undefined)
  const [name, setName] = useState<string>(user?.fullName || "");
  const [occupation, setOccupation] = useState<string>(user?.occupation || "");
  const [website, setWebsite] = useState<string>(user?.website || "");
  const [address, setAddress] = useState<string>(user?.adderess || "");
  // const [video, setVideo] = useState<File | null>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProfileFile(file);
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  // const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) setVideo(file);
  // };

  const handleCancel = () => {
    setProfilePreview("");
    setName("");
    setOccupation("");
    setWebsite("");
    setAddress("");
    // setVideo(null);
    Navigate("/profile")
  };

  const handleSave = async () => {
    setLoader(true);

    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("occupation", occupation);
    formData.append("website", website);
    formData.append("address", address);

    if (profileFile) {
      formData.append("profilePicture", profileFile);
    } else {
      formData.append("profileUrl", user?.profilePicture || "");
    }

    try {
      // console.log(formData, "59 data");

      const response = await api.post("/auth/updateprofile", formData);
      // console.log(response);

      dispatch(setUserProfile(response.data.user))
      // Navigate to the profile page after success
      Navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoader(false);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Profile</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="profilePic" className="cursor-pointer">
            <img
              src={profilePreview || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </label>
          <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
          <p className="mt-2 text-sm text-gray-500">Edit picture</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-gray-600 mb-1">Occupation</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-gray-600 mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Video Upload */}
          {/* <div>
            <label className="block text-gray-600 mb-1">Upload Video</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md" />
            {video && <p className="mt-2 text-sm text-gray-500">Selected Video: {video.name}</p>}
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            {loader ? <Loader2Icon className="animate-spin text-white" /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
