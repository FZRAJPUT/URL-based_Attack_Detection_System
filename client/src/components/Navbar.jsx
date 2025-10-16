import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navItems = ["Home", "Dashboard", "Docs", "About", "Profile"];

  // Determine active nav item based on current route
  const getActiveItem = () => {
    const path = location.pathname.replace("/", "");
    if (path === "") return "Home";
    if (path === "login") return "Profile";
    return navItems.find((item) => item.toLowerCase() === path) || "Home";
  };

  const [active, setActive] = useState(getActiveItem());

  // Update active when route changes
  useEffect(() => {
    setActive(getActiveItem());
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-indigo-600 border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white tracking-wide">
          <Link to={"/"}>
            <span className="text-[#73EC8B]">I</span>nput
            <span className="text-[#73EC8B]">Shield</span>
          </Link>
        </h1>

        <ul className="hidden md:flex items-center space-x-8 text-white">
          {navItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer relative font-medium transition-all duration-300 hover:text-[#73EC8B] ${
                active === item ? "text-[#73EC8B]" : ""
              }`}
            >
              <Link
                to={
                  "/" +
                  (item === "Profile"
                    ? localStorage.getItem("token")
                      ? "profile"
                      : "login"
                    : item.toLowerCase())
                }
                className="flex items-center gap-2"
              >
                {item === "Profile" ? (
                  localStorage.getItem("token") ? (
                    <FaUserCircle size={26} />
                  ) : (
                    "Login"
                  )
                ) : (
                  item
                )}
              </Link>

              {active === item && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-[-4px] h-[2px] w-full bg-[#73EC8B] rounded-full"
                />
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white text-3xl focus:outline-none"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/30 text-white backdrop-blur-xl flex flex-col items-center space-y-4 py-4 border-t border-white/20"
          >
            {navItems.map((item) => (
              <li
                key={item}
                onClick={() => setIsOpen(false)}
                className={`text-lg cursor-pointer transition-all hover:text-blue-400 ${
                  active === item ? "text-blue-400" : ""
                }`}
              >
                <Link
                  to={
                    "/" +
                    (item === "Profile"
                      ? localStorage.getItem("token")
                        ? "profile"
                        : "login"
                      : item.toLowerCase())
                  }
                >
                  {item === "Profile" ? (
                    localStorage.getItem("token") ? (
                      <FaUserCircle size={22} />
                    ) : (
                      "Login"
                    )
                  ) : (
                    item
                  )}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
