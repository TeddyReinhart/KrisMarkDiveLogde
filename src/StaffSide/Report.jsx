import React, { useState } from "react";
import { db } from "../Firebase/Firebase"; // Ensure correct path
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomType: "",
    roomNo: "",
    issue: "",
    priority: "High",
    status: "Pending",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "reports"), formData);
      setShowModal(true);
    } catch (error) {
      console.error("Error adding report: ", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Maintenance Report</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Room Type:</label>
            <select
              name="roomType"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Room Type --</option>
              <option value="Twin Room">Twin Room</option>
              <option value="Triple Room">Triple Room</option>
              <option value="Standard Double">Standard Double</option>
              <option value="Family Room">Family Room</option>
            </select>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Room Number:</label>
            <input
              type="text"
              name="roomNo"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room Number"
            />
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Issue:</label>
            <textarea
              name="issue"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the issue..."
              rows="4"
            />
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level:</label>
            <select
              name="priority"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
            <select
              name="status"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-100 flex justify-center items-center z-50 shadow-lg">          
          <div className="bg-white p-6 rounded-lg shadow-2xl text-center relative">
            <h3 className="text-lg font-semibold">Report Submitted!</h3>
            <p className="text-gray-600 my-4">Your maintenance report has been successfully submitted.</p>
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/home")}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
