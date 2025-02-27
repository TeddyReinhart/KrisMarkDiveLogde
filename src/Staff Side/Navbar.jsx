import React, { useState } from "react";
import { NavLink,  useNavigate } from "react-router-dom";
import { Home, CalendarDays, User, Settings, LogOut } from "lucide-react";
import logo from "../images/logo.png";

function Navbar({ logoutHandler }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for toggling the settings dropdown
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutHandler();
    navigate("/login"); 
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen); // Toggle the dropdown visibility
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navbar */}
      <aside className="bg-[#FAFAFA] text-black shadow-md h-screen fixed left-0 top-0 flex flex-col items-center py-4 w-60">
        {/* Logo Section */}
        <div className="w-full flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col w-full mt-6 items-center">
          <ul className="w-full">
            {/* Home */}
            <li className="mb-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg text-lg font-bold w-full justify-center ${isActive ? "bg-orange-500 text-white" : "text-black"}`
                }
              >
                <Home className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </li>

            {/* Booking */}
            <li className="mb-6">
              <NavLink
                to="/booking"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg text-lg font-bold w-full justify-center ${isActive ? "bg-orange-500 text-white" : "text-black"}`
                }
              >
                <CalendarDays className="w-6 h-6" />
                <span>Booking</span>
              </NavLink>
            </li>

            {/* Guest */}
            <li className="mb-6">
              <NavLink
                to="/guest"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 rounded-lg text-lg font-bold w-full justify-center ${isActive ? "bg-orange-500 text-white" : "text-black"}`
                }
              >
                <User className="w-6 h-6" />
                <span>Guest</span>
              </NavLink>
            </li>

            {/* Settings */}
            <li className="mb-6">
              <div
                className={`flex items-center space-x-2 p-2 rounded-lg text-lg font-bold w-full justify-center cursor-pointer ${isSettingsOpen ? "bg-orange-500 text-white" : "text-black"}`}
                onClick={toggleSettings} // Toggle the settings dropdown
              >
                <Settings className="w-6 h-6" />
                <span>Settings</span>
              </div>

              {/* Dropdown Menu for Settings */}
              {isSettingsOpen && (
                <div className="pl-8 mt-2">
                  <NavLink
                    to="/settings/general"
                    className={({ isActive }) =>
                      `flex justify-between p-2 rounded-lg text-lg font-bold ${isActive ? "bg-orange-300 text-white" : "text-black"}` // Right align and add the arrow
                    }
                  >
                    <span>General</span>
                    <span>&gt;</span> {/* Right arrow */}
                  </NavLink>
                  <NavLink
                    to="/settings/account"
                    className={({ isActive }) =>
                      `flex justify-between p-2 rounded-lg text-lg font-bold mt-2 ${isActive ? "bg-orange-300 text-white" : "text-black"}` // Right align and add the arrow
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
                className="flex items-center space-x-2 p-2 rounded-lg text-lg font-bold w-full justify-center text-black"
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
