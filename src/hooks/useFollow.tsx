import { useEffect, useState } from "react";
import api from "../services/api/axiosConfig";
import useUserFollow from "./useUserFollow";
import { useDispatch } from "react-redux";
import { setUserFollow } from "../store/slices/userFollowSlice";
// import toast from "react-hot-toast";

const useFollow = ({ id }: { id: string | undefined }) => {
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const dispatch= useDispatch();

  const getFollowData = async (id:undefined | string) => {
    console.log('id- ',id);
    try {
      setFollowLoading(true);
      const result1 = api.get(`/follow/getFollowed?id=${id}`);
      const result2 = api.get(`follow/getAllFollower?id=${id}`);
      const [response1, response2] = await Promise.all([result1, result2])

      const { following } = response1.data
      const { followers } = response2.data  
      setFollowing(following);
      setFollowers(followers);

      setFollowError(false);
    } catch (err: any) {
      console.error("Error fetching follow data:", err);
      setFollowError(true);
    } finally {
      setFollowLoading(false);
    }
  };


  const createFollower = async (id: string | undefined) => {
    
    try {
      await api.post(
        `/follow/createFollower?id=${id}`
      );
      getFollowData(id)

    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message || "Error in following")
    }
  }

  const removeFollower = async (id: string | undefined) => {
    try {
      await api.delete(
        `follow/unfollow?id=${id}`
      );

      getFollowData(id);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    // const controller = new AbortController();
    // const signal = controller.signal;

    getFollowData(id);

    // return () => {
    //     controller.abort(); // Clean up API request on unmount
    // };

  }, []);

  return {
    followError,
    followLoading,
    following,
    followers,
    createFollower,
    removeFollower,
    getFollowData
  };
};

export default useFollow;