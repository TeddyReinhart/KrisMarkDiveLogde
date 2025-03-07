import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal

function BookingForm() {
  const { state } = useLocation();
  const selectedRoom = state?.selectedRoom;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [roomChoice, setRoomChoice] = useState(selectedRoom?.name || "");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  const handleConfirmBooking = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false); // Close the modal

    if (
      guestInfo.firstName &&
      guestInfo.lastName &&
      guestInfo.email &&
      guestInfo.gender &&
      guestInfo.mobileNumber
    ) {
      try {
        const bookingData = {
          selectedRoom: selectedRoom?.name,
          roomDetails: selectedRoom,
          checkInDate: checkInDate?.toDateString(),
          checkOutDate: checkOutDate?.toDateString(),
          numberOfNights,
          numberOfGuests,
          ratePerDay: selectedRoom?.ratePerDay,
          totalCost: selectedRoom ? selectedRoom.ratePerDay * numberOfNights : 0,
          guestInfo,
          timestamp: new Date(),
        };

        // Save booking data to Firestore
        const bookingsRef = collection(db, "bookings");
        await addDoc(bookingsRef, bookingData);

        // Send booking confirmation email
        const emailResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-booking-confirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: guestInfo.email,
            firstName: guestInfo.firstName,
            lastName: guestInfo.lastName,
            selectedRoom: selectedRoom?.name,
            checkInDate: checkInDate?.toDateString(),
            checkOutDate: checkOutDate?.toDateString(),
            totalCost: selectedRoom ? selectedRoom.ratePerDay * numberOfNights : 0,
          }),
        });

        if (emailResponse.ok) {
          console.log("Booking confirmation email sent successfully");
        } else {
          console.error("Failed to send booking confirmation email");
        }

        navigate("/"); // Navigate to the home page after successful booking
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
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
                filterDate={(date) => !isDateBooked(date)}
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
                filterDate={(date) => !isDateBooked(date)}
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
                  maxLength={11}
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
        <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Step 3: Confirm Booking</h2>
          <div className="space-y-8">
            {/* Booking Summary */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Booking Summary</h3>
              <div className="p-5 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-lg font-semibold text-gray-900">{selectedRoom?.name}</p>
                <p className="text-gray-700"><span className="font-medium">Rate per Day:</span> ₱{selectedRoom?.ratePerDay?.toLocaleString()}</p>
                <p className="text-gray-700"><span className="font-medium">Check-in:</span> {checkInDate?.toDateString()}</p>
                <p className="text-gray-700"><span className="font-medium">Check-out:</span> {checkOutDate?.toDateString()}</p>
                <p className="text-gray-700"><span className="font-medium">Number of Nights:</span> {numberOfNights}</p>
                <p className="text-gray-700"><span className="font-medium">Number of Guests:</span> {numberOfGuests}</p>
                <p className="text-gray-900 font-semibold text-lg"><span className="font-medium">Total Cost:</span> ₱{totalCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Guest Information */}
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Guest Information</h3>
              <div className="p-5 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-700"><span className="font-medium">First Name:</span> {guestInfo.firstName}</p>
                <p className="text-gray-700"><span className="font-medium">Last Name:</span> {guestInfo.lastName}</p>
                <p className="text-gray-700"><span className="font-medium">Email:</span> {guestInfo.email}</p>
                <p className="text-gray-700"><span className="font-medium">Mobile Number:</span> {guestInfo.mobileNumber}</p>
                <p className="text-gray-700"><span className="font-medium">Gender:</span> {guestInfo.gender}</p>
                <p className="text-gray-700"><span className="font-medium">Special Request:</span> {guestInfo.specialRequest || "None"}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-200"
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-200"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default BookingForm;