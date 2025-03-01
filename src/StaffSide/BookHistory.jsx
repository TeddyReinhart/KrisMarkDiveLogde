import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import * as XLSX from "xlsx"; // For exporting to Excel

const BookHistory = () => {
  const [bookings, setBookings] = useState([]); // State to store all booking history
  const [filteredBookings, setFilteredBookings] = useState([]); // State to store filtered booking history
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filter, setFilter] = useState("all"); // State for filter (e.g., by room type)
  const [selectedBooking, setSelectedBooking] = useState(null); // State to store the selected booking for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isLoading, setIsLoading] = useState(true); // State to indicate loading

  // Fetch booking history from Firestore
  const fetchBookingHistory = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "bookingHistory"));
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
      setFilteredBookings(bookingsData); // Initialize filtered bookings
    } catch (error) {
      console.error("Error fetching booking history: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  // Handle search query changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query, filter);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    filterBookings(searchQuery, selectedFilter);
  };

  // Filter bookings based on search query and filter
  const filterBookings = (query, filter) => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.selectedRoom.toLowerCase().includes(query) ||
        booking.guestInfo.firstName.toLowerCase().includes(query) ||
        booking.guestInfo.lastName.toLowerCase().includes(query) ||
        booking.guestInfo.email.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || booking.selectedRoom === filter;

      return matchesSearch && matchesFilter;
    });
    setFilteredBookings(filtered);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Booking History");
    XLSX.writeFile(workbook, "booking_history.xlsx");
  };

  // Open modal with booking details
  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Booking History</h1>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by room, guest name, or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full md:w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Rooms</option>
          <option value="Deluxe Room">Deluxe Room</option>
          <option value="Standard Room">Standard Room</option>
          <option value="Suite">Suite</option>
        </select>
        <button
          onClick={exportToExcel}
          className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Export to Excel
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-gray-700 font-semibold">Room</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Check-in</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Check-out</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Guests</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Guest Name</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Email</th>
              <th className="p-4 text-left text-gray-700 font-semibold">Check-out Time</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-600">
                  No booking history found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(booking)}
                >
                  <td className="p-4 text-gray-700">{booking.selectedRoom}</td>
                  <td className="p-4 text-gray-700">{booking.checkInDate}</td>
                  <td className="p-4 text-gray-700">{booking.checkOutDate}</td>
                  <td className="p-4 text-gray-700">{booking.numberOfGuests}</td>
                  <td className="p-4 text-gray-700">
                    {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                  </td>
                  <td className="p-4 text-gray-700">{booking.guestInfo.email}</td>
                  <td className="p-4 text-gray-700">
                    {booking.checkOutTimestamp?.toDate().toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Details */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Details</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold">Room:</span>{" "}
                {selectedBooking.selectedRoom}
              </p>
              <p>
                <span className="font-semibold">Check-in:</span>{" "}
                {selectedBooking.checkInDate}
              </p>
              <p>
                <span className="font-semibold">Check-out:</span>{" "}
                {selectedBooking.checkOutDate}
              </p>
              <p>
                <span className="font-semibold">Number of Guests:</span>{" "}
                {selectedBooking.numberOfGuests}
              </p>
              <p>
                <span className="font-semibold">Guest Name:</span>{" "}
                {selectedBooking.guestInfo.firstName}{" "}
                {selectedBooking.guestInfo.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {selectedBooking.guestInfo.email}
              </p>
              <p>
                <span className="font-semibold">Mobile Number:</span>{" "}
                {selectedBooking.guestInfo.mobileNumber}
              </p>
              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {selectedBooking.guestInfo.gender}
              </p>
              <p>
                <span className="font-semibold">Special Request:</span>{" "}
                {selectedBooking.guestInfo.specialRequest}
              </p>
              <p>
                <span className="font-semibold">Check-out Time:</span>{" "}
                {selectedBooking.checkOutTimestamp?.toDate().toLocaleString()}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookHistory;