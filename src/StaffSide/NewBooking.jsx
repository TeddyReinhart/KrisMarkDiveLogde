import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NewBooking() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [roomChoice, setRoomChoice] = useState(""); // Room selection field
  const navigate = useNavigate();

  const calculateNights = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const checkInDateObj = new Date(checkIn);
      const checkOutDateObj = new Date(checkOut);
      const diffTime = checkOutDateObj - checkInDateObj;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleDateChange = (type, value) => {
    if (type === "checkIn") {
      setCheckInDate(value);
    } else {
      setCheckOutDate(value);
    }
    setNumberOfNights(
      calculateNights(
        type === "checkIn" ? value : checkInDate,
        type === "checkOut" ? value : checkOutDate
      )
    );
  };

  useEffect(() => {
    setNumberOfNights(calculateNights(checkInDate, checkOutDate));
  }, [checkInDate, checkOutDate]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Check-in & Check-out Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => handleDateChange("checkIn", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => handleDateChange("checkOut", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-in Time</label>
            <input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out Time</label>
            <input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Number of nights</label>
          <input
            type="text"
            readOnly
            value={numberOfNights > 0 ? `${numberOfNights} nights` : "Select dates"}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Room selection field */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Room</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">What room would you like to book?</label>
          <select
            value={roomChoice}
            onChange={(e) => setRoomChoice(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">-- Select a Room --</option>
            <option value="Standard Double Room">Standard Double Room</option>
            <option value="Triple Room">Triple Room</option>
            <option value="Twin Room">Twin Room</option>
            <option value="Family Room">Family Room</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-semibold"
          onClick={() =>
            navigate("/booking-form", {
              state: { roomChoice, checkInDate, checkOutDate, numberOfNights },
            })
          }
          disabled={numberOfNights <= 0 || !roomChoice}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default NewBooking;
