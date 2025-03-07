import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ConfirmationModal = ({ isOpen, onConfirm }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleConfirm = () => {
    onConfirm(); // Call the onConfirm function passed from the parent
    navigate("/"); // Redirect to the home page
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Booking Confirmed!!</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleConfirm} // Use handleConfirm instead of onConfirm
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;