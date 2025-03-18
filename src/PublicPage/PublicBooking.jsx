import React, { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaUsers, FaCheckCircle, FaArrowRight, FaArrowLeft, FaTimes, FaInfoCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Adjust the import path as needed
import Pic4 from './images/Pic4.png';
import Pic2 from './images/Pic2.png';
import Pic5 from './images/Pic5.png';
import Pic7 from './Images/Pic7.png';

// Constants
const ROOM_OPTIONS = [
  { id: 1, name: 'Standard Double Room', rate: 1500, capacity: 2, image: Pic4 },
  { id: 2, name: 'Twin Room', rate: 1500, capacity: 2, image: Pic2 },
  { id: 3, name: 'Triple Room', rate: 2000, capacity: 3, image: Pic5 },
  { id: 4, name: 'Family Room', rate: 3800, capacity: 6, image: Pic7 },
];

const PublicBooking = () => {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    selectedRoom: ROOM_OPTIONS[0],
    nights: 0,
    totalCost: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'credit',
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Fetch booked dates from Firebase
  const fetchBookedDates = useCallback(async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("selectedRoom", "==", formData.selectedRoom.name));
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
  }, [formData.selectedRoom]);

  useEffect(() => {
    fetchBookedDates();
  }, [fetchBookedDates]);

  // Check if a date is booked
  const isDateBooked = useCallback((date) => 
    bookedDates.some((bookedDate) => date.toDateString() === bookedDate.toDateString()),
    [bookedDates]
  );

  // Calculate total nights and cost
  const calculateTotal = useCallback((checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        nights: diffDays,
        totalCost: diffDays * formData.selectedRoom.rate,
      };
    }
    return { nights: 0, totalCost: 0 };
  }, [formData.selectedRoom]);

  // Handle form input changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      if (name === 'checkInDate' || name === 'checkOutDate') {
        const { nights, totalCost } = calculateTotal(
          name === 'checkInDate' ? value : prev.checkInDate,
          name === 'checkOutDate' ? value : prev.checkOutDate
        );
        updatedData.nights = nights;
        updatedData.totalCost = totalCost;
      }
      return updatedData;
    });
  }, [calculateTotal]);

  // Handle room selection
  const handleRoomSelect = useCallback((room) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoom: room,
      totalCost: prev.nights * room.rate,
    }));
  }, []);

  // Navigation between steps
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    setShowModal(false);
    setShowSuccessModal(true);
  };

  // Render progress bar
  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="text-center w-1/3">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step}
            </div>
            <div className={`mt-1 text-sm ${currentStep >= step ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>
              {step === 1 ? 'Room & Dates' : step === 2 ? 'Guest Info' : 'Confirmation'}
            </div>
          </div>
        ))}
      </div>
      <div className="relative pt-2">
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(currentStep - 1) * 50}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modals
  const renderModals = () => (
    <>
      {showModal && (
        <ConfirmationModal
          formData={formData}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
      {showTermsModal && (
        <TermsModal onClose={() => setShowTermsModal(false)} />
      )}
    </>
  );

  // Render steps
  const renderSteps = () => {
    switch (currentStep) {
      case 1:
        return <StepOne formData={formData} handleChange={handleChange} handleRoomSelect={handleRoomSelect} isDateBooked={isDateBooked} nextStep={nextStep} />;
      case 2:
        return <StepTwo formData={formData} handleChange={handleChange} prevStep={prevStep} nextStep={nextStep} />;
      case 3:
        return <StepThree formData={formData} prevStep={prevStep} onConfirm={() => setShowModal(true)} setShowTermsModal={setShowTermsModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {renderProgressBar()}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        {renderSteps()}
      </div>
      {renderModals()}
    </div>
  );
};

// Step One Component
const StepOne = ({ formData, handleChange, handleRoomSelect, isDateBooked, nextStep }) => (
  <div className="animate-fadeIn">
    <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Select Room & Dates</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <label className="flex items-center text-gray-700 font-medium mb-1">
          <FaCalendarAlt className="mr-2 text-orange-500" />
          Check-in Date
        </label>
        <DatePicker
          selected={formData.checkInDate ? new Date(formData.checkInDate) : null}
          onChange={(date) => handleChange({ target: { name: "checkInDate", value: date.toISOString().split('T')[0] } })}
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
          selected={formData.checkOutDate ? new Date(formData.checkOutDate) : null}
          onChange={(date) => handleChange({ target: { name: "checkOutDate", value: date.toISOString().split('T')[0] } })}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholderText="Select check-out date"
          dateFormat="MMMM d, yyyy"
          minDate={formData.checkInDate ? new Date(formData.checkInDate) : new Date()}
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
        value={formData.guests}
        onChange={handleChange}
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        {[1, 2, 3, 4, 5, 6].map(num => (
          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
        ))}
      </select>
    </div>
    <h3 className="text-lg font-semibold mb-3 text-blue-900">Available Rooms</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {ROOM_OPTIONS.map(room => (
        <div 
          key={room.id} 
          className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${formData.selectedRoom.name === room.name ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'}`}
          onClick={() => handleRoomSelect(room)}
        >
          <div className="flex items-start">
            <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden mr-3">
              <img 
                src={room.image || "/api/placeholder/80/80"} 
                alt={room.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-blue-900">{room.name}</h4>
                {formData.selectedRoom.name === room.name && (
                  <FaCheckCircle className="text-orange-500" />
                )}
              </div>
              <p className="text-gray-600 text-sm">Up to {room.capacity} guests</p>
              <p className="font-bold text-orange-600 mt-1">₱{room.rate} <span className="text-xs font-normal text-gray-500">per night</span></p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2 text-blue-900">Booking Summary</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-600">Selected Room:</div>
        <div className="font-medium">{formData.selectedRoom.name}</div>
        <div className="text-gray-600">Rate per Night:</div>
        <div className="font-medium">₱{formData.selectedRoom.rate}</div>
        <div className="text-gray-600">Number of Nights:</div>
        <div className="font-medium">{formData.nights}</div>
      </div>
      <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
        <span className="font-semibold text-blue-900">Total Cost:</span>
        <span className="font-bold text-xl text-orange-600">₱{formData.totalCost}</span>
      </div>
    </div>
    <div className="flex justify-end">
      <button
        onClick={nextStep}
        disabled={!formData.checkInDate || !formData.checkOutDate || formData.nights === 0}
        className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Guest Information
        <FaArrowRight className="ml-2" />
      </button>
    </div>
  </div>
);

