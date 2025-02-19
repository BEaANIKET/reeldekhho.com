import { useEffect, useState } from 'react';
import api from '../../services/api/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../../store/slices/postSlices';
const useGetPosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let excludeIds = []
    const [isMore, setIsMore] = useState(true)
    const posts = useSelector(state => state?.post?.posts)
    const dispatch = useDispatch()

    const fetchPosts = async () => {
        setLoading(true);
        try {
            dispatch(setPost({ type: 'SET_POST', payload: [] }))
            const city = (localStorage.getItem('city') || "").trim();
            excludeIds = posts.map(post => post._id).join(',');
            const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${city}`);
            dispatch(setPost({ type: 'SET_POST', payload: response?.data?.posts }))
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };


    const loadMorePosts = async () => {
        if (!isMore) {
            return
        }
        try {
            const city = (localStorage.getItem('city') || "").trim();
            excludeIds = posts.map(post => post._id).join(',');
            const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${city}`);
            //("load more", response?.data)
            // setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
            dispatch(setPost({ type: 'ADD_POST', payload: response?.data?.posts }))
            setIsMore(response?.data?.posts?.length > 0)
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    return { loading, error, posts, loadMorePosts, fetchPosts };
};

export default useGetPosts;