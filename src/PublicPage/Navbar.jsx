import React from 'react';

const Navbar = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-blue-900 p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          KRISMARK DIVE LODGE
        </div>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => scrollToSection('overview')} className="text-white hover:text-blue-300">OVERVIEW</button>
          <button onClick={() => scrollToSection('rooms')} className="text-white hover:text-blue-300">ROOMS</button>
          <button onClick={() => scrollToSection('offers')} className="text-white hover:text-blue-300">OFFERS</button>
          <button onClick={() => scrollToSection('contact')} className="text-white hover:text-blue-300">CONTACT US</button>
        </div>
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden bg-blue-800">
        <button onClick={() => scrollToSection('overview')} className="block text-white py-2 px-4 hover:bg-blue-700 w-full text-left">OVERVIEW</button>
        <button onClick={() => scrollToSection('rooms')} className="block text-white py-2 px-4 hover:bg-blue-700 w-full text-left">ROOMS</button>
        <button onClick={() => scrollToSection('offers')} className="block text-white py-2 px-4 hover:bg-blue-700 w-full text-left">OFFERS</button>
        <button onClick={() => scrollToSection('contact')} className="block text-white py-2 px-4 hover:bg-blue-700 w-full text-left">CONTACT US</button>
      </div>
    </nav>
  );
};

export default Navbar;