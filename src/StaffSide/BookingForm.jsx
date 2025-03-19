import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaArrowRight, FaArrowLeft, FaTimes, FaInfoCircle } from "react-icons/fa";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Female",
    mobileNumber: "",
    specialRequest: "None",
  });

  const fetchBookedDates = async () => {
    if (!selectedRoom?.name) return;

    try {
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
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, [selectedRoom]);

  const isDateBooked = (date) =>
    bookedDates.some((bookedDate) => date.toDateString() === bookedDate.toDateString());

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
      setNumberOfNights(calculateNights(date, checkOutDate));
    } else {
      setCheckOutDate(date);
      setNumberOfNights(calculateNights(checkInDate, date));
    }
  };

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && numberOfNights > 0 && roomChoice) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    if (guestInfo.firstName && guestInfo.lastName && guestInfo.email && guestInfo.mobileNumber) {
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

        const bookingsRef = collection(db, "bookings");
        await addDoc(bookingsRef, bookingData);

        // Send booking confirmation email
        const emailResponse = await fetch(`http://localhost:3000/send-booking-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

        if (!emailResponse.ok) {
          console.error("Failed to send email");
        } else {
          console.log("Booking confirmation email sent successfully");
        }

        navigate("/home");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const totalCost = selectedRoom ? selectedRoom.ratePerDay * numberOfNights : 0;

  if (!selectedRoom) {
    return <div>No room selected. Please select a room first.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="text-center w-1/3">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${step >= stepNum ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {stepNum}
              </div>
              <div className={`mt-1 text-sm ${step >= stepNum ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
                {stepNum === 1 ? 'Room & Dates' : stepNum === 2 ? 'Guest Info' : 'Confirmation'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative pt-2">
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(step - 1) * 50}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Room and Dates Selection */}
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Select Room & Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium mb-1">
                <FaCalendarAlt className="mr-2 text-orange-500" />
                Check-in Date
              </label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => handleDateChange("checkIn", date)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholderText="Select check-in date"
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                filterDate={(date) => !isDateBooked(date)}
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium mb-1">
                <FaCalendarAlt className="mr-2 text-orange-500" />
                Check-out Date
              </label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => handleDateChange("checkOut", date)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholderText="Select check-out date"
                dateFormat="MMMM d, yyyy"
                minDate={checkInDate || new Date()}
                filterDate={(date) => !isDateBooked(date)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center text-gray-700 font-medium mb-1">
              <FaUsers className="mr-2 text-orange-500" />
              Number of Guests
            </label>
            <select
              name="guests"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="text-gray-600">Selected Room:</div>
              <div className="font-medium">{selectedRoom?.name}</div>
              <div className="text-gray-600">Rate per Night:</div>
              <div className="font-medium">₱{selectedRoom?.ratePerDay}</div>
              <div className="text-gray-600">Number of Nights:</div>
              <div className="font-medium">{numberOfNights}</div>
            </div>
            <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
              <span className="font-semibold text-blue-900">Total Cost:</span>
              <span className="font-bold text-xl text-orange-600">₱{totalCost}</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!checkInDate || !checkOutDate || numberOfNights === 0}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Guest Information
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Guest Information */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Guest Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={guestInfo.firstName}
                onChange={handleGuestInfoChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={guestInfo.lastName}
                onChange={handleGuestInfoChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={guestInfo.email}
                onChange={handleGuestInfoChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                 
                  if (/^\d{0,11}$/.test(value)) {
                    handleChange(e); 
                  }
                }}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                maxLength="11" 
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Special Requests</label>
            <textarea
              name="specialRequest"
              value={guestInfo.specialRequest}
              onChange={handleGuestInfoChange}
              rows="3"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Any special requirements or requests for your stay..."
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.mobileNumber}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Booking
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Review & Confirm Your Booking</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Booking Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-4">
              <div>
                <p className="text-gray-500 text-sm">Check-in Date</p>
                <p className="font-medium">{checkInDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Check-out Date</p>
                <p className="font-medium">{checkOutDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Room Type</p>
                <p className="font-medium">{selectedRoom?.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Guests</p>
                <p className="font-medium">{numberOfGuests} {numberOfGuests === 1 ? 'Guest' : 'Guests'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Length of Stay</p>
                <p className="font-medium">{numberOfNights} {numberOfNights === 1 ? 'Night' : 'Nights'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Payment Method</p>
                <p className="font-medium">Pay at Property</p>
              </div>
            </div>
            <div className="border-t border-blue-200 pt-4 mt-4">
              <h4 className="font-medium mb-2">Rate Summary</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{selectedRoom?.name} ({numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'} × ₱{selectedRoom?.ratePerDay})</span>
                <span>₱{totalCost}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-xl text-orange-600">₱{totalCost}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-gray-500 text-sm">Guest Name</p>
                <p className="font-medium">{guestInfo.firstName} {guestInfo.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email Address</p>
                <p className="font-medium">{guestInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>
                <p className="font-medium">{guestInfo.mobileNumber}</p>
              </div>
              {guestInfo.specialRequest && (
                <div className="md:col-span-2">
                  <p className="text-gray-500 text-sm">Special Requests</p>
                  <p className="font-medium">{guestInfo.specialRequest}</p>
                </div>
              )}
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 rounded"
              />
              <span className="ml-2 text-gray-700 text-sm">
                I agree to the <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="text-orange-500 hover:underline">terms and conditions</a>, and I confirm that the information provided is correct.
              </span>
            </label>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <button
              onClick={handleConfirmBooking}
              className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
            >
              Confirm Booking
              <FaCheckCircle className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-900">Confirm Booking</h3>
              <button 
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-4">Are you sure you want to confirm your booking for:</p>
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="font-medium">{selectedRoom?.name}</p>
                <p className="text-sm text-gray-600">
                  {checkInDate?.toLocaleDateString()} to {checkOutDate?.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">{numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}, {numberOfGuests} {numberOfGuests === 1 ? 'guest' : 'guests'}</p>
                <p className="font-bold text-orange-600 mt-1">Total: ₱{totalCost}</p>
              </div>
              <p className="text-sm text-gray-600">By confirming, you agree to our booking terms and conditions.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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