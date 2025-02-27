import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import room1 from "../images/room1.png";
import room2 from "../images/room2.png";
import room3 from "../images/room3.png";
import room4 from "../images/room4.png";

function Home() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null); // No room selected by default

  // Handle button click to navigate to either new-booking or booking page
  const handleButtonClick = (action) => {
    if (action === "view-reservation") {
      navigate("/new-booking"); // Navigate to the new-booking page
    } else if (action === "view-booking") {
      navigate("/booking"); // Navigate to the booking page
    }
  };

  // Navigate to Room Availability page
  const handleRoomAvailability = () => {
    navigate("/room-availability");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-full">
      {/* Dashboard Title */}
      <div className="text-left mb-6">
        <h2 className="text-4xl font-bold">Dashboard</h2>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column (Rooms) */}
        <div className="col-span-7 bg-white p-10 rounded-xl shadow-xl border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Room Availability</h3>
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
              onClick={handleRoomAvailability}
            >
              Check Room Availability
            </button>
          </div>
          <div className="flex flex-col gap-8">
            <RoomCard
              image={room1}
              name="Standard Double Room"
              onSelect={() => setSelectedRoom({ name: "Standard Double Room", image: room1 })}
              isSelected={selectedRoom?.name === "Standard Double Room"}
            />
            <RoomCard
              image={room2}
              name="Triple Room"
              onSelect={() => setSelectedRoom({ name: "Triple Room", image: room2 })}
              isSelected={selectedRoom?.name === "Triple Room"}
            />
            <RoomCard
              image={room3}
              name="Twin Room"
              onSelect={() => setSelectedRoom({ name: "Twin Room", image: room3 })}
              isSelected={selectedRoom?.name === "Twin Room"}
            />
            <RoomCard
              image={room4}
              name="Family Room"
              onSelect={() => setSelectedRoom({ name: "Family Room", image: room4 })}
              isSelected={selectedRoom?.name === "Family Room"}
            />
          </div>
        </div>

        {/* Right Column (Calendar & Booking Details) */}
        <div className="col-span-5 space-y-6">
          {/* Calendar Section */}
          <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-300">
            <CalendarComponent date={date} setDate={setDate} />
          </div>

          {/* Selected Room Section */}
          {selectedRoom ? (
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-300">
              <h3 className="text-2xl font-bold mb-4 text-center">Selected Room</h3>
              <div className="flex justify-center">
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="rounded-lg w-full h-72 object-cover border border-gray-300"
                />
              </div>
              <p className="text-center text-xl font-bold mt-4">{selectedRoom.name}</p>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-300">
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-500">No Room Selected</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Room Card Component
function RoomCard({ image, name, onSelect, isSelected }) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-6 rounded-lg flex flex-col items-center shadow-lg transition-all duration-200 
        ${isSelected ? "bg-orange-200 ring-4 ring-orange-400" : "bg-gray-200 hover:bg-orange-100"}`}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />
      <h4 className="mt-4 text-lg font-bold text-center">{name}</h4>
    </div>
  );
}

export default Home;