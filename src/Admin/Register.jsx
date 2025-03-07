// src/pages/Register.js
import React, { useState } from "react";
import { auth, db } from "../Firebase/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Step 2: Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        role: "staff", // Default role set to "staff"
        createdAt: new Date(),
      });

      alert("Registration successful!");
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Back Button (Outside the form container) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-10 left-80 text-black font-bold  text-3xl"
      >
        <span className="text-orange-500 text-4xl">&larr;</span> Account
      </button>

      {/* Main Form Container */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-6xl flex">
        {/* Left Side: Text Content */}
        <div className="w-1/2 pr-8 border-r border-gray-200">
          <h1 className="text-2xl font-bold mb-4">STAFF ACCOUNT CREATION FORM</h1>
          <p className="text-black mb-4 pl-5">
            <strong>Staff Account</strong>
          </p>
          <p className="text-black  font-bold mb-4 pl-5">
            Provide your staff or receptionist access to the website by sending them an invitation. Ensure they have the appropriate permissions to perform their tasks efficiently.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-1/2 pl-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Staff Account Creation</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Firstname*</label>
                <input
                  type="text"
                  placeholder="Firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Lastname*</label>
                <input
                  type="text"
                  placeholder="Lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Email address*</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Phone number*</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Confirm Password*</label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            {/* Buttons aligned to the right */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-300 font-bold text-gray-700 p-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 font-bold text-black p-2 rounded hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Sending invite..." : "Send invite"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;