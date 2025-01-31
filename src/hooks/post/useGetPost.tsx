import { useEffect, useState } from 'react';
import api from '../../services/api/axiosConfig';
const useGetPosts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let excludeIds = []
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                excludeIds = posts.map(post => post._id).join(',');
                const response = await api.get(`/post/get?excludeIds=${excludeIds}&city=${localStorage.getItem('city')}`);
                setPosts(response?.data?.posts)
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

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

    return { loading, error, posts, loadMorePosts };
};

export default useGetPosts;