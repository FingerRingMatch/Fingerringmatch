'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { signInWithEmail, sendPasswordReset } from '../lib/auth'; // Assuming this function is available in your auth lib
import { ModalForm } from './Modal';
import { useRouter } from 'next/navigation';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [showModal, setShowModal] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null); // For login error messages
  const [resetError, setResetError] = useState<string | null>(null); // For password reset error messages
  const [resetSuccess, setResetSuccess] = useState<string | null>(null); // For success message on password reset
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null); // Reset error message before each attempt
    try {
      await signInWithEmail(email, password);
      router.push('/Feed');
      onClose(); // Close the modal on successful login
    } catch (error) {
      console.error('Error signing in:', error);
      setLoginError('Failed to sign in. Please check your email and password.');
    }
  };

  const handleSignUp = () => {
    setShowModal(true);
  };

  const handleForgotPassword = async () => {
    setResetError(null); // Reset error message before each attempt
    setResetSuccess(null); // Reset success message before each attempt
    try {
      await sendPasswordReset(email); // Assumes this function sends a reset email
      setResetSuccess('Password reset link has been sent to your email.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setResetError('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} priority />
        </div>
        <h2 className="text-lg font-bold text-center mb-4">Welcome back! Please Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">Email ID</label>
            <input
              type="text"
              id="email"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle input type between text and password
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-2 top-8 text-gray-500"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
          <div className="flex items-center mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="ml-auto text-primaryPink"
            >
              Forgot Password?
            </button>
          </div>
          {resetError && <p className="text-red-500 text-sm mb-4">{resetError}</p>}
          {resetSuccess && <p className="text-green-500 text-sm mb-4">{resetSuccess}</p>}
          <button
            type="submit"
            className="w-full bg-primaryPink text-white py-2 rounded-md hover:bg-opacity-50 transition"
          >
            Login
          </button>
          <p className="text-center my-2">OR</p>
          <button
            type="button"
            className="w-full mt-4 bg-primaryPink text-white py-2 rounded-md hover:bg-opacity-50 transition"
          >
            Login with OTP
          </button>
        </form>
        <div className="text-center mt-4">
          <span>New to Finger Ring? </span>
          <button onClick={handleSignUp} className="text-primaryPink">Sign Up Free</button>
        </div>
        <button
          className="absolute top-5 right-10 text-gray-600 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      {showModal && <ModalForm onClose={() => setShowModal(false)} onSubmit={(values) => console.log('Modal submitted:', values)} />}
    </div>
  );
};

export default Login;
