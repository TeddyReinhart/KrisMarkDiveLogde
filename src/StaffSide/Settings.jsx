import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User } from "lucide-react";  // Import icons
import { NavLink } from "react-router-dom";

function Setting() {
  const navigate = useNavigate();

  // Function to handle the back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Back Button and Page Title */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleBack}
          className="text-orange-500 hover:text-orange-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path d="M12.854 8.354a.5.5 0 0 0 0-.708L8.707 4.707a.5.5 0 0 0-.707 0L4.146 7.646a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .707 0l4.001-4z" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>

      {/* Settings Card Section */}
      <div className="space-y-6">
        {/* General Section */}
        <div className="bg-gray-200 p-6 rounded-xl shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-xl font-semibold text-orange-500">General</h3>
              <p className="text-sm text-gray-600">Manage and update hotel details</p>
            </div>
          </div>
          <NavLink to="/general" className="text-orange-500 hover:text-orange-600">Edit</NavLink>
        </div>

        {/* Account Section */}
        <div className="bg-gray-200 p-6 rounded-xl shadow-md flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <User className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="text-xl font-semibold text-orange-500">Account</h3>
              <p className="text-sm text-gray-600">Edit account details and profile</p>
            </div>
          </div>
          <NavLink to="/account" className="text-orange-500 hover:text-orange-600">Edit</NavLink>
        </div>
      </div>
    </div>
  );
}

export default Setting;
