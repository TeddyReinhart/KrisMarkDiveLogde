import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-lg font-semibold">KRISMARK DIVE LODGE</div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="hover:text-gray-600">OVERVIEW</a>
              <a href="#" className="hover:text-gray-600">ROOMS</a>
              <a href="#" className="hover:text-gray-600">OFFERS</a>
              <a href="#" className="hover:text-gray-600">CONTACT US</a>
              <a href="#" className="hover:text-gray-600">BOOK NOW</a>
              <a href="#" className="hover:text-gray-600">LOG IN</a>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-cover bg-center h-96 flex items-center justify-center" style={{ backgroundImage: "url('https://via.placeholder.com/1200x400')" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">DISCOVER KRISMARK DIVE LODGE</h1>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg -mt-20 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Choose room</label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>Room Type 1</option>
              <option>Room Type 2</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Choose dates</label>
            <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Guests</label>
            <input type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">Promo code</label>
            <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
        <div className="mt-6">
          <button className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">Check Availability</button>
        </div>
      </div>
    </div>
  );
};

export default Home;