import { useEffect, useState } from "react"
import api from "../../services/api/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../store/slices/authSlice";


const useGetProfile = () => {

    const [loading, setLoadin] = useState(false)
    const [error, setError] = useState(null)
    const user = useSelector((state) => state?.auth?.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoadin(true)
            try {
                const response = await api.get('/auth/profile');
                dispatch(setUserProfile(response.data.user))
            } catch (error) {
                setError(error?.response?.data?.message || 'Something went wronge')
                console.error('Error fetching profile:', error);
            } finally {
                setLoadin(false)
            }
        }

        if (!user) {
            fetchProfile();
        }
    }, [])

    return { loading, error }
}

export default useGetProfile