import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaWifi,
  FaSnowflake,
  FaUserFriends,
  FaBath,
  FaMoneyBillAlt,
  FaSearch,
  FaFilter,
  FaChevronDown,
  FaCalendarAlt,
  FaInfoCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

function RoomAvailability() {
  const [roomsState, setRoomsState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [expandedRoomId, setExpandedRoomId] = useState(null);
  const navigate = useNavigate();

  // Fetch rooms from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const roomsCollection = collection(db, "rooms");
        const roomsSnapshot = await getDocs(roomsCollection);
        const roomsData = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isExpanded: false
        }));
        setRoomsState(roomsData);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Toggle availability status and update Firestore
  const toggleAvailability = async (roomId, currentStatus) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      const newStatus =
        currentStatus === "Available" ? "Unavailable" : "Available";

      await updateDoc(roomRef, {
        status: newStatus,
      });
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
    navigate("/home/rooms-availability/booking-form", { state: { selectedRoom: room } });
  };

  // Toggle expand/collapse for a room card
  const toggleExpand = (roomId, e) => {
    e.stopPropagation();
    setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
  };

  // Filter rooms based on search term and status filter
  const filteredRooms = roomsState.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || room.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-600 border-green-200";
      case "Unavailable":
        return "bg-red-100 text-red-600 border-red-200";
      case "Limited Availability":
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      case "Occupied":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-gray-50 min-h-screen">
      {/* Header with Back button and Room Availability heading */}
      <div className=" z-10 shadow-md p-4 backdrop-blur bg-opacity-90 bg-gradient-to-r from-orange-300 to-white rounded-2xl">
      <div className="max-w-7xl mx-auto">
       <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="text-orange-500 cursor-pointer text-2xl flex items-center hover:text-orange-600 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
              </button>
              <h2 className="text-3xl font-bold text-black">Room Availability</h2>  
               </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by room name..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <FaFilter className="text-orange-500" />
                <select
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Limited Availability">Limited Availability</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Loader with animated text */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center my-16">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium mt-6 text-lg">
              Discovering available rooms...
            </p>
          </div>
        )}

        {/* No results message */}
        {!isLoading && filteredRooms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md p-8 mt-6">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-medium text-gray-600">No rooms match your search</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilter('All');}}
              className="mt-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        {!isLoading && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer ${
                  expandedRoomId === room.id ? 'scale-105 z-10 shadow-xl' : ''
                }`}
                onClick={(e) => toggleExpand(room.id, e)}
              >
                {/* Image and Status Badge Container */}
                <div className="relative">
                  <img
                    src={room.image || "https://via.placeholder.com/400x250?text=Room+Image"}
                    alt={room.name}
                    className="w-full h-60 object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250?text=Room+Image";
                    }}
                  />
                  {/* Availability Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold shadow-md ${getStatusColor(room.status)}`}
                  >
                    {room.status}
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{room.name}</h3>
                    <div 
                      className={`text-orange-500 p-1 rounded-full hover:bg-orange-50 transition-transform duration-300 ${
                        expandedRoomId === room.id ? 'rotate-180' : ''
                      }`}
                    >
                      <FaChevronDown />
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${
                    expandedRoomId === room.id ? 'max-h-96' : 'max-h-24'
                  }`}>
                    <div className="flex flex-wrap gap-y-2">
                      <div className="w-1/2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaUserFriends className="text-orange-500" /> 
                          <span>{room.guests} guests</span>
                        </p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaBath className="text-orange-500" /> 
                          <span>Private Bath</span>
                        </p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaSnowflake className="text-orange-500" /> 
                          <span>AC</span>
                        </p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaWifi className="text-orange-500" /> 
                          <span>Free WiFi</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Expanded content */}
                    {expandedRoomId === room.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                          <FaInfoCircle className="text-orange-500" />
                          Room Description
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {room.description || "Experience the perfect blend of comfort and luxury in our well-appointed room, designed to make your stay truly memorable."}
                        </p>
                        
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                          <FaCalendarAlt className="text-orange-500" />
                          Availability
                        </h4>
                        <p className="text-gray-600 text-sm">
                          This room is currently <span className={`font-medium ${room.status === "Available" ? "text-green-600" : "text-red-600"}`}>{room.status.toLowerCase()}</span>. 
                          {room.status === "Available" ? " Click to book now and secure your stay." : " Check back later for availability."}
                        </p>
                        
                        {/* Book Now Button (only shown in expanded view and for available rooms) */}
                        {room.status === "Available" && (
                          <button
                            className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRoomClick(room);
                            }}
                          >
                            Book This Room
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-orange-500 flex items-center">
                      <FaMoneyBillAlt className="mr-1" /> 
                      ₱{room.ratePerDay?.toLocaleString() || "N/A"}
                      <span className="text-xs text-gray-500 ml-1">/night</span>
                    </p>
                    
                    {/* Availability Status Toggle Button */}
                    <button
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(room.status)} hover:opacity-90 transition-all shadow-sm`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAvailability(room.id, room.status);
                      }}
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomAvailability;