import { useState, useEffect } from 'react';
import api from '../../services/api/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../../store/slices/postSlices';

const useHandleLikes = (postId) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLiked = useSelector((state) =>
        state.post.likes.find((like) => like.id === postId)?.isLiked || false
    );
    const likeCount = useSelector((state) =>
        state.post.likes.find((like) => like.id === postId)?.likeCount || 0
    );

    const dispatch = useDispatch();

    useEffect(() => {
        if (!postId) return;

        const fetchLikes = async () => {
            setLoading(true);

            try {
                const response = await api.get(`/post/getlikes?postId=${postId}`);
                dispatch(
                    setPost({
                        type: 'SET_LIKE', payload: {
                            id: postId,
                            likeCount: response.data.likesCount,
                            isLiked: response.data.isCurrUserLiked,
                        }
                    })
                );

            } catch (err) {
                setError(err?.response?.data?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (!likeCount) {
            fetchLikes();
        }
    }, [postId, dispatch, likeCount]);

    const likePost = async () => {
        if (!postId) return;

        const updatedLikeCount = isLiked ? likeCount - 1 : likeCount + 1;

        try {
            dispatch(
                setPost({
                    type: 'SET_LIKE', payload: {
                        id: postId,
                        likeCount: updatedLikeCount,
                        isLiked: !isLiked,
                    }
                })
            );
            const response = await api.post(`/post/like?postId=${postId}`);
            // console.log(response);

        } catch (err) {
            // Revert the state if request fails
            dispatch(
                setPost({
                    type: 'SET_LIKE', payload: {
                        id: postId,
                        likeCount,
                        isLiked,
                    }
                })
            );
            setError('Failed to update like status');
        }
    };

    return { likeCount, loading, error, isLiked, likePost };
};

export default useHandleLikes;
