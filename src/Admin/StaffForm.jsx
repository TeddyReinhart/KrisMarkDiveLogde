import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, X } from "lucide-react";

const StaffForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Only allow digits and limit to 11 characters
      const numericValue = value.replace(/\D/g, "").slice(0, 11);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required field validations
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation - must be exactly 11 digits
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (formData.phone.length !== 11) {
      errors.phone = "Phone number must be exactly 11 digits";
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form Data:", formData);
      setShowSuccessModal(true);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
    setShowSuccessModal(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Success</h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Invitation Sent!</h3>
              <p className="text-gray-500">
                An invitation has been sent to {formData.email}. They will receive instructions to create their account.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Create Another
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Staff Account Creation</h1>
        <div className="h-1 w-16 bg-orange-500 mb-6"></div>
        
        <p className="mb-8 text-gray-600">
          Send an invitation to grant website access. For designers, developers, or marketers,
          consider providing collaborator access instead.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-3 border ${formErrors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-colors`}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                {formErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-3 border ${formErrors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-colors`}
                    required
                    placeholder="Enter last name"
                  />
                </div>
                {formErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-3 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-colors`}
                    required
                    placeholder="email@example.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={11}
                    className={`pl-10 block w-full px-4 py-3 border ${formErrors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-colors`}
                    required
                    placeholder="+63"
                  />
                </div>
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-3 border ${formErrors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-colors`}
                    required
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 block w-full px-4 py-3 border ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-colors`}
                    required
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm} // Changed to use resetForm for consistency
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;