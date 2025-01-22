import { useEffect, useState } from "react";
import api from "../services/api/axiosConfig";
import toast from "react-hot-toast";

const useFollow = () => {
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const getFollowData = async () => {
    try {
      setFollowLoading(true);
      const result1 = api.get(`/follow/getFollowed`);
      const result2 = api.get(`follow/getAllFollower`);
      const [response1, response2] = await Promise.all([result1, result2])
      // console.log("promise.all= ", response1, response2);

      const { following } = response1.data
      const { followers } = response2.data
      setFollowing(following);
      setFollowers(followers);
      setFollowError(false); // Reset error state on success
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

      getFollowData();

    } catch (error: any) {
      // console.log(error);
      alert(error.response.data.message || "Error in following")
    }
  }

  const removeFollower = async (id: string | undefined) => {
    try {
      await api.delete(
        `follow/unfollow?id=${id}`
      );

      getFollowData();

    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {

    // const controller = new AbortController();
    // const signal = controller.signal;

    getFollowData();

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
    removeFollower
  };
};

export default useFollow;