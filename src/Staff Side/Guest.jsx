import React, { useContext } from "react";
import { BookingContext } from "./BookingContext";
import room from "../images/room4.png";

function Guest() {
  const { bookingData } = useContext(BookingContext);

  if (!bookingData) {
    return <p className="text-center text-lg text-gray-500 mt-6">No booking found.</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-gray-200 p-4 rounded-md">
        <div>
          <h1 className="text-2xl font-bold">{bookingData.firstName} {bookingData.lastName}</h1>
          <p className="text-gray-500">Guest</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
          + Create new booking
        </button>
      </div>

      {/* Booking Information */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-bold mb-4">{bookingData.firstName} {bookingData.lastName}</h2>
          <p><strong>Booking #:</strong> {bookingData.bookingNumber}</p>
          <p><strong>Date:</strong> {bookingData.bookingDate}</p>
          <p><strong>Room Type:</strong> {bookingData.roomType}</p>
          <p><strong>Status:</strong> 
            <span className="ml-2 text-orange-500 font-semibold">{bookingData.status}</span>
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Booking Summary</h2>
          <p><strong>Room Total (2 nights):</strong> ₱{bookingData.roomTotal}</p>
          <p><strong>Extra Person:</strong> ₱{bookingData.extraPerson}</p>
          <p><strong>Extras:</strong> ₱{bookingData.extras}</p>

          <hr className="my-2" />

          <p><strong>Subtotal:</strong> ₱{bookingData.subtotal}</p>
          <p><strong>Discount:</strong> {bookingData.discount}% off</p>

          <h2 className="text-xl font-bold mt-2 text-orange-500">
            Total: ₱{bookingData.total}
          </h2>
        </div>
      </div>

      {/* Room Image */}
      <div className="mt-6 flex flex-col items-center">
        <img src={room} alt="Room" className="rounded-lg w-1/2" />
        <button className="border border-gray-500 mt-2 px-4 py-2 rounded-md">
          More Info
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button className="bg-gray-300 px-6 py-2 rounded-md">Completed</button>
        <button className="bg-gray-300 px-6 py-2 rounded-md">Cancel</button>
      </div>
    </div>
  );
}

export default Guest;
