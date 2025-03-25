import React, { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase"; // Ensure correct path
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { CheckCircle, AlertTriangle, Loader, ClipboardList, Info, Filter } from "lucide-react";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Fetch Reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportsList = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          if (data.imageUrl) {
            const imageRef = ref(storage, data.imageUrl);
            data.imageUrl = await getDownloadURL(imageRef);
          }
          return { id: doc.id, ...data };
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

  // Filter reports
  const filteredReports = filter === "All" 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-orange-500 shadow-lg"></div>
          <p className="text-gray-600 font-medium mt-4 text-lg">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gradient-to-r from-orange-100 to-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3">
              <ClipboardList size={24} className="text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Room Maintenance Reports</h2>
                <p className="text-gray-600 text-sm">Track and manage maintenance requests</p>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2 border-l-4 border-green-500">
                <CheckCircle className="text-green-500" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Completed</p>
                  <p className="font-bold text-gray-800">
                    {reports.filter(r => r.status === "Completed").length}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-2 border-l-4 border-yellow-500">
                <Loader className="text-yellow-500" size={16} />
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="font-bold text-gray-800">
                    {reports.filter(r => r.status !== "Completed").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls - Now right-aligned */}
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
                  onClick={() => setFilter("Completed")} 
                  className={`px-3 py-1 text-sm rounded-full ${filter === "Completed" 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Completed
                </button>
                <button 
                  onClick={() => setFilter("Pending")} 
                  className={`px-3 py-1 text-sm rounded-full ${filter === "Pending" 
                    ? "bg-yellow-500 text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
                  <th className="p-4 text-left text-sm font-semibold">Room No.</th>
                  <th className="p-4 text-left text-sm font-semibold">Room Type</th>
                  <th className="p-4 text-left text-sm font-semibold">Issue</th>
                  <th className="p-4 text-left text-sm font-semibold">Priority</th>
                  <th className="p-4 text-left text-sm font-semibold">Status</th>
                  <th className="p-4 text-left text-sm font-semibold">Image</th>
                  <th className="p-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-700">{report.roomNo}</td>
                      <td className="p-4 text-sm text-gray-600">{report.roomType}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs">
                        <div className="flex items-start gap-2">
                          <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{report.issue}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.priority === "High" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          <AlertTriangle size={12} />
                          {report.priority}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          report.status === "Completed" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {report.status === "Completed" ? (
                            <CheckCircle size={12} />
                          ) : (
                            <Loader size={10} className="animate-spin" />
                          )}
                          {report.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {report.imageUrl ? (
                          <img src={report.imageUrl} alt="Report" className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {report.status !== "Completed" ? (
                          <button
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5 text-xs font-medium shadow-sm"
                            onClick={() => handleMarkAsDone(report.id)}
                          >
                            <CheckCircle size={14} />
                            Mark as Done
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <ClipboardList size={32} className="text-gray-300 mb-2" />
                        <p>No {filter !== "All" ? filter.toLowerCase() : ""} reports found.</p>
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
};

export default Reports;
