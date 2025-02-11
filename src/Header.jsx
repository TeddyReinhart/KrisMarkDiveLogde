import React from 'react';
import { CalendarIcon, BellIcon } from 'lucide-react';
import profile from './images/profile.png';


function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100">
      {/* Logo */}
      <div className="flex items-center">
        <img src="C:\Users\jasper\Krismark\src\images\logo.png" alt="Logo" className="h-10 w-auto" />
      </div>

      {/* Name */}
      <div>
        <p className="text-xl font-semibold">Clarence Lauron</p>
        <p className="text-xs text-gray-500">Receptionist</p>
      </div>

      {/* Profile Picture */}
      <div>
        <img src="C:\Users\jasper\Krismark\src\images\profile.png" alt="Profile" className="h-10 w-10 rounded-full" />
      </div>
    </header>
  );
}

export default Header;
