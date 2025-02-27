import React from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Booking Data (Includes room types)
const bookingData = [
  { month: "January", standardDouble: 20, triple: 10, twin: 8, family: 7, revenue: 50000, guests: 200 },
  { month: "February", standardDouble: 25, triple: 12, twin: 10, family: 9, revenue: 48000, guests: 220 },
  { month: "March", standardDouble: 22, triple: 14, twin: 11, family: 8, revenue: 46000, guests: 210 },
  { month: "April", standardDouble: 28, triple: 15, twin: 12, family: 10, revenue: 53000, guests: 250 },
  { month: "May", standardDouble: 30, triple: 18, twin: 14, family: 12, revenue: 60000, guests: 270 },
  { month: "June", standardDouble: 35, triple: 20, twin: 16, family: 14, revenue: 67000, guests: 300 },
  { month: "July", standardDouble: 40, triple: 22, twin: 18, family: 16, revenue: 74000, guests: 320 },
  { month: "August", standardDouble: 38, triple: 21, twin: 17, family: 15, revenue: 78000, guests: 330 },
  { month: "September", standardDouble: 33, triple: 19, twin: 15, family: 13, revenue: 69000, guests: 280 },
  { month: "October", standardDouble: 28, triple: 17, twin: 13, family: 11, revenue: 62000, guests: 260 },
  { month: "November", standardDouble: 25, triple: 15, twin: 12, family: 10, revenue: 58000, guests: 240 },
  { month: "December", standardDouble: 22, triple: 13, twin: 11, family: 9, revenue: 55000, guests: 230 },
];

// Function to get the most booked room type
const getMostBookedRoomType = () => {
  const totalBookings = { standardDouble: 0, triple: 0, twin: 0, family: 0 };

  // Sum all bookings for each room type
  bookingData.forEach((data) => {
    totalBookings.standardDouble += data.standardDouble;
    totalBookings.triple += data.triple;
    totalBookings.twin += data.twin;
    totalBookings.family += data.family;
  });

  // Get the most booked room type
  const mostBooked = Object.keys(totalBookings).reduce((a, b) =>
    totalBookings[a] > totalBookings[b] ? a : b
  );

  const roomNames = {
    standardDouble: "Standard Double Room",
    triple: "Triple Room",
    twin: "Twin Room",
    family: "Family Room",
  };

  return roomNames[mostBooked]; // Return room type name
};

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 p-6">
      {/* Top Section: Most Booked Room Type (Left) & Check Room Availability (Right) */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        {/* Most Booked Room Type */}
        <div className="bg-white p-6 shadow-md rounded-lg w-80 text-center">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Most Booked Room Type</h3>
          <p className="text-2xl font-bold text-orange-500">{getMostBookedRoomType()}</p>
        </div>

        {/* Check Room Availability Button */}
        <button
          onClick={() => navigate("/admin/room-availability")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md shadow-md"
        >
          Check Room Availability
        </button>
      </div>

      {/* Room Bookings by Type */}
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-4xl mb-6">
        <h3 className="text-xl font-semibold mb-4 text-center">Room Bookings by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="standardDouble" stroke="blue" name="Standard Double Room" />
            <Line type="monotone" dataKey="triple" stroke="red" name="Triple Room" />
            <Line type="monotone" dataKey="twin" stroke="green" name="Twin Room" />
            <Line type="monotone" dataKey="family" stroke="purple" name="Family Room" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue & Guest Count */}
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4 text-center">Monthly Revenue and Guest Count</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="green" name="Revenue (Month)" />
            <Line type="monotone" dataKey="guests" stroke="gold" name="Total Guests (Month)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminHome;
