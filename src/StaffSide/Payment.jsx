import React, { useState } from "react";

function Payment() {
  const [formData, setFormData] = useState({
    title: "Mrs.",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if the required fields are filled
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      alert("Please fill in all required fields.");
    } else {
      console.log(formData); // For testing, log form data when valid
      // Submit the form logic (to be implemented)
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Payment Portal Header */}
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-3xl font-bold">Payment Portal</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Billing Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium mb-2 required-asterisk">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
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
                  value={formData.firstName}
                  onChange={handleChange}
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
                  value={formData.lastName}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Phone Number"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Payment Options Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4">Payment Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium mb-2">Payment Methods</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value="GCash, Cash"
                readOnly
              />
            </div>
            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span className="text-xl text-orange-500">₱7,840.00</span>
            </div>
            <div className="flex space-x-4 mt-6">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold w-full">
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
  );
}

export default Payment;
