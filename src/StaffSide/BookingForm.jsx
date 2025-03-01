import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

function BookingForm() {
  const { state } = useLocation();
  const selectedRoom = state?.selectedRoom;

  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [roomChoice, setRoomChoice] = useState(selectedRoom?.name || "");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]); // State to store booked dates

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Female",
    mobileNumber: "",
    specialRequest: "None",
  });

  // Fetch booked dates for the selected room
  const fetchBookedDates = async () => {
    if (!selectedRoom?.name) return;

    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("selectedRoom", "==", selectedRoom.name));
    const querySnapshot = await getDocs(q);

    const dates = [];
    querySnapshot.forEach((doc) => {
      const booking = doc.data();
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);

      // Add all dates between check-in and check-out to the bookedDates array
      for (let date = checkIn; date <= checkOut; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
      }
    });

    setBookedDates(dates);
  };

  useEffect(() => {
    fetchBookedDates();
  }, [selectedRoom]);

  // Check if a date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => date.toDateString() === bookedDate.toDateString()
    );
  };

  const calculateNights = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const diffTime = checkOut - checkIn;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleDateChange = (type, date) => {
    if (type === "checkIn") {
      setCheckInDate(date);
    } else {
      setCheckOutDate(date);
    }
    setNumberOfNights(
      calculateNights(
        type === "checkIn" ? date : checkInDate,
        type === "checkOut" ? date : checkOutDate
      )
    );
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1 && numberOfNights > 0 && roomChoice) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (
      guestInfo.firstName &&
      guestInfo.lastName &&
      guestInfo.email &&
      guestInfo.gender &&
      guestInfo.mobileNumber
    ) {
      try {
        // Prepare booking data
        const bookingData = {
          selectedRoom: selectedRoom?.name, // Room name
          roomDetails: selectedRoom, // Include the entire selectedRoom object
          checkInDate: checkInDate?.toDateString(),
          checkOutDate: checkOutDate?.toDateString(),
          numberOfNights,
          numberOfGuests,
          ratePerDay: selectedRoom?.ratePerDay, // Include ratePerDay in the booking data
          totalCost: selectedRoom ? selectedRoom.ratePerDay * numberOfNights : 0,
          guestInfo,
          timestamp: new Date(), // Add a timestamp for when the booking was made
        };

        // Save booking data to Firestore
        const docRef = await addDoc(collection(db, "bookings"), bookingData);
        console.log("Booking saved with ID: ", docRef.id);

        alert("Booking Confirmed!");
        // Optionally, you can navigate to a confirmation page here
      } catch (error) {
        console.error("Error saving booking: ", error);
        alert("An error occurred while saving the booking. Please try again.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const totalCost = selectedRoom ? selectedRoom.ratePerDay * numberOfNights : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Progress Indicator */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center">
          <div
            className={`flex-1 h-2 ${
              step >= 1 ? "bg-orange-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`flex-1 h-2 mx-2 ${
              step >= 2 ? "bg-orange-500" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`flex-1 h-2 ${
              step >= 3 ? "bg-orange-500" : "bg-gray-300"
            }`}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium">
          <span>Step 1: Room & Dates</span>
          <span>Step 2: Guest Info</span>
          <span>Step 3: Confirmation</span>
        </div>
      </div>

      {/* Step 1: Room and Dates Selection */}
      {step === 1 && (
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Step 1: Select Room & Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-2">Check-in Date</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => handleDateChange("checkIn", date)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholderText="Select check-in date"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                filterDate={(date) => !isDateBooked(date)} // Disable booked dates
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">Check-out Date</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => handleDateChange("checkOut", date)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholderText="Select check-out date"
                dateFormat="MMMM d, yyyy"
                minDate={checkInDate || new Date()}
                filterDate={(date) => !isDateBooked(date)} // Disable booked dates
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-lg font-medium mb-2">Number of Guests</label>
            <input
              type="number"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mt-6">
            <label className="block text-lg font-medium mb-2">Selected Room</label>
            <div className="p-4 border border-gray-300 rounded-lg">
              <p className="text-lg font-semibold">{selectedRoom?.name}</p>
              <p className="text-gray-600">Rate per Day: ₱{selectedRoom?.ratePerDay?.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-lg font-medium mb-2">Total Cost</label>
            <div className="p-4 border border-gray-300 rounded-lg">
              <p className="text-lg font-semibold">
                ₱{(selectedRoom?.ratePerDay * numberOfNights)?.toLocaleString()}
              </p>
              <p className="text-gray-600">
                {numberOfNights} night(s) × ₱{selectedRoom?.ratePerDay?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              onClick={handleNext}
              disabled={numberOfNights <= 0 || !roomChoice}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Guest Information */}
      {step === 2 && (
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Step 2: Guest Information</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={guestInfo.firstName}
                  onChange={handleGuestInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={guestInfo.lastName}
                  onChange={handleGuestInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={guestInfo.email}
                  onChange={handleGuestInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={guestInfo.mobileNumber}
                  onChange={handleGuestInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Mobile Number"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={guestInfo.gender}
                  onChange={handleGuestInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-lg font-medium mb-2">Special Request</label>
                <textarea
                  name="specialRequest"
                  value={guestInfo.specialRequest}
                  onChange={handleGuestInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Special Request"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Step 3: Confirm Booking</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              <div className="p-4 border border-gray-300 rounded-lg">
                <p className="text-lg font-semibold">{selectedRoom?.name}</p>
                <p className="text-gray-600">Rate per Day: ₱{selectedRoom?.ratePerDay?.toLocaleString()}</p>
                <p className="text-gray-600">Check-in: {checkInDate?.toDateString()}</p>
                <p className="text-gray-600">Check-out: {checkOutDate?.toDateString()}</p>
                <p className="text-gray-600">Number of Nights: {numberOfNights}</p>
                <p className="text-gray-600">Number of Guests: {numberOfGuests}</p>
                <p className="text-gray-600">Total Cost: ₱{totalCost.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Guest Information</h3>
              <div className="p-4 border border-gray-300 rounded-lg">
                <p className="text-gray-600">First Name: {guestInfo.firstName}</p>
                <p className="text-gray-600">Last Name: {guestInfo.lastName}</p>
                <p className="text-gray-600">Email: {guestInfo.email}</p>
                <p className="text-gray-600">Mobile Number: {guestInfo.mobileNumber}</p>
                <p className="text-gray-600">Gender: {guestInfo.gender}</p>
                <p className="text-gray-600">Special Request: {guestInfo.specialRequest}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                onClick={handlePrevious}
              >
                Previous
              </button>
              <button
                type="button"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingForm;