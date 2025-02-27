// src/pages/Register.js
import React, { useState } from "react";
import { auth, db } from "./Firebase/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("Please fill all fields");
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
        name: name,
        email: email,
        role: role,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-6 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
