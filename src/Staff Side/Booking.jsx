import React, { useContext } from "react";
import { BookingContext } from "./BookingContext"; 
import room from "../images/room4.png"; // Assuming your image path is correct

function Booking() {
  const { bookingData } = useContext(BookingContext); // Access the booking data from context

  // Loading state
  if (!bookingData) {
    return <p className="text-center text-lg text-gray-500 mt-6">No booking found.</p>;
  }

  // Edge case: No booking data available
  if (Object.keys(bookingData).length === 0) {
    return <p className="text-center text-lg text-gray-500 mt-6">No booking found.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Booking Details Section */}
        <div className="p-6 bg-white shadow-md rounded-lg border border-blue-300">
          <h2 className="text-xl font-bold mb-4">Booking Details</h2>
          
          <p><strong>Guest Name:</strong> {bookingData.firstName || "N/A"} {bookingData.lastName || "N/A"}</p>
          <p><strong>Mobile Number:</strong> {bookingData.mobileNumber || "N/A"}</p>
          <p><strong>Email:</strong> {bookingData.email || "N/A"}</p>
          <p><strong>Special Request:</strong> {bookingData.specialRequest || "None"}</p>

          <h2 className="text-xl font-bold mt-6">Payment Details</h2>
          <p><strong>Account Name:</strong> {bookingData.nameOnCard || "N/A"}</p>
          
          <p>
            <strong>Account No.:</strong>
            {bookingData.creditCardNumber 
              ? `**** **** **** ${bookingData.creditCardNumber.slice(-4)}`
              : "N/A"}
          </p>
        </div>

        {/* Stay Summary Section */}
        <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300">
          <img src={room} alt="Room" className="w-full rounded-lg mb-4" />
          
          <h2 className="text-xl font-bold mb-2">Stay Summary: Krismark Dive Lodge</h2>
          
          <p><strong>Check-in Date:</strong> {bookingData.checkIn || "N/A"}</p>
          <p><strong>Check-out Date:</strong> {bookingData.checkOut || "N/A"}</p>
          <p><strong>Number of Guests:</strong> {bookingData.guests || "N/A"}</p>
          <p><strong>Number of Rooms:</strong> {bookingData.rooms || "N/A"}</p>
          <p><strong>Payment Status:</strong> {bookingData.paymentStatus || "Pending"}</p>
        </div>
      </div>
    </div>
  );
}

export default Booking;
