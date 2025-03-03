import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Adjust the path to your Firebase config

function ReportsTable() {
  const [complaints, setComplaints] = useState([]); // State to store complaints
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center">Complaint Reports</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-600">Loading complaints...</div>
        ) : (
          /* Complaints Table */
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Room
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Priority
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                      {complaint.room}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                      {complaint.description}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                      {complaint.date}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          complaint.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : complaint.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                      {new Date(complaint.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsTable;