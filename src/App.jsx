import { createBrowserRouter, RouterProvider, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookingContext } from "./Staff Side/BookingContext";
import Navbar from "./Staff Side/Navbar";
import AdminNavbar from "./Admin/AdminNavbar";
import Home from "./Staff Side/Home";
import Booking from "./Staff Side/Booking";
import Guest from "./Staff Side/Guest";
import Settings from "./Staff Side/Settings";
import RoomAvailability from "./Staff Side/RoomAvailability";
import Login from "./Login";
import NewBooking from "./Staff Side/NewBooking";
import BookingForm from "./Staff Side/BookingForm";
import Payment from "./Staff Side/Payment";
import AdminHome from "./Admin/AdminHome"; // Import AdminHome
import AdminRoomAvailability from "./Admin/AdminRoomAvailability";
import AdminSetting from "./Admin/AdminSettings";
import AdminComplaints from "./Admin/AdminComplaints";
import AdminRoomManagement from "./Admin/AdminRoomManagement"; // Import AdminRoomManagement

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Check login state on component mount
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const loginHandler = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  const userRoutes = [
    { path: "booking", element: <Booking /> },
    { path: "guest", element: <Guest /> },
    { path: "settings", element: <Settings /> },
    { path: "room-availability", element: <RoomAvailability /> },
    { path: "new-booking", element: <NewBooking /> },
    { path: "create-booking", element: <BookingForm /> },
    { path: "payment", element: <Payment /> },
  ];

  const adminRoutes = [
    { path: "home", element: <AdminHome /> }, // Set AdminHome as default
    { path: "room-availability", element: <AdminRoomAvailability /> },
    { path: "room-management", element: <AdminRoomManagement /> }, // Add AdminRoomManagement route
    { path: "settings", element: <AdminSetting /> },
    { path: "complaints", element: <AdminComplaints /> },
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Navbar logoutHandler={logoutHandler} /> : <Navigate to="/login" />,
      children: [
        { index: true, element: isLoggedIn ? <Home /> : <Navigate to="/login" /> },
        ...userRoutes.map(route => ({
          ...route,
          element: isLoggedIn ? route.element : <Navigate to="/login" />,
        })),
      ],
    },
    {
      path: "/admin",
      element: isLoggedIn ? <AdminNavbar logoutHandler={logoutHandler} /> : <Navigate to="/login" />,
      children: [
        { index: true, element: <Navigate to="/admin/home" /> }, // Redirects to Admin Home
        ...adminRoutes.map(route => ({
          ...route,
          element: isLoggedIn ? route.element : <Navigate to="/login" />,
        })),
      ],
    },
    {
      path: "/login",
      element: <Login setIsLoggedIn={loginHandler} />,
    },
    {
      path: "*",
      element: <Navigate to={isLoggedIn ? "/" : "/login"} />, // Redirect unknown routes
    },
  ]);

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      <RouterProvider router={router} />
    </BookingContext.Provider>
  );
}

export default App;