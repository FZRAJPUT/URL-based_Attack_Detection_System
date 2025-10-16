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
    const value = e.target.value.replace(/\D/, ""); // only digits
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
        navigate("/login");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-indigo-100 to-indigo-200 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center">
        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-500 mb-2">
          OTP Verification
        </h2>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">
          Enter the 6-digit code sent to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                disabled={loading}
                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-14 text-center text-lg sm:text-xl font-medium rounded-xl bg-slate-100 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-150"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition text-white ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-gray-500 mt-5 text-sm sm:text-base">
          Didn’t receive the code?{" "}
          <button
            type="button"
            disabled={loading}
            onClick={() => toast("OTP resend feature coming soon!")}
            className="text-indigo-500 font-medium hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerify;
