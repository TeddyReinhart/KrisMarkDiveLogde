import React from "react";
import { Bell } from "lucide-react";
import profile from "./images/profile.png";
import room from "./images/room4.png";

function Booking() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Booking Details Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Booking Details */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Booking Details</h2>
          <p><strong>Guest name:</strong> Mrs. Athena Kim</p>
          <p><strong>Booking #:</strong> 202513194714</p>
          <p><strong>Check in:</strong> 06 Jan @2pm</p>
          <p><strong>Check out:</strong> 08 Jan @12pm</p>
          <p><strong>Extras:</strong> Breakfast</p>

          <h2 className="text-xl font-bold mt-6">Payment Details</h2>
          <p><strong>Payment:</strong> Athena Kim</p>
          <p><strong>Date:</strong> 31 Dec 2025</p>
          <p><strong>Payment method:</strong> Bank (Metrobank)</p>
          <p><strong>Total:</strong> ₱7,840</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>

        {/* Stay Summary */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <img src={room} alt="Room" className="w-full rounded-lg" />
          <h2 className="text-xl font-bold mt-4">Stay Summary: Krismark Dive Lodge</h2>
          <p><strong>Guest:</strong> 6 Adults</p>
          <p><strong>Number of rooms:</strong> 1 room</p>
          <p><strong>Number of nights:</strong> 2 nights</p>
          <p><strong>Arrival date:</strong> 01-06-2025</p>
          <p><strong>Departure date:</strong> 01-08-2025</p>
          <p><strong>Reservation Policy:</strong> Free cancellation before 5 Jan, 6pm</p>
        </div>
      </div>
    </div>
  );
}

export default Booking;
