import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaWifi, FaSnowflake, FaUserFriends, FaBath } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import room1 from "../images/room1.png";
import room2 from "../images/room2.png";
import room3 from "../images/room3.png";
import room4 from "../images/room4.png";

const rooms = [
  {
    name: "Standard Double Room",
    image: room1,
    guests: 3,
    amenities: ["Airconditioned", "Free Wifi", "Own Bathroom"],
    status: ["Available", "Limited Availability", "Occupied", "Closed for Maintenance"],
  },
  {
    name: "Triple Room",
    image: room2,
    guests: 4,
    amenities: ["Airconditioned", "Free Wifi", "Own Bathroom"],
    status: ["Available", "Occupied", "Limited Availability", "Closed for Maintenance"],
  },
  {
    name: "Twin Room",
    image: room3,
    guests: 3,
    amenities: ["Airconditioned", "Free Wifi", "Own Bathroom"],
    status: ["Available", "Limited Availability", "Occupied", "Closed for Maintenance"],
  },
  {
    name: "Family Room",
    image: room4,
    guests: 8,
    amenities: ["Airconditioned", "Free Wifi", "Own Bathroom"],
    status: ["Available", "Limited Availability", "Occupied", "Closed for Maintenance"],
  },
];

function AdminRoomAvailability() {
  const [roomsState, setRoomsState] = useState(rooms); // Track rooms status
  const navigate = useNavigate(); // Initialize navigation

  // Function to toggle availability status between "Available" and "Unavailable"
  const toggleAvailability = (roomIndex) => {
    setRoomsState((prevRooms) => {
      const updatedRooms = [...prevRooms];
      const currentRoom = updatedRooms[roomIndex];

      // Toggle "Available" and "Unavailable"
      if (currentRoom.status[0] === "Available") {
        currentRoom.status[0] = "Unavailable";
      } else if (currentRoom.status[0] === "Unavailable") {
        currentRoom.status[0] = "Available";
      }

      return updatedRooms;
    });
  };

  // Navigate to create booking page
  const handleCreateBooking = () => {
    navigate("/create-booking");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Header with Back button, Room Availability heading and Create Booking button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="text-orange-500 cursor-pointer text-2xl flex items-center">
            <FaArrowLeft className="mr-2" />
          </button>
          <h2 className="text-3xl font-bold">Room Availability</h2>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roomsState.map((room, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <img src={room.image} alt={room.name} className="rounded-lg w-full h-52 object-cover mb-4" />
            <h3 className="text-xl font-bold">{room.name}</h3>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FaUserFriends /> Max guests: {room.guests}
            </p>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FaBath /> Own Bathroom
            </p>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FaSnowflake /> Airconditioned
            </p>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FaWifi /> Free Wifi
            </p>

            {/* Availability Status */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Availability status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {room.status.map((status, idx) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 rounded-lg text-center ${
                      status === "Available"
                        ? "bg-green-100 text-green-600"
                        : status === "Unavailable"
                        ? "bg-red-100 text-red-600"
                        : status === "Limited Availability"
                        ? "bg-yellow-100 text-yellow-600"
                        : status === "Occupied"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={() => status === "Available" && toggleAvailability(index)} // Toggle only for "Available" status
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminRoomAvailability;
