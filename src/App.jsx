import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AdminHome from './Admin/AdminHome';
import ProtectedRoutes from './ProtectedRoutes';
import Admin from './Admin/Admin';
import Staff from './Staff Side/Staff';
import Home from './Staff Side/Home';
import AdminRoomManagement from './Admin/AdminRoomManagement';


const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin-home"
          element={ <ProtectedRoutes requiredRole="admin"><Admin /> </ProtectedRoutes>}>

          <Route index element={<AdminHome />} />
          <Route path='room-management' element={ <AdminRoomManagement/>} />
          {/* Add more nested routes here if needed */}

        </Route>


        {/* Admin Routes */}
        <Route
          path="/home"
          element={ <ProtectedRoutes requiredRole="staff"><Staff /> </ProtectedRoutes>}>

          <Route index element={<Home/>} />
          {/* Add more nested routes here if needed */}
          
        </Route>





        {/* Default Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;