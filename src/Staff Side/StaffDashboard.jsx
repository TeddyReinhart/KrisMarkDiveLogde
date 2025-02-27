import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";

import logo from "./images/logo.png"; // Import Logo
import defaultProfile from "./images/profile.png"; // Default Profile Image

function StaffDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("Clarence Lauron");
  const [role, setRole] = useState("Receptionist");
  const [profileImage, setProfileImage] = useState(defaultProfile);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="bg-[#FAFAFA] text-black shadow-md h-screen fixed left-0 top-0 flex flex-col items-center py-4 w-64">
        {/* Logo Section */}
        <div className="w-full flex justify-center">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-[calc(100%-16rem)] min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-gray-300 flex justify-between items-center p-4 shadow-md">
          <div className="flex items-center space-x-4"></div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            {/* Profile Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-400 hover:text-white transition"
            >
              <img src={profileImage} alt="User Avatar" className="h-10 w-10 rounded-full" />
              <div>
                <span className="block font-bold">{name}</span>
                <span className="text-sm text-gray-500 font-bold">{role}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <Outlet />
      </main>

      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-orange bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 transition-all transform scale-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Edit Profile</h2>

            {/* Profile Image Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <img src={profileImage} alt="Profile Preview" className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm" />
              
              <label className="cursor-pointer bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition font-bold">
                Upload New Picture
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                />
              </label>
            </div>

            {/* Name Input */}
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mt-1 font-bold"
              />
            </div>

            {/* Role Input */}
            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700">Role</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mt-1 font-bold"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StaffDashboard;