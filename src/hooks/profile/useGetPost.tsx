import { useEffect, useState } from "react"
import api from "../../services/api/axiosConfig"
import { useDispatch, useSelector } from "react-redux"
import { setUserPost } from "../../store/slices/authSlice"

const useGetPost = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const dispatch = useDispatch()
    const posts = useSelector((state) => state.auth.posts)

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true)
            try {
                const response = await api.get('/auth/post')
                // console.log(response.data.posts);
                dispatch(setUserPost(response.data.posts))
            } catch (error) {
                setError(error?.response?.data?.message || 'Something went wrong')
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }

        if (!posts) {
            fetchPost()
        }

    }, [])


    return { loading, error }
}

export default useGetPost