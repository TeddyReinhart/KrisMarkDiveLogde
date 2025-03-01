import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "./Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null); // Handle case where user is not authenticated
      }
      setLoading(false);
    };

    fetchUserRole();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>; // Show loading state while fetching role
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user role does not match the required role
  if (userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  // Render children if user is authenticated and has the required role
  return children;
};

export default ProtectedRoutes;
