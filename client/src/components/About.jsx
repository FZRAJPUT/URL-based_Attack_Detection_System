import React from "react";
import { FaCode, FaShieldAlt, FaUser } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-100 via-slate-50 to-white flex flex-col items-center justify-between">
      
      {/* Main Content */}
      <div className="w-full flex items-center justify-center h-[90vh]">
      <div className="flex flex-col items-center px-6 py-16 w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full text-center">
          <FaShieldAlt className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
            About AttackDetector
          </h1>
          <p className="text-gray-700 text-sm sm:text-base mb-6">
            <span className="font-semibold">AttackDetector</span> is a web-based tool designed to protect your projects 
            from common URL-based attacks like SQL Injection, XSS, Command Injection, 
            and more. It helps developers easily integrate security measures into their web forms 
            and monitor suspicious activity in real-time.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-800 flex items-center justify-center gap-2">
            <FaUser /> About Me
          </h2>
          <p className="text-gray-700 text-sm sm:text-base mb-4">
            Hello! I am <span className="font-semibold">Subhas Kumar</span>, a final-year B.Tech CSE student. 
            I love solving problems with coding and building practical projects that make a real difference.
          </p>

          <div className="flex items-center justify-center space-x-2 text-indigo-500">
            <FaCode className="w-5 h-5" />
            <span className="text-gray-600 text-sm sm:text-base">I build projects to solve real-world problems</span>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 w-full mt-auto">
        <div className="max-w-3xl mx-auto text-center text-gray-600 text-sm px-4">
          &copy; 2025 AttackDetector • Created with ❤️ by Subhash Kumar
        </div>
      </footer>
    </div>
  );
};

export default About;
