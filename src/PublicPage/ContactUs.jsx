import React from 'react';
import contactImage from '../PublicPage/Images/ContactUsPic.png';

const ContactUs = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Hero banner with underwater diving image */}
      <div className="relative h-72">
        <img 
          src={contactImage}
          alt="Underwater coral reef with diver" 
          className="w-full h-full object-cover"
        />
        
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-3xl font-bold">CONTACT KRISMARK</h1>
          <h2 className="text-2xl font-bold mb-2">DIVE LODGE</h2>
          <p className="text-lg">We Look Forward To Hearing From You</p>
        </div>
      </div>

      {/* Contact information section */}
      <div className="bg-white p-8">
        <h2 className="text-xl font-bold text-center mb-6">We Are Here To Help</h2>
        
        <p className="text-center mb-8">
          No matter what your enquiry is regarding, there will always be someone to help you at Krismark Dive Lodge. Need to make a hotel booking? Have a question about a hotel rate? You will find all the right details below.
        </p>
        
        <div className="max-w-xl mx-auto space-y-6">
          {/* Call us section */}
          <div className="text-center">
            <h3 className="font-bold mb-2">CALL US</h3>
            <p>For general enquiries, please call 09475203454</p>
          </div>
          
          {/* Email us section */}
          <div className="text-center">
            <h3 className="font-bold mb-2">EMAIL US</h3>
            <p>Please allow up to 48 hours for a response.</p>
            <p>Hotel reservations: KrismarkDiveLodgemoalboal@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;