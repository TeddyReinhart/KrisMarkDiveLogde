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
  const [deleteType, setDeleteType] = useState(""); // 'single' or 'multiple'
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
    if (type === "multiple" && selectedBookings.length === 0) {
      alert("No bookings selected.");
      return;
    }

    setDeleteType(type);
    if (type === "single") {
      setBookingToDelete(id);
    }
    setIsConfirmModalOpen(true);
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setDeleteType("");
    setBookingToDelete(null);
  };

  // Delete selected bookings
  const deleteSelectedBookings = async () => {
    try {
      if (deleteType === "multiple") {
        for (const id of selectedBookings) {
          await deleteDoc(doc(db, "bookingHistory", id));
        }
        setBookings(bookings.filter((booking) => !selectedBookings.includes(booking.id)));
        setSelectedBookings([]); // Clear selection
      } else if (deleteType === "single" && bookingToDelete) {
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
          onClick={() => openConfirmModal("multiple")}
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
              <th className="p-4 text-left text-gray-700 font-bold w-1/6">Booking Type</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/6">Check-out Time</th>
              <th className="p-4 text-left text-gray-700 font-bold w-1/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="text-center p-16">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
                    <p className="text-gray-600 font-medium ml-3">Loading...</p>
                  </div>
                </td>
              </tr>
            ) : currentBookings.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-6 text-center text-gray-600">
                  No booking history found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(booking)} // Make the entire row clickable
                >
                  <td className="p-4 text-gray-700 w-1/12">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleSelectBooking(booking.id);
                      }}
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
                  <td className="p-4 text-gray-700 w-1/6">{booking.bookingType}</td>
                  <td className="p-4 text-gray-700 w-1/6">
                    {booking.checkOutTimestamp?.toDate().toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700 w-1/12">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        openConfirmModal("single", booking.id);
                      }}
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
              currentPage === index + 1 ? "text-orange font-bold" : "bg-gray-200 text-gray-700"
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
  <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideIn">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <p className="text-sm text-gray-500 mt-1">Booking ID: {selectedBooking.id}</p>
        </div>
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Booking Summary Card */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-orange-400 font-medium">CHECK-IN</p>
                <p className="text-gray-800 font-semibold">
                  {selectedBooking.checkInDate || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-orange-500 font-medium">CHECK-OUT</p>
                <p className="text-gray-800 font-semibold">
                  {selectedBooking.checkOutDate || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Details</h3>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Room</p>
                <p className="text-gray-600">
                  {selectedBooking.selectedRoom || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Guests</p>
                <p className="text-gray-600">
                  {selectedBooking.numberOfGuests || 'N/A'} {parseInt(selectedBooking.numberOfGuests) > 1 ? 'persons' : 'person'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Guest Information</h3>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Guest Name</p>
                <p className="text-gray-600">
                  {selectedBooking.guestInfo.firstName}{' '}
                  {selectedBooking.guestInfo.lastName || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-gray-600 break-all">
                  {selectedBooking.guestInfo.email || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Mobile</p>
                <p className="text-gray-600">
                  {selectedBooking.guestInfo.mobileNumber || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Gender</p>
                <p className="text-gray-600">
                  {selectedBooking.guestInfo.gender || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Request Section */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="font-semibold text-gray-800">Special Request</h3>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">
            {selectedBooking.guestInfo.specialRequest || 'None specified'}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
        <button
          onClick={closeModal}
          className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Confirmation Modal for Deletion */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="mb-6 text-gray-70">
              {deleteType === "multiple" 
                ? `Are you sure you want to delete ${selectedBookings.length} selected booking(s)?` 
                : "Are you sure you want to delete this booking?"
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