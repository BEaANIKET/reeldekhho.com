
import api from "../../services/api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { removePost, setSavedPosts, updateSavedPost } from "../../store/slices/savedPost";
import { AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";

const useSavedPost = () => {

    const savedPosts = useSelector((state) => state?.savedPosts?.saved_Posts)
    const [savedLoading, setSavedLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(state => state?.auth?.user);

    const addSavedPost = async (id: string) => {
        try {
            const response = await api.post('/post/addSaved?postId=' + id);
            dispatch(updateSavedPost(response.data.savedPost))
        } catch (error) {
            // console.error(error?.response?.data?.error);
        }
    };

    const getSavedPosts = async () => {
        try {
            setSavedLoading(true);
            const response = await api.get('/post/getsaved');
            dispatch(setSavedPosts(response.data.savedPosts))
        } catch (error) {
            // console.error(error?.response?.data?.error || error);
        } finally {
            setSavedLoading(false)
        }
    };


    const removeSavedPost = async (id: string) => {
        try {
            // //(id);
            const response = await api.delete(`/post/deletesaved?id=${id}`, { data: { postId: id } });
            // //(response.data);

            const value = {
                _id: id
            }

            dispatch(removePost(value))
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user && savedPosts.length === 0) {
            //('saved effect ran');

            getSavedPosts();
        }
    }, [user])

    return {
        addSavedPost,
        getSavedPosts,
        removeSavedPost,
        savedLoading,
    };
};

export default useSavedPost;
