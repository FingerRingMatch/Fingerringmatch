'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { signUpWithEmail, signInWithGoogle } from '../lib/auth';

interface SignUpProps {
  onClose: () => void;
}

interface StoredFormData {
  email: string;
  phone: string;
  [key: string]: string;
}

const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [storedData, setStoredData] = useState<StoredFormData | null>(null);

  useEffect(() => {
    const storedValues = localStorage.getItem('modalFormValues');
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      setStoredData(parsedValues);
      setEmail(parsedValues.email || '');
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords are identical.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long. Please choose a stronger password.');
      return;
    }

    try {
      await signUpWithEmail(email, password);
      if (storedData) {
        // Implement your logic to send storedData to the backend
        console.log('Sending stored data to backend:', storedData);
      }
      localStorage.removeItem('modalFormValues'); // Clear stored data after successful sign-up
      onClose();
    } catch (error: any) {
      // Handle specific error types
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in or use a different email.');
      } else if (error.code === 'auth/invalid-email') {
        setError('The email address is not valid. Please check and try again.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(`An unexpected error occurred: ${error.message}`);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      if (storedData) {
        // Implement your logic to send storedData to the backend
        console.log('Sending stored data to backend:', storedData);
      }
      localStorage.removeItem('modalFormValues');
      onClose();
    } catch (error: any) {
      // Handle specific Google Sign-In errors
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.');
      } else {
        setError(`An error occurred during Google sign-up: ${error.message}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} priority />
        </div>
        <h2 className="text-lg font-bold text-center mb-4">Sign Up</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primaryPink text-white py-2 rounded-md hover:bg-opacity-50 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center my-2">OR</p>
        <button
          type="button"
          className="w-full bg-primaryPink text-white py-2 rounded-md hover:bg-opacity-50 transition"
          onClick={handleGoogleSignUp}
        >
          Sign Up with Google
        </button>

        <button
          className="absolute top-5 right-10 text-gray-600 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SignUp;