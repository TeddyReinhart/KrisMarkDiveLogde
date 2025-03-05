import React, { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase"; // Use correct path based on your project structure
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";


const Reports = () => {
  const [reports, setReports] = useState([]);

  // Fetch Reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const reportsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsList);
    };

    fetchReports();
  }, []);

  // Mark report as done
  const handleMarkAsDone = async (id) => {
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, { status: "Completed" });

      // Update state to reflect change
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === id ? { ...report, status: "Completed" } : report
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Room Maintenance Reports</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-3 text-left">Room No.</th>
              <th className="p-3 text-left">Room Type</th>
              <th className="p-3 text-left">Issue</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="p-3">{report.roomNo}</td>
                <td className="p-3">{report.roomType}</td>
                <td className="p-3">{report.issue}</td>
                <td className={`p-3 ${report.priority === "High" ? "text-red-600" : "text-yellow-600"}`}>
                  {report.priority}
                </td>
                <td className="p-3">{report.status}</td>
                <td className="p-3">
                  {report.status !== "Completed" ? (
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => handleMarkAsDone(report.id)}
                    >
                      Mark as Done
                    </button>
                  ) : (
                    <span className="text-gray-500">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
