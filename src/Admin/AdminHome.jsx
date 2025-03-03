import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FaUsers, FaMoneyBillAlt, FaClock, FaChartPie, FaChartLine, FaExclamationCircle, FaMoneyCheckAlt, FaCoins } from "react-icons/fa"; // Added FaCoins for net income

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
    totalExpenses: 0, // Total expenses
    monthlyNetIncome: 0, // Monthly net income
  });

  // Expense Tracker State
  const [expenses, setExpenses] = useState([]); // State to store expenses
  const [title, setTitle] = useState(""); // State for expense title
  const [amount, setAmount] = useState(""); // State for expense amount
  const [type, setType] = useState("Expense"); // State for expense type
  const [loading, setLoading] = useState(false); // Loading state

  // Time Period Filter State
  const [timePeriod, setTimePeriod] = useState("monthly"); // "monthly" or "yearly"
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month (YYYY-MM)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // Default to current year

  // Fetch room types, booking history, bookings data, complaints, and expenses from Firestore
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

        // Filter bookings based on the selected time period
        const filteredBookings = bookingsHistory.filter((booking) => {
          const checkInDate = new Date(booking.checkInDate);
          if (timePeriod === "monthly") {
            return checkInDate.toISOString().slice(0, 7) === selectedMonth;
          } else {
            return checkInDate.getFullYear().toString() === selectedYear;
          }
        });

        // Fetch bookings from the "bookings" collection
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookings = bookingsSnapshot.docs.map((doc) => doc.data());

        // Fetch complaints from the "complaintReports" collection
        const complaintsSnapshot = await getDocs(collection(db, "complaintReports"));
        const totalComplaints = complaintsSnapshot.size; // Total number of complaints

        // Fetch expenses from the "expenses" collection
        const expensesSnapshot = await getDocs(collection(db, "expenses"));
        const expensesData = expensesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(expensesData);

        // Calculate total expenses
        const totalExpenses = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0);

        // Initialize room totals
        const roomTotals = {};
        rooms.forEach((room) => {
          roomTotals[room.name] = { bookings: 0, revenue: 0 };
        });

        // Calculate bookings and revenue for each room type
        filteredBookings.forEach((booking) => {
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

        // Calculate total bookings and revenue from filtered bookings
        const totalBookings = filteredBookings.length;
        const totalRevenue = filteredBookings.reduce(
          (sum, booking) => sum + (booking.paymentDetails?.totalAmount || 0),
          0
        );

        // Calculate pending payments (total entries in the bookings collection)
        const pendingPayments = bookings.length;

        // Calculate monthly net income
        const monthlyNetIncome = totalRevenue - totalExpenses;

        // Update metrics
        setMetrics({
          totalBookings,
          totalRevenue,
          pendingPayments,
          totalComplaints, // Add total complaints to metrics
          totalExpenses, // Add total expenses to metrics
          monthlyNetIncome, // Add monthly net income to metrics
        });

        // Process revenue data for the line chart (group by month or year)
        const revenueByTime = {};
        filteredBookings.forEach((booking) => {
          const checkInDate = new Date(booking.checkInDate);
          const timeKey =
            timePeriod === "monthly"
              ? checkInDate.toLocaleString("default", { month: "short", year: "numeric" })
              : checkInDate.getFullYear().toString();

          if (!revenueByTime[timeKey]) {
            revenueByTime[timeKey] = 0;
          }
          revenueByTime[timeKey] += booking.paymentDetails?.totalAmount || 0;
        });

        // Convert to array format for Recharts
        const revenueArray = Object.keys(revenueByTime).map((timeKey) => ({
          timeKey,
          revenue: revenueByTime[timeKey],
        }));

        setRevenueData(revenueArray);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [timePeriod, selectedMonth, selectedYear]); // Re-fetch data when time period, month, or year changes

  // Handle expense form submission
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // Add expense to Firestore
      await addDoc(collection(db, "expenses"), {
        title,
        amount: parseFloat(amount),
        type,
        createdAt: new Date().toISOString(),
      });

      // Reset form and fetch updated expenses
      setTitle("");
      setAmount("");
      setType("Expense");
      const expensesSnapshot = await getDocs(collection(db, "expenses"));
      const expensesData = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expensesData);

      // Update total expenses and monthly net income in metrics
      const totalExpenses = expensesData.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      const monthlyNetIncome = metrics.totalRevenue - totalExpenses;
      setMetrics((prev) => ({ ...prev, totalExpenses, monthlyNetIncome }));
    } catch (error) {
      console.error("Error adding expense: ", error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {timePeriod === "monthly" ? (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          ) : (
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              min="2020"
              max={new Date().getFullYear()}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          )}
        </div>
      </div>

      {/* Top Section: Metrics Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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

        {/* Monthly Net Income */}
        <div className="bg-white p-6 shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-center mb-4">
            <FaCoins className="text-4xl text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Monthly Net Income ($)</h3>
          <p className="text-2xl font-bold text-purple-500">{metrics.monthlyNetIncome}</p>
        </div>
      </div>

      {/* Middle Section: Expense Tracker and Charts */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Expense Tracker Card */}
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaMoneyCheckAlt className="mr-2 text-purple-500" /> Expense Tracker
          </h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="Expense">Expense</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-all"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>

        {/* Room Bookings (Pie Chart) */}
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow md:col-span-2">
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
      </div>

      {/* Bottom Section: Room Revenue Line Chart and Expense History */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Room Revenue (Line Chart) */}
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-green-500" /> Room Revenue Over Time
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
              <XAxis dataKey="timeKey" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#00C49F" name="Revenue (₱)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense History */}
        <div className="bg-white p-6 shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaMoneyCheckAlt className="mr-2 text-purple-500" /> Expense History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="p-2 text-left text-sm font-semibold text-gray-700">Type</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="p-2 text-sm text-gray-700">{expense.title}</td>
                    <td className="p-2 text-sm text-gray-700">₱ {expense.amount}</td>
                    <td className="p-2 text-sm text-gray-700">{expense.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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