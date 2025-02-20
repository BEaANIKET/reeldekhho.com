import { Link, UNSAFE_NavigationContext } from 'react-router-dom'
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '/assets/vite.svg';
import useAuth from '../hooks/useAuth';
import leftarrow from '/assets/arrow.svg'
import api from '../services/api/axiosConfig';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        otp: '14434',
    });
    const navigation = useNavigate();
    const { register, loading, error } = useAuth()
    const [loader, setLoader] = useState(false)
    const [openOtpPopup, setOpenPopup] = useState(false)
    const [otp, setOtp] = useState('')
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(
            (prev) => {
                return {
                    ...prev,
                    [name]: value
                }
            }
        );
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoader(true)
        const success = await register(
            formData.full_name,
            formData.email,
            formData.password
        )

        if (success) {
            setOpenPopup(true)
            // navigation('/login')
        } else {
            // //(error);
        }

        setLoader(false)

    }

    const handleGoogleClick = async () => {
        try {
            const redirectUri = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
            // //(redirectUri);

            window.location.href = redirectUri;
        } catch (error) {
            // //(error);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading3(true);
        setMessage("");

        try {
            const res = await api.post("/auth/verifyOtp", { email: formData?.email, otp });
            const res2 = await api.post('/auth/setVerifyTrue', { email: formData?.email });
            navigate('/login')
        } catch (error: any) {
            setMessage(error.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading3(false);
        }
    };

    const handleSendOtp = async () => {
        setLoading2(true);
        setMessage("");

        try {
            const res = await api.post("/auth/sendOtp", { email: formData?.email });
            setMessage(res.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading2(false);
        }
    };

    return (

        <div className="px-4 py-12 flex justify-center items-center h-screen ">

            {
                !openOtpPopup ? (
                    <>
                        <div onClick={() => navigation('/')} className=' absolute flex flex-col  items-center gap-1 underline text-blue-600 top-2 left-3  dark:text-white '>
                            {/* <Link className=' ml-5 mb-[-50px] ' to={'/'}> Home </Link> */}
                            <img className=' h-10 w-20 overflow-hidden ' src={leftarrow} alt="" />
                        </div>
                        <div className="flex flex-col gap-4 justify-center p-8 rounded-xl">

                            <div className="flex flex-col items-center">
                                <img src={logo} alt='logo' className='h-20 w-20 overflow-hidden object-cover' />
                                <h2 className="md:text-3xl text-2xl font-bold text-black text-center md:w-[600px]">
                                    Create an Account
                                </h2>

                                <p className="text-base lg:w-full w-[90%] text-[#71717a] text-center">
                                    Enter your detail below to create new account
                                </p>
                            </div>

                            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name='full_name'
                                    placeholder='Full Name'
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className='rounded-md p-2 outline-none border border-gray-300 focus:border-indigo-500'
                                />

                                <input
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='rounded-md p-2 outline-none border border-gray-300 focus:border-indigo-500'
                                />

                                <input
                                    type="password"
                                    name='password'
                                    placeholder='Password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='rounded-md p-2 outline-none border border-gray-300 focus:border-indigo-500'
                                />

                                <div className=' text-red-600 text-center'> {error ? error : ''} </div>
                                <div className='flex flex-col gap-2'>
                                    {
                                        false ? (
                                            <button
                                                type="submit"
                                                className={`p-2 rounded-md bg-slate-900 text-white font-semibold active:scale-95`
                                                }
                                                disabled={loading}
                                            >
                                                Send OTP
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className={`p-2 rounded-md bg-slate-900 text-white font-semibold active:scale-95`
                                                }
                                                disabled={loading}
                                            >
                                                {loader ? 'Loading..' : 'sign-up'}
                                            </button>
                                        )
                                    }
                                </div>
                            </form>

                            <div className="flex items-center justify-center gap-2">
                                <div className="w-[20%] h-px bg-[#71717ab9]"></div>
                                <span className="text-xs text-[#71717a] capitalize">or continue with socials</span>
                                <div className="w-[20%] h-px bg-[#71717a]"></div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    className="p-1 rounded-md active:scale-95 border shadow-sm font-semibold"
                                    onClick={handleGoogleClick}
                                >
                                    Google
                                </button>

                                <p className="text-sm self-center">
                                    Already have an account?
                                    <Link to={'/login'} className="text-blue-600 cursor-pointer font-semibold"> log In</Link>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <div onClick={() => navigation(-1)} className=' absolute flex flex-col  items-center gap-1 underline text-blue-600 top-2 left-3  dark:text-white '>
                            {/* <Link className=' ml-5 mb-[-50px] ' to={'/'}> Home </Link> */}
                            <img className=' h-10 w-20 ' src={leftarrow} alt="" />
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={logo} alt='logo' className='h-20 overflow-hidden overflow-hidden w-20 object-cover' />
                            <p className="text-base  text-black text-center">
                                Enter Otp here to verify
                            </p>

                            <p className="text-base lg:w-full w-[90%] text-[#71717a] text-center">
                                Check your email
                            </p>
                        </div>
                        <label className="block mb-2 text-sm font-medium">Enter OTP</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
                            onClick={handleVerifyOtp}
                            disabled={loading3}
                        >
                            {loading3 ? "Verifying OTP..." : "Verify OTP"}
                        </button>
                        <button
                            className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
                            onClick={handleSendOtp}
                            disabled={loading2}
                        >
                            {loading2 ? "Sending OTP..." : "Resend OTP"}
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export default SignupPage;