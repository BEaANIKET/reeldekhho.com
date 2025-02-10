import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../services/api/axiosConfig";
import { setUserFollow } from "../store/slices/userFollowSlice";

const useUserFollow = () => {
    const [userLoading, setUserLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getUserFollows();
    }, []);

    const getUserFollows = async () => {
        try {
            const request1 = api.get(`/follow/getFollowed?`);
            const request2 = api.get(`follow/getAllFollower`);
            const [response1, response2] = await Promise.all([request1, request2]);

            const { following } = response1.data
            const { followers } = response2.data

            dispatch(setUserFollow({ followers, following }))
        } catch (error) {
            //("Error getting follow data:- ",error);
        } finally {
            setUserLoading(false);
        }
    }
    return {
        userLoading
    };
}

export default useUserFollow;