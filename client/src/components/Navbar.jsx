import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("userLoggedIn", handleStorageChange);
    window.addEventListener("userLoggedOut", handleStorageChange);

    return () => {
      window.removeEventListener("userLoggedIn", handleStorageChange);
      window.removeEventListener("userLoggedOut", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-50 px-6 py-4 rounded-b-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
          TalentConnect
        </Link>

        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
          {user?.role ? (
            <>
              <Link
                to={
                  user.role === "recruiter"
                    ? "/recruiter/dashboard"
                    : "/candidate/dashboard"
                }
                className={`transition font-medium ${
                  location.pathname.includes("dashboard")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Dashboard
              </Link>

              <span className="hidden sm:inline text-gray-600 dark:text-gray-300 text-sm">
                Welcome, <strong>{user.name || "User"}</strong>
              </span>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`font-medium transition ${
                  location.pathname === "/login"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-semibold shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
