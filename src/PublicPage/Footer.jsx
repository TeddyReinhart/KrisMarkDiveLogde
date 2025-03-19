import React from 'react';
import { FaFacebookF, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUmbrellaBeach, FaSwimmer, FaWater } from 'react-icons/fa';
import FooterLogo from './Images/FooterLogo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 text-blue-900 pt-8 pb-4 relative overflow-hidden">
      {/* Top decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-6 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
          <path fill="#0059A8" fillOpacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
          <path fill="#0059A8" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,144C672,149,768,203,864,213.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Logo & About Section */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="group">
              <img 
                src={FooterLogo} 
                alt="Krismark Dive Lodge Logo" 
                className="w-32 h-auto object-contain filter drop-shadow-md transition-all duration-300 group-hover:scale-105" 
              />
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent transform scale-x-75 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
            
            <p className="text-xs text-center md:text-left text-blue-700/80 max-w-xs">
              <span className="font-medium text-blue-800">KRISMARK DIVE LODGE</span> - Your perfect beachfront getaway in Cebu, offering stunning ocean views and direct beach access.
            </p>
            
            <div className="flex items-center mt-1">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-orange-500 transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebookF size={12} />
              </a>
            </div>
          </div>
          
          {/* Middle Section - Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-bold mb-3 relative">
              <span className="inline-block pb-1 border-b border-orange-500">Explore</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                { name: 'Overview', href: '#overview', icon: <FaUmbrellaBeach /> },
                { name: 'Accommodations', href: '#rooms', icon: <FaSwimmer /> },
                { name: 'Special Offers', href: '#offers', icon: <FaWater /> },
                { name: 'Contact', href: '#contacts', icon: <FaUmbrellaBeach /> },
          
              ].map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="text-xs text-blue-800 hover:text-orange-500 transition-all duration-200 flex items-center group"
                >
                  <span className="mr-1.5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs">
                    {link.icon}
                  </span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-semibold mb-3 relative">
              <span className="inline-block pb-1 border-b border-orange-500">Get In Touch</span>
            </h3>
            
            <div className="bg-white/80 shadow-md rounded-lg p-3 border border-blue-50 relative overflow-hidden w-full max-w-xs">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              
              <div className="space-y-3 text-xs text-blue-800">
                <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-blue-50 p-1.5 rounded-md mr-2 group-hover:bg-orange-100 transition-colors duration-300">
                    <FaMapMarkerAlt className="text-orange-500" size={12} />
                  </div>
                  <div>
                    <p className="font-medium">Our Location</p>
                    <p className="text-blue-700/80 text-xs mt-0.5">Panagsama Beach, Moalboal, Cebu</p>
                  </div>
                </div>
                
                <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-blue-50 p-1.5 rounded-md mr-2 group-hover:bg-orange-100 transition-colors duration-300">
                    <FaEnvelope className="text-orange-500" size={12} />
                  </div>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <a href="mailto:krismarkdivelodgemoalboal@gmail.com" className="text-blue-700/80 text-xs mt-0.5 hover:text-orange-500 transition-colors duration-200 block truncate">
                      krismarkdivelodgemoalboal@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-blue-50 p-1.5 rounded-md mr-2 group-hover:bg-orange-100 transition-colors duration-300">
                    <FaPhone className="text-orange-500" size={12} />
                  </div>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href="tel:+639475203454" className="text-blue-700/80 text-xs mt-0.5 hover:text-orange-500 transition-colors duration-200">
                      +63 947 520 3454
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-4 pt-3 border-t border-blue-100 flex flex-col md:flex-row justify-between items-center text-xs text-blue-700/70">
          <p>
            &copy; {currentYear} <span className="font-medium">KRISMARK DIVE LODGE</span>. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-3 md:mt-0">
            <a href="#privacy" className="text-xs text-blue-800/80 hover:text-orange-500 transition-colors duration-200 border-b border-transparent hover:border-orange-500">
              Privacy Policy
            </a>
            <a href="#terms" className="text-xs text-blue-800/80 hover:text-orange-500 transition-colors duration-200 border-b border-transparent hover:border-orange-500">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;