import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Adjust the path to your Firebase config
import { AlertTriangle, MessageSquare, Calendar, Clock, AlertCircle, Filter, CheckCircle } from "lucide-react";

function ReportsTable() {
  const [complaints, setComplaints] = useState([]); // State to store complaints
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [filter, setFilter] = useState("All"); // Filter state

  // Fetch complaints from Firestore
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsCollection = collection(db, "complaintReports"); // Reference the "complaintReports" collection
        const complaintsSnapshot = await getDocs(complaintsCollection);
        const complaintsData = complaintsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComplaints(complaintsData); // Update state with fetched complaints
      } catch (err) {
        console.error("Error fetching complaints: ", err);
        setError("Failed to fetch complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Filter complaints based on priority
  const filteredComplaints = filter === "All" 
    ? complaints 
    : complaints.filter(complaint => complaint.priority === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-orange-500 shadow-lg"></div>
          <p className="text-gray-600 font-medium mt-4 text-lg">Loading complaints...</p>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gradient-to-r from-orange-100 to-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3">
              <MessageSquare size={24} className="text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Complaint Reports</h2>
                <p className="text-gray-600 text-sm">Track and manage guest complaints</p>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2 border-l-4 border-red-500">
                <AlertTriangle className="text-red-500" size={16} />
                <div>
                  <p className="text-xs text-gray-500">High Priority</p>
                  <p className="font-bold text-gray-800">
                    {complaints.filter(c => c.priority === "High").length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2 border-l-4 border-yellow-500">
                <AlertCircle className="text-yellow-500" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Medium Priority</p>
                  <p className="font-bold text-gray-800">
                    {complaints.filter(c => c.priority === "Medium").length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2 border-l-4 border-green-500">
                <CheckCircle className="text-green-500" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Low Priority</p>
                  <p className="font-bold text-gray-800">
                    {complaints.filter(c => c.priority === "Low").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border-l-4 border-red-500">
              <AlertTriangle size={18} />
              <p>{error}</p>
            </div>
          )}

          {/* Filter Controls - Right aligned */}
          <div className="flex justify-end mb-6">
            <div className="bg-white p-3 rounded-lg shadow-sm inline-flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Filter size={16} />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter("All")} 
                  className={`px-3 py-1 text-sm rounded-full ${filter === "All" 
                    ? "bg-orange-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter("High")} 
                  className={`px-3 py-1 text-sm rounded-full ${filter === "High" 
                    ? "bg-red-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  High
                </button>
                <button 
                  onClick={() => setFilter("Medium")} 
                  className={`px-3 py-1 text-sm rounded-full ${filter === "Medium" 
                    ? "bg-yellow-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => setFilter("Low")} 
                  className={`px-3 py-1 text-sm rounded-full ${filter === "Low" 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Low
                </button>
              </div>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg ring-1 ring-gray-100">
  <table className="w-full border-collapse min-w-[1000px]"> {/* Added min-width for better scrolling */}
    <thead>
      <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide sticky left-0 bg-gradient-to-r from-orange-500 to-orange-600">
          Room
        </th>
        <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Title</th>
        <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Description</th>
        <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Date</th>
        <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Priority</th>
        <th className="p-4 text-left text-sm font-semibold uppercase tracking-wide">Created At</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {filteredComplaints.length > 0 ? (
        filteredComplaints.map((complaint) => (
          <tr 
            key={complaint.id} 
            className="hover:bg-gray-50 transition-all duration-200 ease-in-out hover:shadow-sm"
          >
            <td className="p-4 text-sm font-medium text-gray-700 sticky left-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold shadow-sm transform transition-transform hover:scale-105">
                  {complaint.room}
                </div>
              </div>
            </td>
            <td className="p-4 text-sm font-medium text-gray-800">
              <span className="truncate block max-w-[200px]">{complaint.title}</span>
            </td>
            <td className="p-4 text-sm text-gray-600">
              <div className="max-w-xs relative group">
                <span className="truncate block">{complaint.description}</span>
                {/* Tooltip for full description */}
                <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 -top-10 left-0 w-64">
                  {complaint.description}
                </div>
              </div>
            </td>
            <td className="p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                <span className="whitespace-nowrap">{complaint.date}</span>
              </div>
            </td>
            <td className="p-4 text-sm">
              <span 
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-sm transform transition-transform hover:scale-105 ${
                  complaint.priority === "High"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : complaint.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    : "bg-green-100 text-green-800 border border-green-200"
                }`}
              >
                {complaint.priority === "High" ? (
                  <AlertTriangle size={14} />
                ) : complaint.priority === "Medium" ? (
                  <AlertCircle size={14} />
                ) : (
                  <CheckCircle size={14} />
                )}
                {complaint.priority}
              </span>
            </td>
            <td className="p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {new Date(complaint.createdAt).toLocaleString()}
                </span>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="p-12 text-center text-gray-500 bg-gray-50">
            <div className="flex flex-col items-center gap-4">
              <MessageSquare size={40} className="text-gray-300 animate-pulse" />
              <p className="text-base font-medium">
                No {filter !== "All" ? filter.toLowerCase() + " priority" : ""} complaints found
              </p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
        </>
      )}
    </div>
  );
}

export default ReportsTable;