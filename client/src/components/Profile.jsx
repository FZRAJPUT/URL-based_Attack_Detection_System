import axios from "axios";
import { useState, useEffect } from "react";
import { FaUserCircle, FaEnvelope } from "react-icons/fa";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_MY_API + "/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserDetails(res.data.user);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-white">
        <p className="text-gray-400 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-white">
        <p className="text-gray-400">No user data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-200 via-slate-100 to-slate-50 text-black flex flex-col items-center justify-center px-4">
      <div className="bg-slate-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-indigo-400 w-20 h-20 mb-3" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {userDetails.username || "User"}
          </h2>
          <p className="text-gray-400 mt-1 text-sm">Welcome to AttackDetector</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-slate-200/50 p-4 rounded-xl">
            <FaUserCircle className="text-indigo-400 w-5 h-5" />
            <div>
              <p className="text-gray-800 text-sm">Username</p>
              <p className="text-black font-medium">{userDetails.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-200/50 p-4 rounded-xl">
            <FaEnvelope className="text-indigo-400 w-5 h-5" />
            <div>
              <p className="text-gray-800 text-sm">Email</p>
              <p className="text-black font-medium">{userDetails.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="px-5 py-2 cursor-pointer bg-red-500 hover:bg-red-600 rounded-full text-white font-medium shadow-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
