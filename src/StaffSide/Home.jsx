import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { FaCalendarAlt, FaBed, FaSearch, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

function Home() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, "rooms");
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchRooms();
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  // Fetch booked dates for the selected room
  useEffect(() => {
    const fetchBookedDates = async () => {
      if (!selectedRoom) {
        setBookedDates([]);
        return;
      }

      try {
        const bookingsCollection = collection(db, "bookings");
        const q = query(
          bookingsCollection,
          where("selectedRoom", "==", selectedRoom.name)
        );
        const bookingsSnapshot = await getDocs(q);
        const dates = [];

        bookingsSnapshot.forEach((doc) => {
          const booking = doc.data();
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);

          for (let date = new Date(checkIn); date <= checkOut; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
          }
        });

        setBookedDates(dates);
      } catch (error) {
        console.error("Error fetching booked dates: ", error);
      }
    };

    fetchBookedDates();
  }, [selectedRoom]);

  // Navigate to Room Availability page
  const handleRoomAvailability = () => {
    navigate("/home/rooms-availability");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50">
      {/* Header */}
      <div className="z-10 bg-white shadow-md p-6 backdrop-blur bg-opacity-90 bg-gradient-to-r from-orange-300 to-white rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold text-black bg-clip-text">
              Dashboard
            </h2>
          </div>
        </div>
    </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Main Content with Loader */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin"></div>
            </div>
            <p className="text-orange-600 font-medium mt-6 text-lg">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Left Column (Rooms) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Room Availability</h3>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition flex items-center justify-center"
                  onClick={handleRoomAvailability}
                >
                  <FaBed className="mr-2" /> Manage Rooms
                </button>
              </div>
              
              {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <FaTimesCircle className="text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-500 text-lg">No rooms available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      image={room.image}
                      name={room.name}
                      status={room.status}
                      onSelect={() => setSelectedRoom({ name: room.name, image: room.image })}
                      isSelected={selectedRoom?.name === room.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column (Calendar & Booking Details) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Calendar Section */}
              <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaCalendarAlt className="text-orange-500 mr-2" />
                  Availability Calendar
                </h3>
                <div className="mt-4">
                  <CalendarComponent
                    date={date}
                    setDate={setDate}
                    bookedDates={bookedDates}
                  />
                </div>
              </div>

              {/* Selected Room Section */}
              <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <FaBed className="text-orange-500 mr-2" />
                  Selected Room
                </h3>
                
                {selectedRoom ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selectedRoom.image || "https://via.placeholder.com/400x250?text=Room+Image"}
                        alt={selectedRoom.name}
                        className="rounded-lg w-full h-60 object-cover border border-gray-200 transition-all duration-300 hover:shadow-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x250?text=Room+Image";
                        }}
                      />
                      <div className="absolute top-0 left-0 m-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        {selectedRoom.name}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                      <p className="text-gray-700 font-medium">Upcoming Reservations:</p>
                      <span className="text-orange-500 font-bold">{bookedDates.length}</span>
                    </div>
                    
                    <button
                      onClick={() => handleRoomAvailability()}
                      className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center justify-center"
                    >
                      <FaSearch className="mr-2" /> Manage This Room
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <FaTimesCircle className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-500 text-lg">No Room Selected</p>
                    <p className="text-gray-400 text-sm mt-2">Click on a room to see its availability</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Room Card Component
function RoomCard({ image, name, status, onSelect, isSelected }) {
  const isOccupied = status === "Occupied";
  const isAvailable = status === "Available";

  return (
    <div
      onClick={isOccupied ? undefined : onSelect}
      className={`cursor-pointer rounded-lg overflow-hidden shadow-lg transition-all duration-200 
        ${
          isOccupied
            ? "opacity-75 cursor-not-allowed"
            : isSelected
            ? "ring-4 ring-orange-400 transform scale-105"
            : "hover:shadow-xl hover:transform hover:scale-102"
        }`}
    >
      <div className="relative">
        <img
          src={image || "https://via.placeholder.com/400x250?text=Room+Image"}
          alt={name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x250?text=Room+Image";
          }}
        />
        <div className={`absolute top-0 right-0 m-2 px-3 py-1 rounded-full text-xs font-bold ${
          isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {status}
        </div>
      </div>
      
      <div className={`p-4 ${isSelected ? "bg-orange-100" : "bg-white"}`}>
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-bold text-gray-800">{name}</h4>
          {isSelected && <FaCheckCircle className="text-orange-500" />}
        </div>
        
        <div className="flex items-center mt-2">
          {isAvailable ? (
            <span className="text-green-500 text-sm font-medium flex items-center">
              <FaCheckCircle className="mr-1" /> Ready to Book
            </span>
          ) : (
            <span className="text-red-500 text-sm font-medium flex items-center">
              <FaTimesCircle className="mr-1" /> Currently Occupied
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;