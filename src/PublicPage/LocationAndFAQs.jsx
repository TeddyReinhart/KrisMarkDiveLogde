import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LocationAndFAQs = () => {
  // State to track which FAQ item is open
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Toggle function for opening/closing FAQ items
  const toggleFAQ = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // FAQ data matching the image
  const faqs = [
    {
      question: "How can I book a room?",
      answer: "You can book a room through our website's booking system, by calling us at 0947 520 3454, or by sending us an email. We recommend booking in advance, especially during peak seasons."
    },
    {
      question: "What are the check-in and check-out time?",
      answer: "Check-in time is at 2:00 PM and check-out time is at 12:00 PM. Early check-in and late check-out can be arranged based on availability."
    },
    {
      question: "Do you have smoking and non-smoking rooms?",
      answer: "Yes, we offer both smoking and non-smoking rooms. Please specify your preference when making a reservation."
    },
    {
      question: "Can I change or upgrade my room after check-in?",
      answer: "Yes, room changes or upgrades are possible depending on availability. Please contact our front desk for assistance."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, PayPal, bank transfers, and cash payments in Philippine Peso."
    },
    {
      question: "What is the best season to visit your hotel?",
      answer: "The best time to visit is from December to May during the dry season. However, Moalboal offers great diving experiences year-round."
    },
    {
      question: "Does Krismark Dive Lodge allow pets?",
      answer: "We regret that pets are not allowed at Krismark Dive Lodge, with the exception of service animals."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* LOC AND FAQS header */}
      <div className="bg-gray-300 text-blue-500 p-2">
        LOC AND FAQS
      </div>

      {/* Location section with blue border */}
      <div className="border-2 border-blue-400 p-6 flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <h3 className="text-orange-500 font-medium mb-4">OUR LOCATION</h3>
          
          <h2 className="text-lg font-bold mb-4">GETTING HERE</h2>
          
          <div className="mb-6">
            <p className="font-medium">Krismark Dive Lodge</p>
            <p>Panagsama Beach, Moalboal, Cebu,</p>
            <p>Moalboal, Philippines, 6032</p>
            
            <div className="flex items-center mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>0947 520 3454</span>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          {/* Map image placeholder */}
          <div className="w-full h-48 md:h-full bg-blue-100 rounded">
            <img 
              src="/api/placeholder/400/300" 
              alt="Map of Krismark Dive Lodge location" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="border-2 border-blue-400 border-t-0 p-6">
        <h2 className="text-center font-bold text-xl mb-6">FREQUENTLY ASKED QUESTIONS</h2>
        
        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300">
              <button
                className="w-full py-4 px-1 flex items-center justify-between text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform ${openFaqIndex === index ? "transform rotate-180" : ""}`} 
                />
              </button>
              
              {openFaqIndex === index && (
                <div className="pb-4 px-1">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationAndFAQs;