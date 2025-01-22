
import { useState, useEffect } from 'react';
import api from '../../services/api/axiosConfig';

const useHandleReelsLikes = (postId) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)


    useEffect(() => {
        const fetchLikes = async () => {
            if (!postId) return;
            // console.log("I am run ");

            setLoading(true);
            try {
                const response = await api.get(`/post/getlikes?postId=${postId}`);
                setLikeCount(response.data.likesCount)
                setIsLiked(response.data.isCurrUserLiked)
                // console.log(response.data);

            } catch (err) {
                setError(err?.response?.data?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (!likeCount) {
            fetchLikes()
        }
        setLoading(false)
    }, [postId]);

    const likePost = async () => {
        if (!postId) return;
        // console.log("I am run ");

        try {
            const updatedLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
            setLikeCount(updatedLikeCount)
            setIsLiked(!isLiked)
            await api.post(`/post/like?postId=${postId}`);
        } catch (err) {
            setError('Failed to update like status');
        }
    };

    return { likeCount, loading, error, isLiked, likePost };
};

export default useHandleReelsLikes;
