import React from 'react';
import FooterLogo from './Images/FooterLogo.png'; 

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Contact Information */}
          <div className="flex flex-col items-center md:items-start">
            <img src={FooterLogo} alt="Krismark Dive Lodge Logo" className="mb-4 w-48" /> 
            <h2 className="text-2xl font-bold mb-4">KRISMARK DIVE LODGE</h2>
            <p className="mb-2">Pamagsama Beach, Moalboal, Cebu Phil.,</p>
            <p className="mb-2">Moalboal, Philippines, 6032</p>
            <p className="mb-2">krismarkdivelodgemoalboal@gmail.com</p>
            <p>0947 520 3454</p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#overview" className="hover:text-blue-300">Overview</a></li>
              <li><a href="#rooms" className="hover:text-blue-300">Rooms</a></li>
              <li><a href="#offers" className="hover:text-blue-300">Offers</a></li>
              <li><a href="#about" className="hover:text-blue-300">About us</a></li>
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">What's New</h3>
            <ul className="space-y-2">
              <li><a href="#contacts" className="hover:text-blue-300">Contacts</a></li>
              <li><a href="#environmental-policy" className="hover:text-blue-300">Environmental Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} KRISMARK DIVE LODGE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;