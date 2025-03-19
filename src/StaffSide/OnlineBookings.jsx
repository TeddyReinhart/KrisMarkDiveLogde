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
      // Add the booking to the "bookings" collection
      const bookingsRef = collection(db, "bookings");
      await addDoc(bookingsRef, { ...booking, status: "confirmed" });

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
      // Add the booking to the "declinedBookings" collection
      const declinedBookingsRef = collection(db, "declinedBookings");
      await addDoc(declinedBookingsRef, { ...booking, status: "declined" });

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
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-700">
                    {booking.roomDetails?.name}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {booking.checkInDate}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {booking.checkOutDate}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {booking.numberOfGuests}
                  </td>
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
                          onClick={() => handleConfirmBooking(booking)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <FaCheckCircle className="inline-block" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleDeclineBooking(booking)}
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
    </div>
  );
}

export default OnlineBookings;