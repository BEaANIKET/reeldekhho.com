
import { useState } from "react";
import axios from "axios";
import api from "../services/api/axiosConfig";
import { useNavigate } from "react-router-dom";
import leftarrow from '/assets/arrow.svg'
import logo from '/assets/vite.svg';


export default function PasswordReset() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [message, setMessage] = useState("");

    // Function to send OTP
    const handleSendOtp = async () => {
        setLoading(true);
        setMessage("");

        try {
            const res = await api.post("/auth/sendOtp", { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Function to verify OTP
    const handleVerifyOtp = async () => {
        setLoading2(true);
        setMessage("");

        try {
            const res = await api.post("/auth/verifyOtp", { email, otp });
            setResetToken(res.data.resetToken);
            setMessage("OTP verified. Please reset your password.");
            setStep(3);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading2(false);
        }
    };

    // Function to reset password
    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await api.post("/auth/resetPassword", { email, resetToken, password });
            setMessage("Password reset successfully. You can now log in.");
            setStep(4);
        } catch (error: any) {
            setMessage(error.response?.data?.message || "Password reset failed");
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate()

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">

            <div onClick={() => navigate(-1)} className=' absolute flex flex-col  items-center gap-1 underline text-blue-600 top-2 left-3  dark:text-white '>
                {/* <Link className=' ml-5 mb-[-50px] ' to={'/'}> Home </Link> */}
                <img className=' h-10 w-20 overflow-hidden ' src={leftarrow} alt="" />
            </div>
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <div className=" flex w-full justify-center">
                    <img src={logo} alt='logo' className='h-20 overflow-hidden overflow-hidden w-20 object-cover' />
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

                {message && <p className="text-red-500 text-center">{message}</p>}

                {step === 1 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium">Enter Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
                            onClick={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
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
                            disabled={loading2}
                        >
                            {loading2 ? "Verifying OTP..." : "Verify OTP"}
                        </button>
                        <button
                            className="w-full bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700"
                            onClick={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Resend OTP"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <label className="block mb-2 text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="block mt-4 mb-2 text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            className="w-full bg-purple-600 text-white py-2 mt-4 rounded hover:bg-purple-700"
                            onClick={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? "Resetting Password..." : "Reset Password"}
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-green-600">Password Reset Successful!</h2>
                        <p className="text-sm text-gray-600 mt-2">You can now login with your new password.</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <a onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Go to Login
                            </a>
                            <a onClick={(() => navigate('/login'))} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                                Go to Home
                            </a>
                        </div>
                    </div>
                )}
                {
                    step !== 4 && (
                        <div className=" mt-3 text-end w-full ">
                            <a onClick={(() => navigate('/login'))} className=" w-full text-center text-blue-900 px-4 py-2 underline rounded ">
                                login
                            </a>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
