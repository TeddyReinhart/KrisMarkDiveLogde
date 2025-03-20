import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const BookRooms = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({
    billingName: "",
    billingAddress: "",
    paymentMethod: "cash",
    gcashNumber: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const bookingsQuerySnapshot = await getDocs(collection(db, "bookings"));
      const bookingsData = bookingsQuerySnapshot.docs.map((doc) => {
        const data = doc.data();
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
          roomDetails: data.roomDetails || {
            name: "",
            ratePerDay: 0,
            capacity: 0,
            image: "",
            status: "",
          },
        };
      });
  
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query, filter, bookingTypeFilter);
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    filterBookings(searchQuery, selectedFilter, bookingTypeFilter);
  };

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
    setCurrentPage(1);
  };
  const handleCheckOutClick = (id) => {
    setSelectedBooking(id);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDaysStayed = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const calculateTotalAmount = (roomRate, daysStayed) => {
    return roomRate * daysStayed;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingRef = doc(db, "bookings", selectedBooking);
      const bookingSnapshot = await getDoc(bookingRef);
      const bookingData = bookingSnapshot.data();

      const daysStayed = calculateDaysStayed(bookingData.checkInDate, bookingData.checkOutDate);
      const totalAmount = calculateTotalAmount(bookingData.roomDetails?.ratePerDay || 0, daysStayed);

      await addDoc(collection(db, "bookingHistory"), {
        ...bookingData,
        checkOutTimestamp: new Date(),
        paymentDetails: {
          ...paymentDetails,
          daysStayed,
          totalAmount,
        },
      });

      await deleteDoc(bookingRef);

      setIsConfirmationModalOpen(true);
      setIsPaymentModalOpen(false);
      setPaymentDetails({
        billingName: "",
        billingAddress: "",
        paymentMethod: "cash",
        gcashNumber: "",
      });

      fetchBookings();
    } catch (error) {
      console.error("Error during check-out and payment: ", error);
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const selectedBookingData = filteredBookings.find((b) => b.id === selectedBooking);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            onClick={() => setBookingTypeFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              bookingTypeFilter === "all" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setBookingTypeFilter("walk-in")}
            className={`px-4 py-2 rounded-lg ${
              bookingTypeFilter === "walk-in" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Walk-in
          </button>
          <button
            onClick={() => setBookingTypeFilter("online")}
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
              e.stopPropagation();
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
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slideIn">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <p className="text-sm text-gray-500 mt-1">Booking ID: {selectedBooking}</p>
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.checkInDate || 'N/A'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.checkOutDate || 'N/A'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.roomDetails?.name || 'N/A'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.numberOfGuests || 'N/A'} {parseInt(filteredBookings.find((b) => b.id === selectedBooking)?.numberOfGuests) > 1 ? 'persons' : 'person'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.firstName}{' '}
                        {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.lastName || 'N/A'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.email || 'N/A'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.mobileNumber || 'N/A'}
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
                        {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.gender || 'N/A'}
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
                  {filteredBookings.find((b) => b.id === selectedBooking)?.guestInfo.specialRequest || 'None specified'}
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

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedBookingData && (
  <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50 shadow-lg">
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