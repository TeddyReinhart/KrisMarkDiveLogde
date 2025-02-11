import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import room1 from "./images/room1.png";
import room2 from "./images/room2.png";
import room3 from "./images/room3.png";
import room4 from "./images/room4.png";

function NewBooking() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [numberOfNights, setNumberOfNights] = useState("");
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Check-in & Check-out Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Check-in Date</label>
            <input type="date" value={checkInDate} onChange={(e) => handleDateChange("checkIn", e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out Date</label>
            <input type="date" value={checkOutDate} onChange={(e) => handleDateChange("checkOut", e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-in Time</label>
            <input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Check-out Time</label>
            <input type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} className="w-full p-2 border rounded-md" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Number of nights</label>
          <input type="text" readOnly value={numberOfNights > 0 ? `${numberOfNights} nights` : ""} className="w-full p-2 border rounded-md" placeholder="Select dates" />
        </div>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        {roomData.map((room) => (
          <div key={room.name} className="flex bg-white p-4 rounded-lg shadow-md">
            <img src={room.image} alt={room.name} className="w-40 h-28 rounded-md object-cover" />
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-500">{room.guests} guests</p>
              <p className="text-sm text-gray-500">{room.description}</p>
              <p className="text-orange-600 font-semibold mt-1">₱ {room.price.toLocaleString()} for 1 night</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md self-center" onClick={() => navigate("/booking-form")}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const roomData = [
  { name: "Triple Room", image: room1, guests: 3, description: "Airconditioned • Own bathroom • Free Wi-Fi • Easy access to the beach and restaurants • No corkage for food and drinks • Grill and common dining area", price: 2000 },
  { name: "Twin Room", image: room2, guests: 2, description: "Airconditioned • Own bathroom • Hot and cold shower • Free Wi-Fi • Easy access to the beach and restaurants • No corkage for food and drinks • Grill and common dining area", price: 1500 },
  { name: "Standard Double Room", image: room3, guests: 2, description: "Airconditioned • Own bathroom • Hot and cold shower • Free Wi-Fi • Easy access to the beach and restaurants • No corkage for food and drinks • Grill and common dining area", price: 1500 },
  { name: "Family Room", image: room4, guests: 6, description: "Airconditioned • Own bathroom • Hot and cold shower • Free Wi-Fi • Easy access to the beach and restaurants • No corkage for food and drinks • Grill and common dining area", price: 3800 },
];

export default NewBooking;
