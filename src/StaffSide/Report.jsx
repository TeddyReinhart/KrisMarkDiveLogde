import React, { useState } from "react";
import { db } from "../Firebase/Firebase"; // Ensure correct path
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Report = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [formData, setFormData] = useState({
    roomType: "",
    roomNo: "",
    issue: "",
    priority: "High",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reports"), formData);
      alert("Report submitted successfully!");
      navigate("/home"); // Redirect to staff home page after submission
    } catch (error) {
      console.error("Error adding report: ", error);
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Maintenance Report</h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
        <label className="block mb-2">Select Room Type:</label>
        <select name="roomType" onChange={handleChange} required className="w-full p-2 mb-4 border rounded">
          <option value="">-- Select Room Type --</option>
          <option value="Twin Room">Twin Room</option>
          <option value="Triple Room">Triple Room</option>
          <option value="Standard Double">Standard Double</option>
          <option value="Family Room">Family Room</option>
        </select>

        <label className="block mb-2">Enter Room Number:</label>
        <input type="text" name="roomNo" onChange={handleChange} required className="w-full p-2 mb-4 border rounded" />

        <label className="block mb-2">Describe the issue:</label>
        <textarea name="issue" onChange={handleChange} required className="w-full p-2 mb-4 border rounded"></textarea>

        <label className="block mb-2">Priority Level:</label>
        <select name="priority" onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <label className="block mb-2">Status:</label>
        <select name="status" onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="Pending">Pending</option>
          <option value="In progress">In progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default Report;
