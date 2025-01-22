import { useState } from "react"
import api from "../../services/api/axiosConfig";


const useAddPost = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addPost = async (postData) => {
        try {
            setLoading(true);
            const response = await api.post('/post/add', postData);
            return response.data.post;
        } catch (error) {
            console.error('Error adding post:', error);
            setError(error?.response?.data?.message || 'Something went wrong');
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { addPost, loading, error }
}

export default useAddPost;