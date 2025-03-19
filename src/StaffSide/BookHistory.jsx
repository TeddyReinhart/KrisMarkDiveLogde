import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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
  const [selectedBookings, setSelectedBookings] = useState([]); // State to store selected bookings for deletion
  
  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(''); // 'single' or 'multiple'
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Time Period Filter State
  const [timePeriod, setTimePeriod] = useState("monthly"); // "monthly" or "yearly"
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month (YYYY-MM)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // Default to current year

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

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
      filterBookings(bookingsData, searchQuery, filter, timePeriod, selectedMonth, selectedYear);
    } catch (error) {
      console.error("Error fetching booking history: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, [timePeriod, selectedMonth, selectedYear]); // Re-fetch data when time period, month, or year changes

  // Handle search query changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(bookings, query, filter, timePeriod, selectedMonth, selectedYear);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    filterBookings(bookings, searchQuery, selectedFilter, timePeriod, selectedMonth, selectedYear);
  };

  // Handle time period changes
  const handleTimePeriodChange = (e) => {
    setTimePeriod(e.target.value);
  };

  // Handle month changes
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Handle year changes
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Filter bookings based on search query, filter, time period, month, and year
  const filterBookings = (bookings, query, filter, timePeriod, month, year) => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.selectedRoom.toLowerCase().includes(query) ||
        booking.guestInfo.firstName.toLowerCase().includes(query) ||
        booking.guestInfo.lastName.toLowerCase().includes(query) ||
        booking.guestInfo.email.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" || booking.selectedRoom === filter;

      const bookingDate = new Date(booking.checkInDate);
      const matchesTimePeriod =
        timePeriod === "monthly"
          ? bookingDate.toISOString().slice(0, 7) === month
          : bookingDate.getFullYear().toString() === year;

      return matchesSearch && matchesFilter && matchesTimePeriod;
    });
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
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

  // Open confirmation modal for deletion
  const openConfirmModal = (type, id = null) => {
    if (type === 'multiple' && selectedBookings.length === 0) {
      alert("No bookings selected.");
      return;
    }
    
    setDeleteType(type);
    if (type === 'single') {
      setBookingToDelete(id);
    }
    setIsConfirmModalOpen(true);
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setDeleteType('');
    setBookingToDelete(null);
  };

  // Delete selected bookings
  const deleteSelectedBookings = async () => {
    try {
      if (deleteType === 'multiple') {
        for (const id of selectedBookings) {
          await deleteDoc(doc(db, "bookingHistory", id));
        }
        setBookings(bookings.filter((booking) => !selectedBookings.includes(booking.id)));
        setSelectedBookings([]); // Clear selection
      } else if (deleteType === 'single' && bookingToDelete) {
        await deleteDoc(doc(db, "bookingHistory", bookingToDelete));
        setBookings(bookings.filter((booking) => booking.id !== bookingToDelete));
      }
      
      fetchBookingHistory(); // Refresh data
      closeConfirmModal();
    } catch (error) {
      console.error("Error deleting bookings: ", error);
      alert("Failed to delete bookings. Please try again.");
      closeConfirmModal();
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Handle individual booking selection
  const handleSelectBooking = (id) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(selectedBookings.filter((bookingId) => bookingId !== id));
    } else {
      setSelectedBookings([...selectedBookings, id]);
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (selectedBookings.length === currentBookings.length) {
      setSelectedBookings([]); // Deselect all
    } else {
      setSelectedBookings(currentBookings.map((booking) => booking.id)); // Select all
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Booking History</h1>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 ml-auto justify-end">
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full md:w-1/8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Rooms</option>
          {Array.from(new Set(bookings.map((booking) => booking.roomDetails?.name))).map((roomName) => (
            <option key={roomName} value={roomName}>
              {roomName}
            </option>
          ))}
        </select>
        <select
          value={timePeriod}
          onChange={handleTimePeriodChange}
          className="w-full md:w-1/8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        {timePeriod === "monthly" ? (
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full md:w-1/8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
            min="2020"
            max={new Date().getFullYear()}
            className="w-full md:w-1/8 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        <button
          onClick={exportToExcel}
          className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Export to Excel
        </button>
        <button
          onClick={() => openConfirmModal('multiple')}
          className="w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Selected
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-orange-500">
            <tr>
              <th className="p-4 text-left text-gray-700 font-bold w-1/12">
                <input
                  type="checkbox"
                  checked={selectedBookings.length === currentBookings.length && currentBookings.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/8">Room</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/8">Check-in</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/8">Check-out</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/12">Guests</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/6">Guest Name</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/4">Email</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/6">Check-out Time</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/12">Actions</th>
            </tr>
          </thead>
          <tbody>
          {isLoading ? (
          <tr>
            <td colSpan="9" className="text-center p-16">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
                <p className="text-gray-600 font-medium ml-3 ">
                Loading...
              </p>
              </div>
            </td>
          </tr>
        ) : currentBookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-600">
                  No booking history found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-700 w-1/12">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                    />
                  </td>
                  <td className="p-4 text-gray-700 w-1/8">{booking.selectedRoom}</td>
                  <td className="p-4 text-gray-700 w-1/8">{booking.checkInDate}</td>
                  <td className="p-4 text-gray-700 w-1/8">{booking.checkOutDate}</td>
                  <td className="p-4 text-gray-700 w-1/12">{booking.numberOfGuests}</td>
                  <td className="p-4 text-gray-700 w-1/6">
                    {booking.guestInfo.firstName} {booking.guestInfo.lastName}
                  </td>
                  <td className="p-4 text-gray-700 w-1/4">{booking.guestInfo.email}</td>
                  <td className="p-4 text-gray-700 w-1/6">
                    {booking.checkOutTimestamp?.toDate().toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700 w-1/12">
                    <button
                      onClick={() => openConfirmModal('single', booking.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1 ? 'text-orange font-bold' : 'bg-gray-200 text-gray-700'
            } rounded-lg`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 text-gray-700 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal for Full Details */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* Confirmation Modal for Deletion */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700">
              {deleteType === 'multiple' 
                ? `Are you sure you want to delete ${selectedBookings.length} selected booking(s)?` 
                : 'Are you sure you want to delete this booking?'
              }
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteSelectedBookings}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookHistory;