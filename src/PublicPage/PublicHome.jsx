import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./PublicNavbar";
import Footer from "./Footer";
import { FaCalendarAlt, FaUsers, FaBed, FaArrowRight, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";
import backgroundImage from "./Images/Background.png";
import underwaterImage from './Images/Picture1.png';
import contactImage from './Images/ContactUsPic.png';
import Pic1 from "./Images/Pic1.png";
import Pic2 from "./Images/Pic2.png";
import Pic3 from "./Images/Pic3.png";
import Pic4 from "./Images/Pic4.png";
import Pic5 from "./Images/Pic5.png";
import Pic6 from "./Images/Pic6.png";
import Pic7 from "./Images/Pic7.png";
import Pic8 from "./Images/Pic8.png";
import Pic9 from "./Images/Pic9.png";

const PublicHome = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hoveredImage, setHoveredImage] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Handle image loading
  useEffect(() => {
    let loadedImages = 0;
    const totalImages = 2; // Background image + Contact Us image

    const handleImageLoad = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setLoading(false); // Set loading to false once all images are loaded
      }
    };

    // Load background image
    const bgImage = new Image();
    bgImage.src = backgroundImage;
    bgImage.onload = handleImageLoad;

    // Load contact us image
    const contactImg = new Image();
    contactImg.src = contactImage;
    contactImg.onload = handleImageLoad;

    // Cleanup
    return () => {
      bgImage.onload = null;
      contactImg.onload = null;
    };
  }, []);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const roomImages = [
    {
      id: 1,
      src: Pic3, 
      alt: 'Twin Room with teal walls and comfortable beds',
      type: 'Twin Room'
    },
    {
      id: 2,
      src: Pic2, 
      alt: 'Twin Room with multiple beds and bright decor',
      type: 'Twin Room'
    },
    {
      id: 3,
      src: Pic6, 
      alt: 'Standard Double Room with comfortable beds',
      type: 'Standard Double Room'
    },
    {
      id: 4,
      src: Pic4, 
      alt: 'Standard Double with wooden furniture',
      type: 'Standard Double Room'
    },
    {
      id: 5,
      src: Pic5, 
      alt: 'Triple Room with warm lighting and comfortable beds',
      type: 'Triple Room'
    },
    {
      id: 6,
      src: Pic1, 
      alt: 'Triple Room with large bed',
      type: 'Triple Room'
    },
    {
      id: 7,
      src: Pic7, 
      alt: 'Bunk beds for groups or families',
      type: 'Family Room'
    },
    {
      id: 8,
      src: Pic8, 
      alt: 'Family Room with multiple beds',
      type: 'Family Room'
    },
    {
      id: 9,
      src: Pic9, 
      alt: 'Standard Double Room with comfortable beds',
      type: 'Standard Double  Room'
    }
  ];

  const offers = [
    { id: 1, title: "Standard Double Room", subtitle: "Cozy comfort for two", price: "₱1,500", image: Pic4 },
    { id: 2, title: "Twin Room", subtitle: "Ideal for friends or family", price: "₱1,500", image: Pic2 },
    { id: 3, title: "Triple Room", subtitle: "Extra space for extra comfort", price: "₱2,000", image: Pic5 },
    {
      id: 4,
      title: "Family Room",
      subtitle: "Beachside retreat for the whole family",
      description: "A spacious and relaxing stay just steps from the beach, perfect for quality family time.",
      features: ["Private beach access", "Scenic ocean views", "Outdoor play area", "Bonfire & BBQ setup"],
      price: "₱3,800",
      image: Pic7,
    },
  ];
  

  // FAQ data
  const faqData = [
    {
        question: "How can I book a room?",
        answer: "You can book a room directly through our website using the reservation form, by emailing us at krismarkdivelodgemoalboal@gmail.com, or by calling us at 0947 520 3454. We recommend booking in advance to secure your preferred dates."
    },
    {
        question: "What are the check-in and check-out times?",
        answer: "Check-in time is 2:00 PM, and check-out time is 12:00 PM. Early check-in or late check-out may be available upon request, subject to availability and additional fees."
    },
    {
        question: "Do you have smoking and non-smoking rooms?",
        answer: "Yes, we offer both smoking and non-smoking rooms. Please specify your preference during booking. Smoking in non-smoking rooms will result in an additional cleaning fee."
    },
    {
        question: "Can I change or upgrade my room after check-in?",
        answer: "Room changes or upgrades after check-in are subject to availability. Please contact our front desk to inquire about available options and applicable fees."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept cash (Philippine Peso) and GCash only. Payment must be made on location, as we do not accept credit cards or online transactions."
    },
    {
        question: "What is the best season to visit your hotel?",
        answer: "The best time to visit Moalboal is during the dry season from November to May. The waters are clearest for diving between March and May. However, Krismark Dive Lodge is open year-round and offers a wonderful experience in any season."
    },
    {
        question: "Does Krismark Dive Lodge allow pets?",
        answer: "Yes, pets are welcome at our property! We kindly ask that you keep them supervised at all times and follow our pet-friendly policies for a comfortable stay."
    },
    {
        question: "Do you offer airport or shuttle transportation?",
        answer: "We do not have a dedicated airport shuttle, but we can assist in arranging private transfers upon request. Please contact us in advance for assistance."
    },
    {
        question: "What amenities are available at the lodge?",
        answer: "Our lodge offers free Wi-Fi, air-conditioned rooms, a dive center, and a communal lounge area. Additional amenities include on-site gear rental and tour assistance."
    }
];
    if (loading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
        </div>
      );
    }



  return (
    <div>
      <Navbar />
      <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center text-white text-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-opacity-80"></div>
      <div className="relative z-10 px-4 max-w-6xl mx-auto w-full">
        <div className="mb-16 transform transition-all duration-700 translate-y-0 opacity-100">
          <h2 className="text-lg md:text-xl uppercase tracking-widest mb-2 font-light">
            Discover Paradise
          </h2>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-lg">
            KRISMARK <span className="text-orange-500">DIVE LODGE</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-100">
            Experience world-class diving and luxurious comfort in the heart of Moalboal, Cebu
          </p>
        </div>
      </div>
    </section>

      <section id="overview" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        {/* Overview content stays the same */}
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 max-w-6xl mx-auto">
            {/* Left side - Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src={underwaterImage} 
                    alt="Vibrant underwater coral reef with tropical fish at Moalboal" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-orange-500 bg-opacity-20 -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-500 bg-opacity-20 -z-10"></div>
              </div>
            </div>

            {/* Right side - Text content */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-left text-blue-900">
                WELCOME TO <span className="text-orange-500">KRISMARK DIVE LODGE</span> – YOUR OCEAN ADVENTURE STARTS HERE!
              </h2>
              
              <p className="text-gray-700 leading-relaxed text-lg">
                Discover Krismark Dive Lodge in Moalboal—a hidden gem by the sea where adventure and relaxation collide. Feel the cool ocean breeze, explore vibrant marine life, and unwind in a cozy, welcoming haven designed to refresh your body and soul.
              </p>

              <p className="text-gray-700 leading-relaxed text-lg">
                The sea is calling, and your unforgettable escape begins here. Whether you're seeking thrills beneath the waves or tranquility by the shore, our lodge offers an experience that lingers long after you leave.
              </p>

              {/* Call to action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#rooms" className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full font-medium transition-colors duration-200 text-center cursor-pointer">
                  Explore Our Rooms
                </a>
                <a href="#contact" className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-full font-medium transition-colors duration-200 text-center">
                  Contact Us
                </a>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Eco-Friendly Stays</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Beachfront Access</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Cozy Rooms</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Sunset View Deck</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms section stays the same */}
      <section id="rooms" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <div>
                <span className="text-orange-500 font-medium uppercase tracking-wider">OUR ROOMS</span>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mt-2">
                  Savor Restful Moments
                </h2>
                <div className="w-32 h-1 bg-orange-500 mt-3"></div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                At Krismark Dive Lodge, we offer accommodations for every guest—solo travelers, couples, families, or groups. Choose from cozy Twin Rooms, spacious Family Rooms, versatile Triple Rooms, or elegant Standard Double Rooms. Each space is thoughtfully designed for comfort and convenience, providing the perfect base to explore. Your ideal stay starts here!
              </p>
            
            </div>
            
            {/* Right Side - Image Grid */}
            <div className="grid grid-cols-3 gap-3">
              {roomImages.map((image) => (
                <div 
                  key={image.id}
                  className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-24 sm:h-32 md:h-40 object-cover transition-transform duration-500 hover:scale-110" 
                  />
                  
                  {/* Hover Overlay */}
                  {hoveredImage === image.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
                      <span className="text-white text-sm font-medium">{image.type}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offers section stays the same */}
      <section id="offers" className="min-h-screen flex items-center justify-center bg-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Summer Staycation</h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Escape the ordinary with our special summer packages</p>
        </div>

        {/* Offers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {offers.slice(0, 3).map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(offer.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                {hoveredCard === offer.id && (
                  <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
                    <button
                      onClick={() => navigate("/public-booking")}
                      className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-orange-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{offer.subtitle}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-orange-600 text-lg">{offer.price}<span className="text-xs">/night</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Offer Card */}
        <div className="mt-8">
          <div
            className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
            onMouseEnter={() => setHoveredCard(4)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative">
                <img src={offers[3].image} alt={offers[3].title} className="w-full h-64 md:h-full object-cover" />
                {hoveredCard === 4 && (
                  <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center">
                    <button
                      onClick={() => navigate("/public-booking")}
                      className="bg-white text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-orange-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-6 flex flex-col justify-center">
                <h3 className="font-bold text-2xl mb-2">{offers[3].title}</h3>
                <p className="text-sm text-gray-500 mb-4">{offers[3].subtitle}</p>
                <p className="text-gray-600 mb-4">{offers[3].description}</p>
                <ul className="mb-6">
                  {offers[3].features.map((feature, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-600 text-2xl">{offers[3].price}<span className="text-sm">/night</span></span>
              
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/*Contact Us section */}
         <section id="contact" className="min-h-screen flex flex-col items-center justify-center bg-red-100 py-12">
        {/* Full-width Hero Banner */}
        <div className="relative w-full h-96 overflow-hidden">
          <img
            src={contactImage}
            alt="Underwater coral reef with diver"
            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
          />

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-opacity-40 px-4">
            <h1 className="text-4xl md:text-5xl font-bold">CONTACT KRISMARK</h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">DIVE LODGE</h2>
            <h3 className="text-lg md:text-xl">We Look Forward To Hearing From You</h3>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="w-full max-w-5xl bg-white p-8 rounded-lg shadow-lg mt-8">
          <h2 className="text-xl font-bold text-center mb-6">We Are Here To Help</h2>

          <p className="text-center mb-8 text-gray-600">
            No matter what your inquiry is regarding, there will always be someone to help you at Krismark Dive Lodge. Need to make a hotel booking? Have a question about a hotel rate? You will find all the right details below.
          </p>

          <div className="w-full max-w-4xl mx-auto">
            {/* Call us section */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold mb-2 text-blue-600 flex items-center justify-center space-x-2">
                <FaPhone className="text-orange-600 w-5 h-5" />
                <span>CALL US</span>
              </h3>
              <p className="text-gray-700">
                For general inquiries, please call{' '}
                <span className="font-semibold">09475203454</span>
              </p>
            </div>

            {/* Email us section */}
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="font-bold mb-2 text-blue-600 flex items-center justify-center space-x-2">
                <FaEnvelope className="text-orange-600 w-5 h-5" />
                <span>EMAIL US</span>
              </h3>
              <p className="text-gray-700">Please allow up to 48 hours for a response.</p>
              <p className="text-gray-700">
                Hotel reservations: <span className="font-semibold">krismarkdivelodgemoalboal@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      </section>

     {/* FAqs section */}
        <section id="Faqs" className="py-20 px-4 bg-gradient-to-b from-purple-50 to-purple-100">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <span className="text-orange-500 font-medium uppercase tracking-wider">Got Questions?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mt-2">FREQUENTLY ASKED QUESTIONS</h2>
              <div className="w-32 h-1 bg-orange-500 mt-3 mx-auto"></div>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Everything you need to know about your stay at Krismark Dive Lodge to ensure a seamless and enjoyable experience</p>
            </div>
            
            <div className="space-y-5">
              {faqData.map((faq, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border-l-4 ${
                    activeQuestion === index ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full p-5 text-left flex justify-between items-center hover:bg-blue-50 transition-colors"
                    aria-expanded={activeQuestion === index}
                    aria-controls={`faq-content-${index}`}
                  >
                    <span className={`font-medium text-lg ${activeQuestion === index ? 'text-blue-900' : 'text-gray-800'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                      activeQuestion === index ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {activeQuestion === index ? 
                        <FaChevronUp className="w-4 h-4" /> : 
                        <FaChevronDown className="w-4 h-4" />
                      }
                    </div>
                  </button>
                  
                  <div 
                    id={`faq-content-${index}`}
                    className={`transition-all duration-300 overflow-hidden ${
                      activeQuestion === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 pt-0 bg-white">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 text-blue-900">Still have questions?</h3>
              <p className="mb-6 text-gray-700">Our team is just a message away to assist with any additional inquiries</p>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Contact Us
                <FaArrowRight className="ml-2" />
              </a>

            </div>
          </div>
        </section>
      <Footer />
    </div>
  );
};
export default PublicHome;