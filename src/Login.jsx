import React, { useState } from "react";
import { auth } from "./Firebase/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./Firebase/Firebase";

import loginpic from "./images/login.png";
import logo from "./images/logo1.png";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Staff"); // Default role is Staff
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanedEmail = email.toLowerCase().trim(); // Ensure consistency

      // Authenticate user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, cleanedEmail, password);
      const user = userCredential.user;

      console.log("✅ User authenticated:", user.email);

      // Determine which Firestore collection to query based on the selected role
      const collectionName = role === "Admin" ? "Admin" : "users"; // Query "Admin" or "users" collection
      const usersCollection = collection(db, collectionName);
      const q = query(usersCollection, where("Email", "==", cleanedEmail)); // Query by email
      console.log("🔍 Querying Firestore for email:", cleanedEmail);

      const querySnapshot = await getDocs(q);
      console.log("📊 Query Snapshot Size:", querySnapshot.size);

      if (querySnapshot.empty) {
        console.error("🚨 Firestore Query Error: No matching user found!");
        throw new Error(`No ${role} found with that email. Please check your credentials.`);
      }

      const userData = querySnapshot.docs[0].data();
      const userRole = userData.Role; // Get user role from Firestore

      console.log("🎭 Fetched Firestore Role:", userRole);

      // Validate if the selected role matches the user's role in Firestore
      if (role !== userRole) {
        throw new Error(`You do not have access to the ${role} side.`);
      }

      // Save login state and role to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", userRole);

      alert("✅ Login Successful!");
      setIsLoggedIn(true);

      // Redirect based on role
      navigate(userRole === "Admin" ? "/admin" : "/");
    } catch (err) {
      console.error("❌ Login error:", err.code || err.message);

      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with that email. Please check your credentials.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email.");
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="w-1/2 relative"
        style={{
          backgroundImage: `url(${loginpic})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          height: "100vh",
          width: "50vw",
        }}
      ></div>

      <div className="w-1/2 flex items-center justify-center">
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              >
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "LOGIN"}
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
}

export default Login;