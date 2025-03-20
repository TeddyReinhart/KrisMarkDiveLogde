import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function OnlineBookings() {
  const [onlineBookings, setOnlineBookings] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch online bookings from Firestore
  const fetchOnlineBookings = async () => {
    setIsLoading(true);
    try {
      const onlineBookingsRef = collection(db, "onlinebooking");
      const querySnapshot = await getDocs(onlineBookingsRef);
      const bookingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort bookings by timestamp (newest first)
      bookingsData.sort((a, b) => b.timestamp - a.timestamp);
      setOnlineBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching online bookings: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineBookings();
  }, []);

  // Handle confirm booking
  const handleConfirmBooking = async (booking) => {
    try {
      // Restructure the booking data to match the BookingForm structure
      const bookingData = {
        selectedRoom: booking.roomDetails?.name, // Ensure this matches the BookingForm structure
        roomDetails: booking.roomDetails || {
          name: booking.roomDetails?.name,
          ratePerDay: booking.roomDetails?.ratePerDay,
          capacity: booking.roomDetails?.capacity,
          image: booking.roomDetails?.image,
          status: booking.roomDetails?.status,
        },
        checkInDate: booking.checkInDate, // Ensure this is a valid date string or Date object
        checkOutDate: booking.checkOutDate, // Ensure this is a valid date string or Date object
        numberOfGuests: booking.numberOfGuests,
        guestInfo: booking.guestInfo || {
          firstName: booking.guestInfo?.firstName,
          lastName: booking.guestInfo?.lastName,
          email: booking.guestInfo?.email,
          mobileNumber: booking.guestInfo?.mobileNumber,
          specialRequest: booking.guestInfo?.specialRequest || "None",
        },
        status: "confirmed", // Add status field
        timestamp: new Date(), // Add current timestamp
        bookingType: "online", // Set booking type to "online"
      };

      // Add the booking to the "bookings" collection
      const bookingsRef = collection(db, "bookings");
      await addDoc(bookingsRef, bookingData);

      // Remove the booking from the "onlineBookings" collection
      const bookingRef = doc(db, "onlinebooking", booking.id);
      await deleteDoc(bookingRef);

      // Refresh the list of online bookings
      fetchOnlineBookings();
      alert("Booking confirmed and moved to bookings!");
    } catch (error) {
      console.error("Error confirming booking: ", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  // Handle decline booking
  const handleDeclineBooking = async (booking) => {
    try {
      // Restructure the booking data to match the BookingForm structure
      const bookingData = {
        selectedRoom: booking.roomDetails?.name,
        roomDetails: booking.roomDetails || {
          name: booking.roomDetails?.name,
          ratePerDay: booking.roomDetails?.ratePerDay,
          capacity: booking.roomDetails?.capacity,
          image: booking.roomDetails?.image,
          status: booking.roomDetails?.status,
        },
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        numberOfGuests: booking.numberOfGuests,
        guestInfo: booking.guestInfo || {
          firstName: booking.guestInfo?.firstName,
          lastName: booking.guestInfo?.lastName,
          email: booking.guestInfo?.email,
          mobileNumber: booking.guestInfo?.mobileNumber,
          specialRequest: booking.guestInfo?.specialRequest || "None",
        },
        status: "declined", // Add status field
        timestamp: new Date(), // Add current timestamp
        bookingType: "online", // Set booking type to "online"
      };

      // Add the booking to the "declinedBookings" collection
      const declinedBookingsRef = collection(db, "declinedBookings");
      await addDoc(declinedBookingsRef, bookingData);

      // Remove the booking from the "onlineBookings" collection
      const bookingRef = doc(db, "onlinebooking", booking.id);
      await deleteDoc(bookingRef);

      // Refresh the list of online bookings
      fetchOnlineBookings();
      alert("Booking declined and moved to declined bookings!");
    } catch (error) {
      console.error("Error declining booking: ", error);
      alert("Failed to decline booking. Please try again.");
    }
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

  // Filter bookings based on the selected tab
  const filteredBookings = onlineBookings.filter((booking) => {
    if (filter === "pending") return booking.status === "pending";
    if (filter === "confirmed") return booking.status === "confirmed";
    if (filter === "declined") return booking.status === "declined";
    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Online Bookings</h1>

      {/* Tab Filter Buttons */}
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setFilter("pending")}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
            filter === "pending"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
            filter === "confirmed"
              ? "bg-green-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter("declined")}
          className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
            filter === "declined"
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Declined
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Room
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Check-in
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Check-out
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Guests
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Guest Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center p-16">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
                    <p className="text-gray-600 font-medium ml-3">Loading...</p>
                  </div>
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-600">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(booking)} // Make the entire row clickable
                >
                  <td className="p-4 text-sm text-gray-700">{booking.roomDetails?.name}</td>
                  <td className="p-4 text-sm text-gray-700">{booking.checkInDate}</td>
                  <td className="p-4 text-sm text-gray-700">{booking.checkOutDate}</td>
                  <td className="p-4 text-sm text-gray-700">{booking.numberOfGuests}</td>
                  <td className="p-4 text-sm text-gray-700">
                    {booking.guestInfo
                      ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {booking.guestInfo ? booking.guestInfo.email : "N/A"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {booking.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event from firing
                            handleConfirmBooking(booking);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <FaCheckCircle className="inline-block" />
                          Confirm
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event from firing
                            handleDeclineBooking(booking);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <FaTimesCircle className="inline-block" />
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Booking Details */}
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
                        {selectedBooking.roomDetails?.name || 'N/A'}
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
    </div>
  );
}

export default OnlineBookings;