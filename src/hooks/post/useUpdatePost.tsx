import { useState } from 'react';
import api from '../../services/api/axiosConfig';

const useUpdatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updatePost = async (postId, updatedData) => {
        setLoading(true);
        try {
            const response = await api.put(`post/update?id=${postId}`, { data: updatedData }); // Replace with actual endpoint
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return { updatePost, loading, error };
};

export default useUpdatePost;
