import React from 'react';
import { FaFacebookF, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import FooterLogo from './Images/FooterLogo.png';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 text-blue-900 py-12 border-t border-gray-100"> 
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Logo and Contact Information */}
          <div className="space-y-4">
            <div className="flex justify-center md:justify-start">
              <img 
                src={FooterLogo} 
                alt="Krismark Dive Lodge Logo" 
                className="w-48 h-auto object-contain" 
              /> 
            </div>
            <p className="text-sm text-center md:text-left max-w-xs mx-auto md:mx-0">
              Your ultimate diving destination in Cebu, offering unforgettable underwater adventures 
              and comfortable accommodations.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500"></span>
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-3 text-orange-500" />
                <p>Panagsama Beach, Moalboal, Cebu Phil., 6032</p>
              </div>
              
              <div className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-3 text-orange-500" />
                <a 
                  href="mailto:krismarkdivelodgemoalboal@gmail.com" 
                  className="hover:text-orange-500 transition-colors duration-200"
                >
                  krismarkdivelodgemoalboal@gmail.com
                </a>
              </div>
              
              <div className="flex items-center justify-center md:justify-start">
                <FaPhone className="mr-3 text-orange-500" />
                <a 
                  href="tel:+639475203454" 
                  className="hover:text-orange-500 transition-colors duration-200"
                >
                  0947 520 3454
                </a>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="text-center md:text-left md:justify-self-end">
            <h3 className="text-lg font-semibold mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-orange-500"></span>
            </h3>
            
            <ul className="space-y-2">
              <li>
                <a 
                  href="#overview" 
                  className="hover:text-orange-500 transition-colors duration-200 flex items-center justify-center md:justify-start"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Overview
                </a>
              </li>
              <li>
                <a 
                  href="#rooms" 
                  className="hover:text-orange-500 transition-colors duration-200 flex items-center justify-center md:justify-start"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Rooms
                </a>
              </li>
              <li>
                <a 
                  href="#offers" 
                  className="hover:text-orange-500 transition-colors duration-200 flex items-center justify-center md:justify-start"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Offers
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="hover:text-orange-500 transition-colors duration-200 flex items-center justify-center md:justify-start"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  About us
                </a>
              </li>
              <li>
                <a 
                  href="#contacts" 
                  className="hover:text-orange-500 transition-colors duration-200 flex items-center justify-center md:justify-start"
                >
                  <span className="w-1 h-1 bg-orange-500 rounded-full mr-2"></span>
                  Contacts
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-900 text-white p-2 rounded-full hover:bg-orange-500 transition-colors duration-200"
            >
              <FaInstagram size={18} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-900 text-white p-2 rounded-full hover:bg-orange-500 transition-colors duration-200"
            >
              <FaFacebookF size={18} />
            </a>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} KRISMARK DIVE LODGE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;