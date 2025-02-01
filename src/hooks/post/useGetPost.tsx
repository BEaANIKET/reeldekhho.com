import { useEffect, useState } from 'react';
import api from '../../services/api/axiosConfig';
const useGetPosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let excludeIds = []
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        setLoading(true);
        console.log(" Fetching posts...");
        try {
            excludeIds = posts.map(post => post._id).join(',');
            const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${localStorage.getItem('city')}`);
            setPosts(response?.data?.posts)
            console.log(response?.data?.posts);

            console.log(" Fetching posts...");

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
        try {
            excludeIds = posts.map(post => post._id).join(',');
            const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${localStorage.getItem('city')}`);
            setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    return { loading, error, posts, loadMorePosts, fetchPosts };
};

export default useGetPosts;