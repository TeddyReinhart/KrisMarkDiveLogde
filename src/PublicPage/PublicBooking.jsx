import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers, FaBed, FaCheckCircle, FaArrowRight, FaArrowLeft, FaCreditCard, FaInfoCircle, FaTimes } from "react-icons/fa";
import Pic4 from './images/Pic4.png';
import Pic2 from './images/Pic2.png';
import Pic5 from './images/Pic5.png';
import Pic7 from './Images/Pic7.png';


const PublicBooking = () => {
  // State for tracking current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for form data
  const [formData, setState] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    selectedRoom: { name: 'Triple Room', rate: 1500 },
    nights: 0,
    totalCost: 0,
    // Guest information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    // Payment information
    paymentMethod: 'credit',
  });

  // State for confirmation modal
  const [showModal, setShowModal] = useState(false);
  // State for success modal (after booking is confirmed)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate nights and total cost when dates change
  const calculateTotal = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        nights: diffDays,
        totalCost: diffDays * formData.selectedRoom.rate
      };
    }
    return { nights: 0, totalCost: 0 };
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'checkInDate' || name === 'checkOutDate') {
      const checkIn = name === 'checkInDate' ? value : formData.checkInDate;
      const checkOut = name === 'checkOutDate' ? value : formData.checkOutDate;
      
      if (checkIn && checkOut) {
        const { nights, totalCost } = calculateTotal(checkIn, checkOut);
        setState({
          ...formData,
          [name]: value,
          nights,
          totalCost
        });
      } else {
        setState({
          ...formData,
          [name]: value
        });
      }
    } else {
      setState({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle room selection
  const handleRoomSelect = (room) => {
    setState({
      ...formData,
      selectedRoom: room,
      totalCost: formData.nights * room.rate
    });
  };

  // Navigation functions
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    // Here you would typically submit the form data to your backend
    setShowModal(false);
    setShowSuccessModal(true);
  };

  // Handle redirection to home page
  const redirectToHome = () => {
    window.location.href = '/public-home';
  };

  // Sample room data
  const roomOptions = [
    { id: 1, name: 'Standard Double Room', rate: 1500, capacity: 2, image: Pic4 },
    { id: 2, name: 'Twin Room', rate: 1500, capacity: 2, image: Pic2 },
    { id: 3, name: 'Triple Room', rate: 2000, capacity: 3, image: Pic5 },
    { id: 4, name: 'Family Room', rate: 3800, capacity: 6, image: Pic7 },
  ];

  // Render progress bar
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <div className="text-center w-1/3">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`mt-1 text-sm ${currentStep >= 1 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>Room & Dates</div>
          </div>
          
          <div className="text-center w-1/3">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className={`mt-1 text-sm ${currentStep >= 2 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>Guest Info</div>
          </div>
          
          <div className="text-center w-1/3">
            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <div className={`mt-1 text-sm ${currentStep === 3 ? 'text-orange-500 font-medium' : 'text-gray-500'}`}>Confirmation</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative pt-2">
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(currentStep - 1) * 50}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render confirmation modal
  const renderConfirmationModal = () => {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-900">Confirm Booking</h3>
                <button 
                  onClick={() => setShowModal(false)}
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
                <p className="text-sm text-gray-600">
                  By confirming, you agree to our booking terms and conditions.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn text-center">
              <div className="mb-4">
                <FaCheckCircle className="mx-auto text-green-500 text-5xl mb-4" />
                <p className="text-xl font-semibold">Booking confirmed! A confirmation email has been sent.</p>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={redirectToHome}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium w-full"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Render step 1: Room & Dates
  const renderStepOne = () => {
    return (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Select Room & Dates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium mb-1">
              <FaCalendarAlt className="mr-2 text-orange-500" />
              Check-in Date
            </label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium mb-1">
              <FaCalendarAlt className="mr-2 text-orange-500" />
              Check-out Date
            </label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
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
          {roomOptions.map(room => (
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
  };

  // Render step 2: Guest Information
  const renderStepTwo = () => {
    return (
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
          <h3 className="text-lg font-semibold mb-3 text-blue-900">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="credit"
                checked={formData.paymentMethod === 'credit'}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500"
              />
              <div className="ml-3">
                <span className="font-medium block">Gcash Payment</span>
                <span className="text-sm text-gray-500">Pay securely with your Gcash</span>
              </div>
            </label>
            
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500"
              />
              <div className="ml-3">
                <span className="font-medium block">Pay at Property</span>
                <span className="text-sm text-gray-500">Pay in cash when you arrive</span>
              </div>
            </label>
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
  };

  // Render step 3: Confirmation
  const renderStepThree = () => {
    return (
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
              I agree to the <a href="#" className="text-orange-500 hover:underline">terms and conditions</a>, and I confirm that the information provided is correct.
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
            onClick={() => setShowModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
          >
            Confirm Booking
            <FaCheckCircle className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {renderProgressBar()}
      
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        {currentStep === 1 && renderStepOne()}
        {currentStep === 2 && renderStepTwo()}
        {currentStep === 3 && renderStepThree()}
      </div>
      
      {renderConfirmationModal()}
    </div>
  );
};


// Step One Component
const StepOne = ({ 
  checkInDate, 
  checkOutDate, 
  numberOfGuests, 
  selectedRoom, 
  numberOfNights, 
  handleDateChange, 
  handleRoomSelect, 
  isDateBooked, 
  nextStep, 
  setNumberOfGuests 
}) => (
  <div className="animate-fadeIn">
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
    <h3 className="text-lg font-semibold mb-3 text-blue-900">Available Rooms</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {ROOM_OPTIONS.map(room => (
        <div 
          key={room.id} 
          className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${selectedRoom.name === room.name ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'}`}
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
                {selectedRoom.name === room.name && (
                  <FaCheckCircle className="text-orange-500" />
                )}
              </div>
              <p className="text-gray-600 text-sm">Up to {room.capacity} guests</p>
              <p className="font-bold text-orange-600 mt-1">₱{room.ratePerDay} <span className="text-xs font-normal text-gray-500">per night</span></p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2 text-blue-900">Booking Summary</h3>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="text-gray-600">Selected Room:</div>
        <div className="font-medium">{selectedRoom.name}</div>
        <div className="text-gray-600">Rate per Night:</div>
        <div className="font-medium">₱{selectedRoom.ratePerDay}</div>
        <div className="text-gray-600">Number of Nights:</div>
        <div className="font-medium">{numberOfNights}</div>
      </div>
      <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
        <span className="font-semibold text-blue-900">Total Cost:</span>
        <span className="font-bold text-xl text-orange-600">₱{selectedRoom.ratePerDay * numberOfNights}</span>
      </div>
    </div>
    <div className="flex justify-end">
      <button
        onClick={nextStep}
        disabled={!checkInDate || !checkOutDate || numberOfNights === 0}
        className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue to Guest Information
        <FaArrowRight className="ml-2" />
      </button>
    </div>
  </div>
);

// Step Two Component
const StepTwo = ({ guestInfo, handleGuestInfoChange, prevStep, nextStep }) => {
  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    // Ensure the phone number starts with '63'
    const formattedNumber = value.startsWith('63') ? value : `63${value}`;
    if (formattedNumber.length <= 12){
      handleGuestInfoChange({ target: { name: 'mobileNumber', value: formattedNumber } });
    }
   
  };

  return (
    <div className="animate-fadeIn">
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
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              +63
            </span>
            <input
              type="tel"
              name="mobileNumber"
              value={guestInfo.mobileNumber.replace(/^63/, '')} // Remove '63' prefix for display
              onChange={handlePhoneNumberChange}
              className="w-full p-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
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
          onClick={prevStep}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.mobileNumber}
          className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Booking
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

// Step Three Component
const StepThree = ({ 
  selectedRoom, 
  checkInDate, 
  checkOutDate, 
  numberOfNights, 
  numberOfGuests, 
  guestInfo, 
  totalCost, 
  prevStep, 
  onConfirm, 
  setShowTermsModal 
}) => {
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b pb-2">Review & Confirm Your Booking</h2>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Booking Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mb-4">
          <div>
            <p className="text-gray-500 text-sm">Check-in Date</p>
            <p className="font-medium">{checkInDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Check-out Date</p>
            <p className="font-medium">{checkOutDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Room Type</p>
            <p className="font-medium">{selectedRoom.name}</p>
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
            <span className="text-gray-600">{selectedRoom.name} ({numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'} × ₱{selectedRoom.ratePerDay})</span>
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
            <p className="font-medium">+63{guestInfo.mobileNumber.replace(/^63/, '')}</p>
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
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
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
          disabled={!isChecked}
          className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Booking
          <FaCheckCircle className="ml-2" />
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ 
  selectedRoom, 
  checkInDate, 
  checkOutDate, 
  numberOfNights, 
  numberOfGuests, 
  totalCost, 
  onClose, 
  onConfirm 
}) => (
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
          <p className="font-medium">{selectedRoom.name}</p>
          <p className="text-sm text-gray-600">
            {checkInDate.toLocaleDateString()} to {checkOutDate.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">{numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}, {numberOfGuests} {numberOfGuests === 1 ? 'guest' : 'guests'}</p>
          <p className="font-bold text-orange-600 mt-1">Total: ₱{totalCost}</p>
          <p className="text-sm text-gray-600">Status: <span className="text-yellow-600">Pending</span></p>
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