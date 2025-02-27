import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, ListCheck, HousePlus, Settings, LogOut } from "lucide-react";
import { auth } from "../Firebase/Firebase"; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut function
import logo from "../images/logo.png";

function AdminNavbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is under "/admin/settings"
  const isSettingsActive = location.pathname.startsWith("/admin/settings");

  // Logout function
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
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Navbar */}
      <aside className="bg-[#FAFAFA] text-black shadow-md h-screen fixed left-0 top-0 flex flex-col items-center py-4 w-60">
        {/* Logo Section */}
        <div className="w-full flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-36 h-auto" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col w-full items-center">
          <ul className="w-full space-y-4">
            {/* Home */}
            <li>
              <NavLink
                to="/admin-home"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-medium w-full transition ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
              >
                <Home className="w-6 h-6" />
                <span>Home</span>
              </NavLink>
            </li>

            {/* Complaints */}
            <li>
              <NavLink
                to="/admin/complaints"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-medium w-full transition ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
              >
                <ListCheck className="w-6 h-6" />
                <span>Complaints</span>
              </NavLink>
            </li>

            {/* Room Management */}
            <li>
              <NavLink
                to="/admin-home/room-management"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg text-lg font-medium w-full transition ${
                    isActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                  }`
                }
              >
                <HousePlus className="w-6 h-6" />
                <span>Room Management</span>
              </NavLink>
            </li>

            {/* Settings Dropdown */}
            <li>
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg text-lg font-medium w-full cursor-pointer transition ${
                  isSettingsActive ? "bg-orange-500 text-white" : "hover:bg-gray-200 text-black"
                }`}
                onClick={toggleSettings}
              >
                <Settings className="w-6 h-6" />
                <span>Settings</span>
              </div>

              {/* Dropdown Menu for Settings */}
              {isSettingsOpen && (
                <ul className="ml-6 mt-2 space-y-2">
                  <li>
                    <NavLink
                      to="/admin/settings/general"
                      className={({ isActive }) =>
                        `flex items-center justify-between p-2 rounded-lg text-lg font-medium transition ${
                          isActive ? "bg-orange-300 text-white" : "hover:bg-gray-200 text-black"
                        }`
                      }
                    >
                      <span>General</span>
                      <span>&gt;</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/settings/account"
                      className={({ isActive }) =>
                        `flex items-center justify-between p-2 rounded-lg text-lg font-medium transition ${
                          isActive ? "bg-orange-300 text-white" : "hover:bg-gray-200 text-black"
                        }`
                      }
                    >
                      <span>Account</span>
                      <span>&gt;</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg text-lg font-medium w-full hover:bg-red-500 hover:text-white transition"
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

export default AdminNavbar;