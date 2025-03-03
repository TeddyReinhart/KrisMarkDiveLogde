import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Admin/Register";
import AdminHome from "./Admin/AdminHome";
import ProtectedRoutes from "./ProtectedRoutes";
import Admin from "./Admin/Admin";
import AdminRoomManagement from "./Admin/AdminRoomManagement";
import Staff from "./StaffSide/Staff";
import Home from "./StaffSide/Home";
import RoomAvailability from "./StaffSide/RoomAvailability";
import BookingForm from "./StaffSide/BookingForm";
import BookRooms from "./StaffSide/BookRooms";
import BookHistory from "./StaffSide/BookHistory";
import Reports from "./Admin/Reports";
import ComplaintReportForm from './ComplaintReportForm';
import ReportsTable from './Admin/ReportsTable';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/Report" element={<ComplaintReportForm/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoutes requiredRole="admin">
              <Admin />{" "}
            </ProtectedRoutes>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="room-management" element={<AdminRoomManagement />} />
          <Route path="complaints" element={<ReportsTable />} />
          <Route path="admin-rooms-availablity" element={<RoomAvailability />} />
          <Route path="create-user" element={<Register />} />
          <Route path="reports" element={<Reports />} />
          {/* Add more nested routes here if needed */}
        </Route>

        {/* Staff Routes */}

        <Route
          path="/home"
          element={
            <ProtectedRoutes requiredRole="staff">
              <Staff />{" "}
            </ProtectedRoutes>
          }
        >
          <Route index element={<Home />} />
          <Route path="rooms-availability" element={<RoomAvailability />} />
          <Route
            path="rooms-availability/create-booking"
            element={<BookingForm />}
          />
          <Route path="book-rooms" element={<BookRooms />} />
          <Route path="book-history" element={<BookHistory />} />
        </Route>

        {/* Default Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
