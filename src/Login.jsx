import React, { useState, useEffect } from "react";
import { auth } from "./Firebase/Firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase/Firebase";

import loginpic from "./images/login.png";
import logo from "./images/logo1.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ UseEffect: Check Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User already signed in:", user.uid);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            throw new Error("User data not found.");
          }

          const role = userDoc.data().role;
          console.log("Detected user role:", role);

          if (role === "admin") {
            navigate("/admin-home", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    });

    return () => unsubscribe(); // Cleanup observer on unmount
  }, [navigate]);

  // Function to map Firebase error codes to user-friendly messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/user-not-found":
        return "User not found. Please check your email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User data not found. Please contact support.");
      }

      const role = userDoc.data().role;
      console.log("User role:", role);

      if (role === "admin") {
        navigate("/admin-home", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Background Image */}
      <div
        className="hidden lg:block w-1/2 relative"
        style={{
          backgroundImage: `url(${loginpic})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          height: "100vh",
        }}
      ></div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-20 h-20" />
          </div>

          <p className="text-center text-gray-600 mb-6">
            Please use your email and password to login
          </p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="text-center mt-2">
            <a href="#" className="text-sm text-gray-500 hover:underline">
              Trouble Logging in?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
