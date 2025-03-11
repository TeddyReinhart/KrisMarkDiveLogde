import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'}`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <div className="text-blue-900 text-2xl font-bold tracking-wider">
            KRISMARK <span className="text-orange-500">DIVE LODGE</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('overview')} 
            className="text-blue-900 font-medium hover:text-orange-500 transition-colors duration-200 relative group"
          >
            OVERVIEW
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('rooms')} 
            className="text-blue-900 font-medium hover:text-orange-500 transition-colors duration-200 relative group"
          >
            ROOMS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('offers')} 
            className="text-blue-900 font-medium hover:text-orange-500 transition-colors duration-200 relative group"
          >
            OFFERS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-blue-900 font-medium hover:text-orange-500 transition-colors duration-200 relative group"
          >
            CONTACT US
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('Faqs')} 
            className="text-blue-900 font-medium hover:text-orange-500 transition-colors duration-200 relative group"
          >
            FAQS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('booknow')} 
            className="bg-orange-500 text-white py-2 px-6 rounded-full font-medium hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105"
          >
            BOOK NOW
          </button>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-blue-900 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100 absolute w-full animate-fadeIn">
          <div className="flex flex-col space-y-2 py-3">
            <button 
              onClick={() => scrollToSection('overview')} 
              className="text-blue-900 py-2 px-6 hover:bg-blue-50 w-full text-left font-medium"
            >
              OVERVIEW
            </button>
            <button 
              onClick={() => scrollToSection('rooms')} 
              className="text-blue-900 py-2 px-6 hover:bg-blue-50 w-full text-left font-medium"
            >
              ROOMS
            </button>
            <button 
              onClick={() => scrollToSection('offers')} 
              className="text-blue-900 py-2 px-6 hover:bg-blue-50 w-full text-left font-medium"
            >
              OFFERS
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-blue-900 py-2 px-6 hover:bg-blue-50 w-full text-left font-medium"
            >
              CONTACT US
            </button>
            <button 
              onClick={() => scrollToSection('booknow')} 
              className="mx-6 bg-orange-500 text-white py-2 px-4 rounded-full font-medium hover:bg-orange-600 transition-colors duration-200"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;