// Step Two Component
const StepTwo = ({ formData, handleChange, prevStep, nextStep }) => (
  <div className="animate-fadeIn">
    <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Guest Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-1">Special Requests</label>
      <textarea
        name="specialRequests"
        value={formData.specialRequests}
        onChange={handleChange}
        rows="3"
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        placeholder="Any special requirements or requests for your stay..."
      ></textarea>
    </div>
    <div className="mb-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Good to Know</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          <li>No credit card needed</li>
          <li>No payment is required to secure this booking. You’ll pay during your stay.</li>
        </ul>
      </div>
    </div>
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <FaInfoCircle className="text-blue-500 mt-1 mr-2" />
        <p className="text-sm text-blue-800">
          Your personal information is secure and will only be used for booking purposes. See our privacy policy for more information.
        </p>
      </div>
    </div>
    <div className="flex justify-between">
      <button
        onClick={prevStep}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <button
        onClick={nextStep}
        disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
        className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Review Booking
        <FaArrowRight className="ml-2" />
      </button>
    </div>
  </div>
);

// Step Three Component
const StepThree = ({ formData, prevStep, onConfirm, setShowTermsModal }) => (
  <div className="animate-fadeIn">
    <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Review & Confirm Your Booking</h2>
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">Booking Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-4">
        <div>
          <p className="text-gray-500 text-sm">Check-in Date</p>
          <p className="font-medium">{new Date(formData.checkInDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Check-out Date</p>
          <p className="font-medium">{new Date(formData.checkOutDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Room Type</p>
          <p className="font-medium">{formData.selectedRoom.name}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Guests</p>
          <p className="font-medium">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Length of Stay</p>
          <p className="font-medium">{formData.nights} {formData.nights === 1 ? 'Night' : 'Nights'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Payment Method</p>
          <p className="font-medium">{formData.paymentMethod === 'credit' ? 'Credit Card' : 'Pay at Property'}</p>
        </div>
      </div>
      <div className="border-t border-blue-200 pt-4 mt-4">
        <h4 className="font-medium mb-2">Rate Summary</h4>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">{formData.selectedRoom.name} ({formData.nights} {formData.nights === 1 ? 'night' : 'nights'} × ₱{formData.selectedRoom.rate})</span>
          <span>₱{formData.totalCost}</span>
        </div>
        <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between font-bold">
          <span>Total Amount</span>
          <span className="text-xl text-orange-600">₱{formData.totalCost}</span>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-900">Guest Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
        <div>
          <p className="text-gray-500 text-sm">Guest Name</p>
          <p className="font-medium">{formData.firstName} {formData.lastName}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Email Address</p>
          <p className="font-medium">{formData.email}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Phone Number</p>
          <p className="font-medium">{formData.phone}</p>
        </div>
        {formData.specialRequests && (
          <div className="md:col-span-2">
            <p className="text-gray-500 text-sm">Special Requests</p>
            <p className="font-medium">{formData.specialRequests}</p>
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
          I agree to the <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-orange-500 hover:underline">terms and conditions</a>, and I confirm that the information provided is correct.
        </span>
      </label>
    </div>
    <div className="flex justify-between">
      <button
        onClick={prevStep}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <button
        onClick={onConfirm}
        className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
      >
        Confirm Booking
        <FaCheckCircle className="ml-2" />
      </button>
    </div>
  </div>
);

// Confirmation Modal Component
const ConfirmationModal = ({ formData, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-900">Confirm Booking</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      <div className="mb-4">
        <p className="mb-4">Are you sure you want to confirm your booking for:</p>
        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <p className="font-medium">{formData.selectedRoom.name}</p>
          <p className="text-sm text-gray-600">
            {new Date(formData.checkInDate).toLocaleDateString()} to {new Date(formData.checkOutDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">{formData.nights} {formData.nights === 1 ? 'night' : 'nights'}, {formData.guests} {formData.guests === 1 ? 'guest' : 'guests'}</p>
          <p className="font-bold text-orange-600 mt-1">Total: ₱{formData.totalCost}</p>
        </div>
        <p className="text-sm text-gray-600">By confirming, you agree to our booking terms and conditions.</p>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
);

// Success Modal Component
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn text-center">
      <div className="mb-4">
        <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
        <p className="text-xl font-semibold">Booking confirmed! A confirmation email has been sent.</p>
      </div>
      <div className="mt-6">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium w-full"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

// Terms Modal Component
const TermsModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-900">Terms and Conditions</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Here are the general terms and conditions for booking on our platform:
          <ul className="list-disc pl-5 mt-2">
            <li>Booking is subject to availability.</li>
            <li>Payment is required upon check-in.</li>
            <li>Cancellations must be made 48 hours prior to check-in.</li>
            <li>No refunds for no-shows.</li>
            <li>Additional charges may apply for extra services.</li>
          </ul>
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default PublicBooking;