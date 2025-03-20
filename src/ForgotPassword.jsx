import React, { useState } from "react";
import { auth } from "./Firebase/Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from "./images/logo1.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/login", // Redirect URL after reset
        handleCodeInApp: true,
      });
      setMessage("If an account exists, a password reset link has been sent to your email.");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      console.error("Password reset error:", error.code, error.message);
      switch (error.code) {
        case "auth/user-not-found":
          // Don't reveal if user exists for security
          setMessage("If an account exists, a reset link has been sent.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;
        default:
          setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Krismark Dive Lodge Logo" className="w-20 h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}

        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="block text-sm font-medium">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter your email address"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition flex items-center justify-center disabled:bg-orange-400"
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
                Sending...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-500 hover:underline disabled:text-gray-400"
            disabled={loading}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;