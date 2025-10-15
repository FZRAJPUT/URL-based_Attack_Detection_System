import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // allow only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_MY_API}/user/verify`, {
        otp: enteredOtp,
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP verified successfully!");
        navigate("/login"); // navigate to login/dashboard
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-200 px-4">
      <div className="relative bg-slate-100 p-8 rounded-3xl shadow-lg w-full max-w-md text-center">
        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200/70 rounded-3xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-indigo-400 mb-2">OTP Verification</h2>
        <p className="text-gray-400 mb-6">
          Enter the 6-digit code sent to {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                className="w-12 h-12 text-center text-xl rounded-xl bg-slate-200 border border-gray-100 focus:border-indigo-400 focus:outline-none"
                disabled={loading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            } transition text-white py-3 rounded-xl font-semibold shadow-md`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-gray-500 mt-4 text-sm">
          Didn't receive the code?{" "}
          <button
            className="text-indigo-400 hover:underline"
            onClick={() => toast("OTP resend feature coming soon!")}
            disabled={loading}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;
