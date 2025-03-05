import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaWifi,
  FaSnowflake,
  FaUserFriends,
  FaBath,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Adjust the path to your firebase.js file

function RoomAvailability() {
  const [roomsState, setRoomsState] = useState([]); // State to store rooms
  const navigate = useNavigate();

  // Fetch rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, "rooms"); // Replace "rooms" with your Firestore collection name
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoomsState(roomsData); // Update state with fetched rooms
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, []);

  // Toggle availability status and update Firestore
  const toggleAvailability = async (roomId, currentStatus) => {
    try {
      const roomRef = doc(db, "rooms", roomId); // Reference to the specific room document
      const newStatus =
        currentStatus === "Available" ? "Unavailable" : "Available";

      await updateDoc(roomRef, {
        status: newStatus,
      }); // Update the status
      setRoomsState((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );
    } catch (error) {
      console.error("Error updating room status: ", error);
    }
  };

  // Navigate to BookingForm.jsx with selected room data
  const handleRoomClick = (room) => {
    navigate("/home/rooms-availability/booking-form", { state: { room } });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      {/* Header with Back button and Room Availability heading */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-orange-500 cursor-pointer text-2xl flex items-center"
          >
            <FaArrowLeft className="mr-2" />
          </button>
          <h2 className="text-3xl font-bold">Room Availability</h2>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roomsState.map((room, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-xl shadow-lg border border-gray-200 cursor-pointer`}
            onClick={() => handleRoomClick(room)} // Redirect to BookingForm.jsx on click
          >
            {/* Image and Status Badge Container */}
            <div className="relative">
              <img
                src={room.image}
                alt={room.name}
                className="rounded-lg w-full h-52 object-cover mb-4"
              />
              {/* Availability Status Badge */}
              <div
                className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-sm font-semibold ${
                  room.status === "Available"
                    ? "bg-green-100 text-green-600"
                    : room.status === "Unavailable"
                    ? "bg-red-100 text-red-600"
                    : room.status === "Limited Availability"
                    ? "bg-yellow-100 text-yellow-600"
                    : room.status === "Occupied"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {room.status}
              </div>
            </div>

            {/* Room Details */}
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
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <FaMoneyBillAlt /> Rate per Day: ₱{room.ratePerDay?.toLocaleString() || "N/A"}
            </p>

            {/* Availability Status Toggle Button */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2"> Availability Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
              <button
              className={`px-3 py-1 rounded-lg text-center ${
                room.status === "Available"
                  ? "bg-green-100 text-green-600"
                  : room.status === "Unavailable"
                  ? "bg-red-100 text-red-600"
                  : room.status === "Limited Availability"
                  ? "bg-yellow-100 text-yellow-600"
                  : room.status === "Occupied"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the room click event from firing
                toggleAvailability(room.id, room.status); // Toggle the status
              }}
            >
              {room.status} 
            </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomAvailability;