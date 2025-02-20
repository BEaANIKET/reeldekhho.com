import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api/axiosConfig";
import toast from "react-hot-toast";

const ChangePassword: React.FC = () => {
    const [step, setStep] = useState<"password" | "otp">("password");
    const [oldPassword, setOldPassword] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    // Timer for OTP resend
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Send Email API
    const sendMail = async () => {
        if (!email) return setError("Please enter your email.");
        setIsLoading(true);
        setError("");
        try {
            await axios.post("/api/mail", { email });
            setOtpSent(true);
            setTimer(30); // Start 30s timer
        } catch {
            setError("Failed to send email.");
        } finally {
            setIsLoading(false);
        }
    };

    // Verify OTP API
    const verifyOtp = async () => {
        if (!otp) return setError("Enter the OTP sent to your email.");
        setIsLoading(true);
        setError("");
        try {
            await axios.post("/api/verify", { email, otp });
            alert("OTP Verified! You can now reset your password.");
            setStep("password");
        } catch {
            setError("Invalid OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    // Change Password API
    const changePassword = async () => {
        if (!oldPassword || !newPassword) return setError("All fields are required.");
        setIsLoading(true);
        setError("");
        try {
            const response = await api.post("/auth/changepass", { oldPassword, newPassword });
            //(response.data);

            toast.success("Password changed successfully.");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            setError(error?.response?.data?.message || error.message);
        } finally {
            setOldPassword('')
            setNewPassword('');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            {/* Logo */}
            <img src="/logo.png" alt="Logo" className="w-16 overflow-hidden h-16 mb-4" />

            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold text-center mb-4">
                    {step === "password" ? "Change Password" : "Verify OTP"}
                </h2>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                {step === "password" ? (
                    <>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                        />
                        <button
                            onClick={changePassword}
                            disabled={isLoading}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isLoading ? "Changing..." : "Change Password"}
                        </button>

                        <p
                            className="text-sm text-blue-500 mt-2 text-center cursor-pointer"
                            onClick={() => setStep("otp")}
                        >
                            Choose another way (Verify via OTP)
                        </p>
                    </>
                ) : (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mb-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                        />
                        <button
                            onClick={sendMail}
                            disabled={isLoading || timer > 0}
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            {isLoading ? "Sending..." : timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
                        </button>

                        {otpSent && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 mt-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                                />
                                <button
                                    onClick={verifyOtp}
                                    disabled={isLoading}
                                    className="w-full bg-blue-500 text-white py-2 mt-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {isLoading ? "Verifying..." : "Verify OTP"}
                                </button>
                            </>
                        )}

                        <p
                            className="text-sm text-gray-500 mt-2 text-center cursor-pointer"
                            onClick={() => setStep("password")}
                        >
                            Back to password change
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
