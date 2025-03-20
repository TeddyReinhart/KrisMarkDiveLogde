import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const BookRooms = () => {
  const [bookings, setBookings] = useState([]); // State to store all bookings
  const [filteredBookings, setFilteredBookings] = useState([]); // State to store filtered bookings
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filter, setFilter] = useState("all"); // State for filter (e.g., by room type)
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all"); // State for booking type filter
  const [selectedBooking, setSelectedBooking] = useState(null); // State to store the selected booking for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // State to control payment modal visibility
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // State to control confirmation modal visibility
  const [isLoading, setIsLoading] = useState(true); // State to indicate loading
  const [paymentDetails, setPaymentDetails] = useState({
    billingName: "",
    billingAddress: "",
    paymentMethod: "cash", // Default to cash
    gcashNumber: "", // Only required if paymentMethod is gcash
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  // Fetch bookings from Firestore
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const bookingsQuerySnapshot = await getDocs(collection(db, "bookings"));
      const bookingsData = bookingsQuerySnapshot.docs.map((doc) => {
        const data = doc.data();
        if (!data.guestInfo) {
          console.warn("Booking with missing guestInfo:", doc.id);
        }
        return {
          id: doc.id,
          ...data,
          guestInfo: data.guestInfo || {
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            gender: "",
            specialRequest: "",
          },
        };
      });

      setBookings(bookingsData);
      setFilteredBookings(bookingsData); // Initialize filtered bookings
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle search query changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query, filter, bookingTypeFilter);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    filterBookings(searchQuery, selectedFilter, bookingTypeFilter);
  };

  // Handle booking type filter changes
  const handleBookingTypeFilter = (type) => {
    setBookingTypeFilter(type);
    filterBookings(searchQuery, filter, type);
  };

  // Filter bookings based on search query, room filter, and booking type filter
  const filterBookings = (query, roomFilter, bookingType) => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.roomDetails?.name.toLowerCase().includes(query) ||
        booking.guestInfo.firstName.toLowerCase().includes(query) ||
        booking.guestInfo.lastName.toLowerCase().includes(query) ||
        booking.guestInfo.email.toLowerCase().includes(query);

      const matchesRoomFilter =
        roomFilter === "all" || booking.roomDetails?.name === roomFilter;

      const matchesBookingType =
        bookingType === "all" || booking.bookingType === bookingType;

      return matchesSearch && matchesRoomFilter && matchesBookingType;
    });
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle Check-out button click
  const handleCheckOutClick = (id) => {
    setSelectedBooking(id);
    setIsPaymentModalOpen(true); // Open payment modal
  };

  // Handle payment form input changes
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate the number of days stayed
  const calculateDaysStayed = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  };

  // Calculate the total amount
  const calculateTotalAmount = (roomRate, daysStayed) => {
    return roomRate * daysStayed;
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the booking data
      const bookingRef = doc(db, "bookings", selectedBooking);
      const bookingSnapshot = await getDoc(bookingRef);
      const bookingData = bookingSnapshot.data();

      // Calculate billing details
      const daysStayed = calculateDaysStayed(bookingData.checkInDate, bookingData.checkOutDate);
      const totalAmount = calculateTotalAmount(bookingData.roomDetails?.ratePerDay || 0, daysStayed);

      // Add the booking data to the bookingHistory collection with payment details
      await addDoc(collection(db, "bookingHistory"), {
        ...bookingData,
        checkOutTimestamp: new Date(), // Add a timestamp for when the check-out occurred
        paymentDetails: {
          ...paymentDetails,
          daysStayed,
          totalAmount,
        },
      });

      // Delete the booking from the bookings collection
      await deleteDoc(bookingRef);

      // Show confirmation modal
      setIsConfirmationModalOpen(true);
      setIsPaymentModalOpen(false); // Close payment modal
      setPaymentDetails({
        billingName: "",
        billingAddress: "",
        paymentMethod: "cash",
        gcashNumber: "",
      }); // Reset payment details

      fetchBookings(); // Refresh the list of bookings
    } catch (error) {
      console.error("Error during check-out and payment: ", error);
      alert("Failed to complete check-out and payment. Please try again.");
    }
  };

  // Open modal with booking details
  const openModal = (booking) => {
    setSelectedBooking(booking.id);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // Get the selected booking for the payment modal
  const selectedBookingData = filteredBookings.find((b) => b.id === selectedBooking);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Bookings</h1>

      {/* Filter and Search Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-end">
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full md:w-1/6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Rooms</option>
          {Array.from(new Set(bookings.map((booking) => booking.roomDetails?.name))).map((roomName) => (
            <option key={roomName} value={roomName}>
              {roomName}
            </option>
          ))}
        </select>

        {/* Booking Type Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleBookingTypeFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              bookingTypeFilter === "all" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleBookingTypeFilter("walk-in")}
            className={`px-4 py-2 rounded-lg ${
              bookingTypeFilter === "walk-in" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Walk-in
          </button>
          <button
            onClick={() => handleBookingTypeFilter("online")}
            className={`px-4 py-2 rounded-lg ${
              bookingTypeFilter === "online" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Online
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-orange-500">
            <tr>
              <th className="p-4 text-left text-gray-700 font-bold">Room</th>
              <th className="p-4 text-left text-gray-700 font-bold">Check-in</th>
              <th className="p-4 text-left text-gray-700 font-bold">Check-out</th>
              <th className="p-4 text-left text-gray-700 font-bold">Guests</th>
              <th className="p-4 text-left text-gray-700 font-bold">Guest Name</th>
              <th className="p-4 text-left text-gray-700 font-bold">Email</th>
              <th className="p-4 text-left text-gray-700 font-bold">Booking Type</th>
              <th className="p-4 text-left text-gray-700 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center p-16">
                  <div className="flex justify-end items-center pr-55">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-orange-500"></div>
                    <p className="text-gray-600 font-medium ml-3 animate-bounce">
                      Loading...
                    </p>
                  </div>
                </td>
              </tr>
            ) : currentBookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-600">
                  No bookings found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(booking)}
                >
                  <td className="p-4 text-gray-700">{booking.roomDetails?.name}</td>
                  <td className="p-4 text-gray-700">{booking.checkInDate}</td>
                  <td className="p-4 text-gray-700">{booking.checkOutDate}</td>
                  <td className="p-4 text-gray-700">{booking.numberOfGuests}</td>
                  <td className="p-4 text-gray-700">
                    {booking.guestInfo ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}` : "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">
                    {booking.guestInfo ? booking.guestInfo.email : "N/A"}
                  </td>
                  <td className="p-4 text-gray-700 capitalize">{booking.bookingType}</td>
                  <td className="p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click event
                        handleCheckOutClick(booking.id);
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      Check-out
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
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Booking Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        {/* Room Details */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Room</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.roomDetails?.name}</p>
          </div>
        </div>

        {/* Check-in Date */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Check-in</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.checkInDate}</p>
          </div>
        </div>

        {/* Check-out Date */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Check-out</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.checkOutDate}</p>
          </div>
        </div>

        {/* Number of Guests */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Number of Guests</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.numberOfGuests}</p>
          </div>
        </div>

        {/* Guest Name */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Guest Name</p>
            <p>
              {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.firstName}{" "}
              {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.lastName}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-pink-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.email}</p>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Mobile Number</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.mobileNumber}</p>
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Gender</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.gender}</p>
          </div>
        </div>

        {/* Special Request */}
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Special Request</p>
            <p>{filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.specialRequest}</p>
          </div>
        </div>
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

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedBookingData && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="space-y-4">
                {/* Room Rate, Days Stayed, and Total Cost */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Billing Summary</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Room Rate:</span>{" "}
                      ₱{selectedBookingData.roomDetails?.ratePerDay} per day
                    </p>
                    <p>
                      <span className="font-semibold">Days Stayed:</span>{" "}
                      {calculateDaysStayed(selectedBookingData.checkInDate, selectedBookingData.checkOutDate)} days
                    </p>
                    <p>
                      <span className="font-semibold">Total Cost:</span>{" "}
                      ₱{calculateTotalAmount(
                        selectedBookingData.roomDetails?.ratePerDay,
                        calculateDaysStayed(selectedBookingData.checkInDate, selectedBookingData.checkOutDate)
                      )}
                    </p>
                  </div>
                </div>

                {/* Payment Form */}
                <div>
                  <label className="block text-gray-700 font-semibold">Billing Name</label>
                  <input
                    type="text"
                    name="billingName"
                    value={paymentDetails.billingName}
                    onChange={handlePaymentInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Email Address</label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={paymentDetails.billingAddress}
                    onChange={handlePaymentInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={paymentDetails.paymentMethod}
                    onChange={handlePaymentInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="gcash">GCash</option>
                  </select>
                </div>
                {paymentDetails.paymentMethod === "gcash" && (
                  <div>
                    <label className="block text-gray-700 font-semibold">Ref. No.</label>
                    <input
                      type="text"
                      name="gcashNumber"
                      value={paymentDetails.gcashNumber}
                      onChange={handlePaymentInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 shadow-lg">
          <div className="bg-white p-6 rounded-lg shadow-2xl text-center relative">
            <h3 className="text-lg font-semibold">Payment Confirmed!</h3>
            <p className="text-gray-600 my-4">The payment has been successfully processed.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsConfirmationModalOpen(false)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRooms;