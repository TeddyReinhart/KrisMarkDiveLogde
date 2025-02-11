import './App.css';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import Home from './Home';
import Booking from './Booking';
import NewBooking from './NewBooking';
import Guest from './Guest';
import BookingForm from './BookingForm';
import Settings from './Settings';
import Login from './Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Lifted authentication state

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        {isLoggedIn ? (
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<ProtectedRoute element={<Booking />} />} />
            <Route path="new-booking" element={<ProtectedRoute element={<NewBooking />} />} />
            <Route path="guest" element={<ProtectedRoute element={<Guest />} />} />
            <Route path="settings" element={<ProtectedRoute element={<Settings />} />} />
            <Route path="booking-form" element={<ProtectedRoute element={<BookingForm />} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
