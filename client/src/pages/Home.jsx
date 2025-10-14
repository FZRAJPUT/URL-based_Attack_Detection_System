import React from "react";
import { FaShieldAlt, FaChartLine, FaTerminal } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-[80vh] bg-gradient-to-b from-slate-100 via-slate-50 to-white text-white flex flex-col">
      <header className="flex mt-5 flex-col items-center justify-center flex-grow text-center px-6 py-20">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Detect URL-Based Attacks Instantly
        </h2>
        <p className="text-gray-400 max-w-2xl mb-8">
          Monitor, analyze, and visualize suspicious attacks on your websites with AttackDetector.
        </p>
        <Link to={"/docs"} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full text-white font-medium shadow-md transition">
          Go to Documentation
        </Link>
      </header>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-slate-50">
        <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-900 p-6 rounded-2xl shadow hover:shadow-indigo-500/20 transition">
            <FaChartLine className="w-10 h-10 text-indigo-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Real-time Detection</h4>
            <p className="text-gray-400">
              Instantly spot malicious patterns in URL requests and prevent cyber attacks.
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl shadow hover:shadow-indigo-500/20 transition">
            <FaTerminal className="w-10 h-10 text-indigo-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Comprehensive Analysis</h4>
            <p className="text-gray-400">
              Gain insights into detected threats with detailed logs and visual analytics.
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl shadow hover:shadow-indigo-500/20 transition">
            <FaShieldAlt className="w-10 h-10 text-indigo-400 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Secure Infrastructure</h4>
            <p className="text-gray-400">
              Built with Node.js, MongoDB, and React for reliable and scalable protection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 ">
        © {new Date().getFullYear()} URL Attack Detection System — All Rights Reserved.
      </footer>
    </div>
  );
};

export default Home;
