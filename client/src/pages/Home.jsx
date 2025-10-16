import React from "react";
import { FaShieldAlt, FaChartLine, FaTerminal } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      {/* Header Section */}
      <header className="flex flex-col items-center justify-center flex-grow text-center px-6 py-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-indigo-600">
          Detect Input-Based Attacks Instantly
        </h2>
        <p className="text-slate-600 max-w-2xl mb-6">
          Monitor, analyze, and visualize suspicious activities on your website with{" "}
          <span className="font-semibold text-indigo-500">InputShield</span>.
        </p>
        <p className="text-slate-600 max-w-3xl mb-8">
          <span className="font-medium">InputShield</span> is a web-based security tool that
          prevents <span className="text-indigo-500">SQL Injection</span>,{" "}
          <span className="text-indigo-500">XSS</span>, and other input-based attacks.
          It includes sanitization mechanisms and a real-time dashboard for monitoring threats.
        </p>
        <Link
          to="/docs"
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium transition"
        >
          Go to Documentation
        </Link>
      </header>

      {/* Features Section */}
      <section id="features" className="py-12 bg-slate-50">
        <h3 className="text-3xl font-bold text-center text-slate-800 mb-10">
          Key Features
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FaChartLine className="w-10 h-10 text-indigo-500 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Real-time Detection</h4>
            <p className="text-slate-600 text-sm">
              Instantly spot and block malicious patterns in incoming requests.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FaTerminal className="w-10 h-10 text-indigo-500 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Comprehensive Analysis</h4>
            <p className="text-slate-600 text-sm">
              View detailed threat logs and analytics to understand your website’s security posture.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <FaShieldAlt className="w-10 h-10 text-indigo-500 mb-4" />
            <h4 className="text-lg font-semibold mb-2">Secure Infrastructure</h4>
            <p className="text-slate-600 text-sm">
              Powered by Node.js, MongoDB, and React for strong, scalable protection.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} InputShield • Built with ❤️ by <a href="https://subhash-porfolio.vercel.app" target="blank_">Subhash Kumar</a>
      </footer>
    </div>
  );
};

export default Home;
