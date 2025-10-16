import React from "react";
import { FaCode, FaShieldAlt, FaUser, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-between text-slate-800">
      <main className="flex flex-col items-center justify-center w-full flex-grow px-6 py-8">
        <div className="p-8 max-w-5xl w-full text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-800">
            About <span className="text-indigo-600">InputShield</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
            <span className="font-semibold text-slate-800">InputShield</span> is a full-stack web
            application built to help developers safeguard their web projects from input-based
            vulnerabilities such as <span className="text-indigo-500">SQL Injection</span>,{" "}
            <span className="text-indigo-500">Cross-Site Scripting (XSS)</span>, and{" "}
            <span className="text-indigo-500">Command Injection</span>.
            <br />
            <br />
            The system includes <span className="font-medium">InputShield</span>, a detection
            mechanism that analyzes incoming form data and URLs, identifies malicious patterns,
            and provides real-time alerts through an interactive dashboard. Developers can monitor
            threats, view logs, and visualize attack trends to strengthen their website’s security posture.
          </p>

          <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-slate-800">
              🔧 Built With
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              <span className="font-medium">Frontend:</span> React.js, Tailwind CSS <br />
              <span className="font-medium">Backend:</span> Node.js, Express.js, MongoDB <br />
              <span className="font-medium">Other:</span> JWT Authentication, Real-time Logs
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-slate-800 flex items-center justify-center gap-2">
            <FaUser className="text-indigo-500" /> About Me
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
            Hello! I’m <span className="font-semibold text-slate-800">Subhash Kumar</span>, a final-year
            B.Tech Computer Science student passionate about building secure, scalable, and practical
            web solutions. I enjoy working on MERN stack projects, exploring cybersecurity, and turning
            ideas into working applications that solve real-world problems.
          </p>

          <div className="flex items-center justify-center gap-2 text-indigo-500 mb-6">
            <FaCode className="w-5 h-5" />
            <span className="text-slate-600 text-sm sm:text-base italic">
              “I build projects that combine innovation with security.”
            </span>
          </div>

          <div className="flex justify-center items-center space-x-5 mt-4">
            <a
              href="https://github.com/FZRAJPUT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/subhash-kumar-f98z/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a
              href="https://subhash-porfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              <FaGlobe className="w-6 h-6" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 w-full text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} InputShield • Built with ❤️ by <a href="https://subhash-porfolio.vercel.app" target="blank_">Subhash Kumar</a>
      </footer>
    </div>
  );
};

export default About;
