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
  const [onlineBookings, setOnlineBookings] = useState([]); // State to store online bookings
  const [filter, setFilter] = useState("pending"); // State for tab filter (pending, confirmed, declined)
  const [isLoading, setIsLoading] = useState(true); // State to indicate loading

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
          className={`px-4 py-2 rounded-lg ${
            filter === "pending"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("confirmed")}
          className={`px-4 py-2 rounded-lg ${
            filter === "confirmed"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter("declined")}
          className={`px-4 py-2 rounded-lg ${
            filter === "declined"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Declined
        </button>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-orange-500">
            <tr>
              <th className="p-4 text-left text-gray-700 font-bold">Room</th>
              <th className="p-4 text-left text-gray-700 font-bold">
                Check-in
              </th>
              <th className="p-4 text-left text-gray-700 font-bold">
                Check-out
              </th>
              <th className="p-4 text-left text-gray-700 font-bold">Guests</th>
              <th className="p-4 text-left text-gray-700 font-bold">
                Guest Name
              </th>
              <th className="p-4 text-left text-gray-700 font-bold">Email</th>
              <th className="p-4 text-left text-gray-700 font-bold">Status</th>
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
                  <td className="p-4 text-gray-700">
                    {booking.roomDetails?.name}
                  </td>
                  <td className="p-4 text-gray-700">{booking.checkInDate}</td>
                  <td className="p-4 text-gray-700">{booking.checkOutDate}</td>
                  <td className="p-4 text-gray-700">
                    {booking.numberOfGuests}
                  </td>
                  <td className="p-4 text-gray-700">
                    {booking.guestInfo
                      ? `${booking.guestInfo.firstName} ${booking.guestInfo.lastName}`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">
                    {booking.guestInfo ? booking.guestInfo.email : "N/A"}
                  </td>
                  <td className="p-4 text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
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
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaCheckCircle className="inline-block mr-2" />
                          Confirm
                        </button>
                        <button
                          onClick={() => handleDeclineBooking(booking)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaTimesCircle className="inline-block mr-2" />
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
