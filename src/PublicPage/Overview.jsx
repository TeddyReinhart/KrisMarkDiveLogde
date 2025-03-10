import React from 'react';

const Overview = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center pt-20" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }} id="overview">
      <div className="text-center bg-white bg-opacity-75 p-8 rounded-lg shadow-lg">
        <h1 className="text-5xl font-bold text-blue-900 mb-4">WELCOME TO KRISMARK DIVE LODGE</h1>
        <p className="text-lg text-gray-700 mb-6">
          Discover Krismark Dive Lodge in Moalboal - a hidden gem by the sea where adventure and relaxation collide. Feel the cool ocean breeze, explore vibrant marine life, and unwind in a cozy, welcoming haven designed to refresh your body and soul. The sea is calling, and your unforgettable escape begins here.
        </p>
        <p className="text-lg text-gray-700">
          Whether you're seeking thrills beneath the waves or tranquillity by the shore, our lodge offers an experience that lingers long after you leave.
        </p>
      </div>
    </div>
  );
};

export default Overview;