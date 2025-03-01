import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, CalendarDays, User, Settings, LogOut } from "lucide-react";
import logo from "../images/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase";

function Navbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for toggling the settings dropdown
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      navigate("/login"); // Redirect to login page
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen); // Toggle the dropdown visibility
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navbar */}
      <aside className="bg-[#FAFAFA] text-black shadow-lg h-screen fixed left-0 top-0 flex flex-col items-center py-6 w-64">
        {/* Logo Section */}
        <div className="w-full flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col w-full mt-6 items-center">
          <ul className="w-full">
            {/* Home */}
            <li className="mb-4">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                    isActive ? "bg-orange-500 text-white" : "text-gray-700"
                  }`
                }
              >
                <Home className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </li>

            {/* Booking */}
            <li className="mb-4">
              <NavLink
                to="/home/book-rooms"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                    isActive ? "bg-orange-500 text-white" : "text-gray-700"
                  }`
                }
              >
                <CalendarDays className="w-6 h-6" />
                <span>Booking</span>
              </NavLink>
            </li>

            {/* Guest */}
            <li className="mb-4">
              <NavLink
                to="/home/book-history"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                    isActive ? "bg-orange-500 text-white" : "text-gray-700"
                  }`
                }
              >
                <CalendarDays className="w-6 h-6" />
                <span>Booking History</span>
              </NavLink>
            </li>

            {/* Settings */}
            <li className="mb-4">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 cursor-pointer ${
                  isSettingsOpen ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-500 hover:text-white"
                }`}
                onClick={toggleSettings} // Toggle the settings dropdown
              >
                <Settings className="w-6 h-6" />
                <span>Settings</span>
              </div>

              {/* Dropdown Menu for Settings */}
              {isSettingsOpen && (
                <div className="pl-10 mt-2 space-y-2">
                  <NavLink
                    to="/settings/general"
                    className={({ isActive }) =>
                      `flex items-center justify-between p-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
                        isActive ? "bg-orange-300 text-white" : "text-gray-700 hover:bg-orange-300 hover:text-white"
                      }`
                    }
                  >
                    <span>General</span>
                    <span>&gt;</span> {/* Right arrow */}
                  </NavLink>
                  <NavLink
                    to="/settings/account"
                    className={({ isActive }) =>
                      `flex items-center justify-between p-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
                        isActive ? "bg-orange-300 text-white" : "text-gray-700 hover:bg-orange-300 hover:text-white"
                      }`
                    }
                  >
                    <span>Account</span>
                    <span>&gt;</span> {/* Right arrow */}
                  </NavLink>
                </div>
              )}
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white text-gray-700"
              >
                <LogOut className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Navbar;