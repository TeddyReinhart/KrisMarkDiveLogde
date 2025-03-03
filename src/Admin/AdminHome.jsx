import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUsers, FaMoneyBillAlt, FaClock, FaChartPie, FaChartLine, FaExclamationCircle } from "react-icons/fa"; // Added FaExclamationCircle for complaints icon

const AdminHome = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);
  const [revenueData, setRevenueData] = useState([]); // State for revenue data
  const [mostBookedRoomType, setMostBookedRoomType] = useState("");
  const [metrics, setMetrics] = useState({
    totalBookings: 0, // Total number of bookings from bookingHistory
    totalRevenue: 0, // Total revenue from bookingHistory
    pendingPayments: 0, // Total entries in the bookings collection
    totalComplaints: 0, // Total number of complaints
  });

  // Fetch room types, booking history, bookings data, and complaints from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room types from the "rooms" collection
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const rooms = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch booking history from the "bookingHistory" collection
        const bookingsHistorySnapshot = await getDocs(collection(db, "bookingHistory"));
        const bookingsHistory = bookingsHistorySnapshot.docs.map((doc) => doc.data());

        // Fetch bookings from the "bookings" collection
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookings = bookingsSnapshot.docs.map((doc) => doc.data());

        // Fetch complaints from the "complaintReports" collection
        const complaintsSnapshot = await getDocs(collection(db, "complaintReports"));
        const totalComplaints = complaintsSnapshot.size; // Total number of complaints

        // Initialize room totals
        const roomTotals = {};
        rooms.forEach((room) => {
          roomTotals[room.name] = { bookings: 0, revenue: 0 };
        });

        // Calculate bookings and revenue for each room type
        bookingsHistory.forEach((booking) => {
          const roomName = booking.roomDetails?.name;
          if (roomTotals[roomName]) {
            roomTotals[roomName].bookings += 1;
            roomTotals[roomName].revenue += booking.paymentDetails?.totalAmount || 0;
          }
        });

        // Convert to array format for Recharts
        const dataArray = Object.keys(roomTotals).map((roomName) => ({
          name: roomName,
          bookings: roomTotals[roomName].bookings,
          revenue: roomTotals[roomName].revenue,
        }));

        setBookingData(dataArray);

        // Calculate most booked room type
        const mostBooked = Object.keys(roomTotals).reduce((a, b) =>
          roomTotals[a].bookings > roomTotals[b].bookings ? a : b
        );

        setMostBookedRoomType(mostBooked);

        // Calculate total bookings and revenue from bookingHistory
        const totalBookings = bookingsHistory.length;
        const totalRevenue = bookingsHistory.reduce(
          (sum, booking) => sum + (booking.paymentDetails?.totalAmount || 0),
          0
        );

        // Calculate pending payments (total entries in the bookings collection)
        const pendingPayments = bookings.length;

        // Update metrics
        setMetrics({
          totalBookings,
          totalRevenue,
          pendingPayments,
          totalComplaints, // Add total complaints to metrics
        });

        // Process revenue data for the line chart (group by month)
        const revenueByMonth = {};
        bookingsHistory.forEach((booking) => {
          const checkInDate = new Date(booking.checkInDate);
          const month = checkInDate.toLocaleString("default", { month: "short", year: "numeric" });

          if (!revenueByMonth[month]) {
            revenueByMonth[month] = 0;
          }
          revenueByMonth[month] += booking.paymentDetails?.totalAmount || 0;
        });

        // Convert to array format for Recharts
        const revenueArray = Object.keys(revenueByMonth).map((month) => ({
          month,
          revenue: revenueByMonth[month],
        }));

        setRevenueData(revenueArray);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Data for the pie chart (bookings by room type)
  const pieChartData = bookingData.map((room) => ({
    name: room.name,
    value: room.bookings,
  }));

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your bookings, revenue, and complaints.</p>
      </div>

      {/* Top Section: Metrics Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white p-6 shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <FaUsers className="text-4xl text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-500">{metrics.totalBookings}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <FaMoneyBillAlt className="text-4xl text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Total Revenue ($)</h3>
          <p className="text-2xl font-bold text-green-500">{metrics.totalRevenue}</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-6 shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <FaClock className="text-4xl text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Pending Payments ($)</h3>
          <p className="text-2xl font-bold text-yellow-500">{metrics.pendingPayments}</p>
        </div>

        {/* Total Complaints */}
        <div className="bg-white p-6 shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationCircle className="text-4xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Total Complaints</h3>
          <p className="text-2xl font-bold text-red-500">{metrics.totalComplaints}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Room Bookings (Pie Chart) */}
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaChartPie className="mr-2 text-blue-500" /> Room Bookings Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Room Revenue (Line Chart) */}
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-green-500" /> Room Revenue Over Time
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#00C49F" name="Revenue (₱)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full max-w-6xl text-center text-gray-600 mt-8">
        <p>© 2023 Admin Dashboard. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminHome;