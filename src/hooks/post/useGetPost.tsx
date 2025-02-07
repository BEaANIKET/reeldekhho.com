import { useEffect, useState } from 'react';
import api from '../../services/api/axiosConfig';
const useGetPosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let excludeIds = []
    const [posts, setPosts] = useState([]);
    const [isMore, setIsMore] = useState(true)

    const fetchPosts = async () => {
        setLoading(true);
        console.log(" Fetching posts...");
        try {
            const city = (localStorage.getItem('city') || "").trim();
            excludeIds = posts.map(post => post._id).join(',');
            console.log('excludeIds',excludeIds);
            const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${city}`);
            setPosts(response?.data?.posts)
            console.log(response?.data);

        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const loadMorePosts = async () => {
        if (!isMore) {
            return
        }
        try {
            const city = (localStorage.getItem('city') || "").trim();
            excludeIds = posts.map(post => post._id).join(',');
            const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${city}`);
            console.log("load more", response?.data)
            setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
            setIsMore(response?.data?.posts?.length > 0)
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    return { loading, error, posts, loadMorePosts, fetchPosts };
};

export default useGetPosts;