import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Bell } from "lucide-react"; // Import Bell icon
import logo from "./images/logo.png"; // Import Logo
import profile from "./images/profile.png"; // Import Profile Image

function Navbar() {
  return (
    <>
      {/* Sidebar */}
      <aside className="bg-[#FAFAFA] text-black shadow-md w-64 h-screen fixed left-0 top-0 flex flex-col items-center p-4">
        
        {/* Logo Section */}
        <div className="mt-5 mb-10 flex justify-center">
          <img src={logo} alt="Logo" className="w-40 h-auto" /> {/* Adjust size as needed */}
        </div>

        {/* Navigation Links */}
        <nav className="w-full">
          {[
            { to: "/", label: "Home" },
            { to: "/booking", label: "Booking" },
            { to: "/guest", label: "Guest" },
            { to: "/settings", label: "Settings" },
            { to: "/logout", label: "Logout" }
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block w-full text-left p-4 font-bold rounded-lg transition-all ${
                  isActive ? "bg-orange-500 text-white" : "hover:bg-gray-300"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content (With Fixed Header) */}
      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        
        {/* Header (Always Visible) */}
         <header className="bg-gray-300 flex justify-between items-center p-4 shadow-md">
               <div className="flex items-center space-x-4">
                 <input
                   type="text"
                   placeholder="Search here"
                   className="p-2 w-96 rounded-lg border"
                 />
               </div>
               <div className="flex items-center space-x-4">
                 <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
                 <div className="flex items-center space-x-2">
                   <img src={profile} alt="User Avatar" className="h-10 w-10 rounded-full" />
                   <div>
                     <span className="block font-semibold">Clarence Lauron</span>
                     <span className="text-sm text-gray-500">Receptionist</span>
                   </div>
                 </div>
               </div>
             </header>
       

        {/* Dynamic Page Content */}
        <Outlet />
      </main>
    </>
  );
}

export default Navbar;
