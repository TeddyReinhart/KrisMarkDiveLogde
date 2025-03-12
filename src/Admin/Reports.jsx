import React, { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase"; // Ensure correct path
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { CheckCircle, AlertTriangle, Loader } from "lucide-react";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Mark report as done
  const handleMarkAsDone = async (id) => {
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, { status: "Completed" });
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center mt-10 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 shadow-md"></div>
          <p className="text-gray-600 font-medium ">Loading...</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Room Maintenance Reports</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500">
                  <th className="p-4 text-left text-m font-bold text-gray-700">Room No.</th>
                  <th className="p-4 text-left text-m font-bold text-gray-700">Room Type</th>
                  <th className="p-4 text-left text-m font-bold text-gray-700">Issue</th>
                  <th className="p-4 text-left text-m font-bold text-gray-700">Priority</th>
                  <th className="p-4 text-left text-m font-bold text-gray-700">Status</th>
                  <th className="p-4 text-left text-m font-bold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-700">{report.roomNo}</td>
                    <td className="p-4 text-sm text-gray-700">{report.roomType}</td>
                    <td className="p-4 text-sm text-gray-700">{report.issue}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        {report.priority === "High" ? (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className={report.priority === "High" ? "text-red-600" : "text-yellow-600"}>
                          {report.priority}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        {report.status === "Completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Loader className="w-4 h-4 text-gray-600 animate-spin" />
                        )}
                        <span>{report.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {report.status !== "Completed" ? (
                        <button
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          onClick={() => handleMarkAsDone(report.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Done</span>
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
          {reports.length === 0 && (
            <div className="p-6 text-center text-gray-600">
              <p>No reports found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;