import React, { useState } from "react";

function BookingForm() {
  const [step, setStep] = useState(1); // Step 1: Check-in/out, Step 2: Guest Info, Step 3: Payment

  // Check-in/out and room selection state
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [roomChoice, setRoomChoice] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  // Room options with prices
  const roomOptions = [
    { name: "Standard Double Room", price: 2000 },
    { name: "Triple Room", price: 2500 },
    { name: "Twin Room", price: 2200 },
    { name: "Family Room", price: 3000 },
  ];

  // Guest information state
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Female",
    mobileNumber: "",
    specialRequest: "None",
    dateOfBirth: "",
  });

  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    title: "Mrs.",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    paymentMethod: "GCash", // Default payment method
  });

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

  const handleGuestInfoChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (step === 1 && numberOfNights > 0 && roomChoice) {
      setStep(2);
    } else if (step === 2) {
      // Validate guest info
      if (
        guestInfo.firstName &&
        guestInfo.lastName &&
        guestInfo.email &&
        guestInfo.dateOfBirth &&
        guestInfo.gender &&
        guestInfo.mobileNumber
      ) {
        setStep(3);
      } else {
        alert("Please fill in all required fields.");
      }
    }
  };

  const handleProceedToPaymentSummary = () => {
    if (
      paymentDetails.firstName &&
      paymentDetails.lastName &&
      paymentDetails.email &&
      paymentDetails.phoneNumber
    ) {
      console.log("Payment Details:", paymentDetails);
      alert("Proceeding to Payment Summary...");
      // Here you can navigate to the payment summary page or component
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {step === 1 && (
        <>
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
            <div className="mt-4">
              <label className="block text-sm font-medium">Number of Guests</label>
              <input
                type="number"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(e.target.value)}
                min="1"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

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
                {roomOptions.map((room, index) => (
                  <option key={index} value={room.name}>
                    {room.name} - ₱{room.price.toLocaleString()} per night
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-semibold"
              onClick={handleNext}
              disabled={numberOfNights <= 0 || !roomChoice}
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="bg-gray-50 p-6 flex justify-center items-center w-full">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full max-w-[90%] md:max-w-3xl lg:max-w-4xl min-h-fit">
            <h2 className="text-3xl font-bold text-center mb-6">Guest Information</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Given/First Name
                    </label>
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

                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Family/Last Name
                    </label>
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

                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={guestInfo.dateOfBirth}
                      onChange={handleGuestInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Gender
                    </label>
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

                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Mobile Number
                    </label>
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
                </div>

                <div className="space-y-6">
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={guestInfo.email}
                      onChange={handleGuestInfoChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  <div className="mb-4">
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
              </div>

              <div className="flex justify-end mt-6">
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
        </div>
      )}

      {step === 3 && (
        <div className="min-h-screen p-8 bg-gray-50">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-3xl font-bold">Payment Portal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Billing Details</h3>
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Title*
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={paymentDetails.title}
                      onChange={handlePaymentDetailsChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      First Name*
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={paymentDetails.firstName}
                      onChange={handlePaymentDetailsChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={paymentDetails.lastName}
                      onChange={handlePaymentDetailsChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={paymentDetails.email}
                      onChange={handlePaymentDetailsChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-2 required-asterisk">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={paymentDetails.phoneNumber}
                      onChange={handlePaymentDetailsChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Payment Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium mb-2">Payment Methods</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="GCash"
                        checked={paymentDetails.paymentMethod === "GCash"}
                        onChange={handlePaymentDetailsChange}
                        className="mr-2"
                      />
                      GCash
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash"
                        checked={paymentDetails.paymentMethod === "Cash"}
                        onChange={handlePaymentDetailsChange}
                        className="mr-2"
                      />
                      Cash
                    </label>
                  </div>
                </div>
                <div className="flex justify-between font-bold mt-4">
                  <span>Total</span>
                  <span className="text-xl text-orange-500">₱7,840.00</span>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full"
                    onClick={handleProceedToPaymentSummary}
                  >
                    Proceed
                  </button>
                  <button className="bg-gray-400 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full">
                    Cancel
                  </button>
                </div>
                <div className="text-center mt-4 text-sm text-gray-500">
                  If you encounter any problems, make sure your browser is up to date.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingForm;