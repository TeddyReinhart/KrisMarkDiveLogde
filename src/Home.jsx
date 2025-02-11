import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import room1 from "./images/room1.png";
import room2 from "./images/room2.png";
import room3 from "./images/room3.png";
import room4 from "./images/room4.png";

function Home() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();  // Hook for navigation

  // Navigate to NewBooking page
  const handleViewReservation = () => {
    navigate("/new-booking");
  };

  // Navigate to Booking page
  const handleViewBooking = () => {
    navigate("/booking");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left Column (Rooms) */}
        <div className="col-span-7 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Room Availability</h2>
          <div className="space-y-4">
            <RoomCard image={room1} name="Standard Double Room" />
            <RoomCard image={room2} name="Triple Room" />
            <RoomCard image={room3} name="Twin Room" />
            <RoomCard image={room4} name="Family Room" />
          </div>
        </div>

        {/* Right Column (Calendar & Booking Details) */}
        <div className="col-span-5 space-y-6">
          {/* Calendar Section */}
          <div className="col-span-12 md:col-span-4 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">6 Jan 2025</h3>
            <CalendarComponent date={date} setDate={setDate} />
          </div>

          {/* Reservation Section */}
          <div className="col-span-12 md:col-span-8 space-y-6">
            {/* Reservation Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Reservation Dates</h3>
              <div className="space-y-3">
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full"
                  onClick={handleViewReservation}
                >
                  View reservation date
                </button>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full"
                  onClick={handleViewBooking}
                >
                  View booking
                </button>
              </div>
            </div>

            {/* Selected Room Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Selected Room</h3>
              <div className="flex justify-center">
                <img
                  src={room4}
                  alt="Family Room"
                  className="rounded-lg w-full h-64 object-cover border border-gray-200"
                />
              </div>
              <p className="text-center font-bold mt-4">Family Room</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ image, name }) {
  return (
    <div className="bg-gray-200 p-4 rounded-lg flex items-center shadow-md">
      <img src={image} alt={name} className="w-32 h-24 object-cover rounded-lg" />
      <h4 className="ml-4 font-bold">{name}</h4>
    </div>
  );
}

export default Home;
