import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, User, ChevronLeft, ChevronRight, Hotel } from "lucide-react";
import { NavLink } from "react-router-dom";

function AdminSetting() {
  const navigate = useNavigate();

  // Function to handle the back button click
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  // Settings menu items (Security and Notifications removed)
  const settingsMenuItems = [
    {
      icon: <Hotel className="w-6 h-6 text-orange-500" />,
      title: "General",
      description: "Manage and update hotel details",
      route: "/general",
    },
    {
      icon: <User className="w-6 h-6 text-orange-500" />,
      title: "Account",
      description: "Staff account creation form",
      route: "/admin-home/create-user",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-gray-50 min-h-screen">
      {/* Back Button and Page Title */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md text-orange-500 hover:text-orange-600 transition-colors hover:bg-orange-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 text-transparent bg-clip-text">Settings</h2>
        </div>

        {/* Settings Card Section */}
        <div className="space-y-4">
          {settingsMenuItems.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <NavLink 
                to={item.route} 
                className="flex justify-between items-center w-full"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSetting;