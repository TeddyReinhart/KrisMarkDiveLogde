import React, { useState } from 'react';
import { auth } from './Firebase/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import pic1 from './images/pic1.png';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful!');
      setIsLoggedIn(true); // Update authentication state
      navigate('/'); // Redirect to Home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${pic1})` }}>
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg w-96 shadow-lg">
          <h2 className="text-center text-xl font-bold mb-6">STAFF LOGIN</h2>
          <p className="text-center text-gray-600 mb-4">Please enter your email and password</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-md" 
                placeholder="Enter your email" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded-md" 
                placeholder="Enter your password" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
              LOGIN
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
