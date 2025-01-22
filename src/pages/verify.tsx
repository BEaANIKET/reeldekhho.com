import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../store/slices/authSlice";


const Verify = () => {
    const { token } = useParams();
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetching = async () => {
            const baseurl = import.meta.env.VITE_BACKEND_URL;
            try {
                const response = await axios.get(`${baseurl}/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // console.log('response:', response.data);
                localStorage.clear()
                localStorage.setItem('token', token)
                dispatch(setUserProfile(response?.data?.user))

                navigate('/');
            } catch (err) {
                // console.error('Error:', err);
                setError(err?.response?.data?.message || err.message || 'Some error occurred');
            }
        }

        fetching();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {
                token ?
                    <div>
                        {error ? <p className="text-3xl font-bold text-red-600">
                            {error}
                        </p> : <p className="text-3xl font-bold text-green-600">
                            Verify...
                        </p>}
                    </div>
                    :
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-red-500">404</h1>
                        <p className="text-2xl">Page Not Found</p>
                        <a href="/" className="mt-4 text-blue-500">Go back to Home</a>
                    </div>
            }
        </div>
    );
}

export default Verify;