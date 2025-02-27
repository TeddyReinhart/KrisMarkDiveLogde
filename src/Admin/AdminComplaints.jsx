import React from "react";
import { FileText } from "lucide-react"; // Importing an icon for export
import logo from "../images/logo.png"; // Ensure you have a logo
import { useNavigate } from "react-router-dom";

const complaintsData = [
  {
    date: "2024-12-05",
    customer: "John Smith",
    room: "01",
    complaint: "Airconditioning not working",
    action: "Technician sent, fixed the issue",
    resolution: "",
  },
  {
    date: "2024-11-10",
    customer: "Marie Alonzo",
    room: "03",
    complaint: "Wifi connectivity issues",
    action: "IT staff contacted; issue resolved",
    resolution: "",
  },
  {
    date: "2024-11-01",
    customer: "Ahmed Khan",
    room: "06",
    complaint: "Tv not working",
    action: "Sent technician; replaced remote",
    resolution: "",
  },
  {
    date: "2024-10-29",
    customer: "Emily Paris",
    room: "01",
    complaint: "Missing toiletries",
    action: "Provided toiletries immediately",
    resolution: "",
  },
  {
    date: "2024-09-09",
    customer: "Lisa Wong",
    room: "05",
    complaint: "Slow check-in process",
    action: "Apology and expedited check-in",
    resolution: "",
  },
];

const AdminComplaints = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    alert("Exporting data to Excel... (Functionality to be implemented)");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    
      {/* Title & Export Button */}
      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">List of Customer Complaint Records</h2>
      </div>

      {/* Complaints Table */}
      <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="p-3 text-left">Date of Complaint</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Room Number</th>
              <th className="p-3 text-left">Complaint</th>
              <th className="p-3 text-left">Actions Taken</th>
              <th className="p-3 text-left">Resolution Status</th>
            </tr>
          </thead>
          <tbody>
            {complaintsData.map((complaint, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-3">{complaint.date}</td>
                <td className="p-3">{complaint.customer}</td>
                <td className="p-3">{complaint.room}</td>
                <td className="p-3">{complaint.complaint}</td>
                <td className="p-3">{complaint.action}</td>
                <td className="p-3">{complaint.resolution || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaints;
