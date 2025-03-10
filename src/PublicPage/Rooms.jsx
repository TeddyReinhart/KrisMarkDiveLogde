import React from 'react';
import { ChevronRight } from 'lucide-react';

const Rooms = () => {
  // Sample room images - replace with your actual image paths
  const roomImages = [
    '/path/to/room-image-1.jpg',
    '/path/to/room-image-2.jpg',
    '/path/to/room-image-3.jpg',
    '/path/to/room-image-4.jpg',
    '/path/to/room-image-5.jpg',
    '/path/to/room-image-6.jpg',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6">
      <div className="flex flex-col md:flex-row">
        {/* Left side text content */}
        <div className="md:w-1/3 p-4">
          <h3 className="text-orange-500 uppercase text-sm font-medium mb-2">OUR ROOMS</h3>
          
          <h2 className="text-2xl font-bold mb-4">Savor Restful Moments</h2>
          
          <p className="text-blue-500 mb-6">
            At Krismark Dive Lodge, we offer accommodations for every guest with traveler-specific features. Choose from cozy Twin Rooms, Choice Family Rooms, versatile Triple Rooms, or elegant Standard Double Rooms. Each space is thoughtfully designed for comfort and convenience, providing the perfect base to explore. Your ideal stay starts 
            <a href="#" className="text-blue-600 font-medium"> here!</a>
          </p>
          
          <button className="flex items-center text-black border border-gray-300 px-3 py-2 mt-4">
            <span className="mr-2">View All Rooms</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Right side image grid */}
        <div className="md:w-2/3">
          <div className="grid grid-cols-3 gap-4">
            {roomImages.map((image, index) => (
              <div key={index} className={index >= 3 ? "mt-4" : ""}>
                <img 
                  src={`/api/placeholder/300/200`} 
                  alt={`Room image ${index + 1}`} 
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;