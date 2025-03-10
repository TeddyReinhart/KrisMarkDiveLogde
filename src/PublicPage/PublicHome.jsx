import React from 'react';
import Footer from "./Footer"; 
import backgroundImage from "./Images/LogInBg.png"; 

const PublicHome = () => {
  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      id="home"
    >
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-4 pt-20 bg-black bg-opacity-50">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">DISCOVER KRISMARK DIVE LODGE</h1>
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Choose room</label>
                <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  <option>Family Room</option>
                  <option>Twin Room</option>
                  <option>Standard Double Room</option>
                  <option>Triple Room</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Choose dates</label>
                <input type="date" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Guests</label>
                <input type="number" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Promo code</label>
                <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Check Availability</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer /> 
    </div>
  );
};

export default PublicHome;