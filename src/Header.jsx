import React from "react";

function Header({ onLogout }) {
  return (
    <header className="fixed top-0 left-64 right-0 flex items-center justify-between p-4 bg-gray-100 shadow-md z-50">
      {/* Name */}
      <div className="text-center">
        <p className="text-xl font-semibold">Clarence Lauron</p>
        <p className="text-xs text-gray-500">Receptionist</p>
      </div>

      {/* Profile */}
      <div className="flex items-center space-x-4">
        <img src="/images/profile.png" alt="Profile" className="h-10 w-10 rounded-full" />
        <button onClick={onLogout} className="text-black bg-orange-500 px-3 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
