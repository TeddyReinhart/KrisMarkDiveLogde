import React from "react";

const BookingForm = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Given/First Name*</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Athena" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile Number*</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="09483987264" />
          </div>
          <div>
            <label className="block text-sm font-medium">Family/Last Name*</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Kim" />
          </div>
          <div>
            <label className="block text-sm font-medium">Country/Region*</label>
            <select className="w-full p-2 border rounded-md">
              <option>Philippines</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Email Address*</label>
            <input type="email" className="w-full p-2 border rounded-md" placeholder="athenakim@gmail.com" />
          </div>
          <div>
            <label className="block text-sm font-medium">Special Request*</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="None" />
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mt-6 mb-4">Billing Information</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name on Card*</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Credit Card Number*</label>
            <input type="text" className="w-full p-2 border rounded-md" />
          </div>
          <div className="col-span-2 flex space-x-2">
            <div>
              <label className="block text-sm font-medium">Expiration Date*</label>
              <select className="p-2 border rounded-md">
                <option>January</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Year</label>
              <select className="p-2 border rounded-md">
                <option>2026</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg">Checkout →</button>
      </div>
    </div>
  );
};

export default BookingForm;
