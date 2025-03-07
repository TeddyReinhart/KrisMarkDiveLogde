import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, CalendarDays, FileClock, FileText, Settings, LogOut } from "lucide-react";
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
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                  isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
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
                   isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
              >
                <CalendarDays className="w-6 h-6" />
                <span>Booking</span>
              </NavLink>
            </li>

            {/* Booking History */}
            <li className="mb-4">
              <NavLink
                to="/home/book-history"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
              >
                <FileClock className="w-6 h-6" />
                <span>Booking History</span>
              </NavLink>
            </li>

            {/* Reports */}
            <li className="mb-4">
              <NavLink
                to="/home/report"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
              >
                <FileText className="w-6 h-6" />
                <span>Reports</span>
              </NavLink>
            </li>

            {/* Settings */}
            <li className="mb-4"> 
              <NavLink
                to="/home/setting"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-orange-500 hover:text-white ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
                onClick={toggleSettings} // Toggle the settings dropdown
              >
                <Settings className="w-6 h-6" />
                <span>Settings</span>
                </NavLink>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold w-full transition-all duration-200 hover:bg-red-500 hover:text-white text-black"
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