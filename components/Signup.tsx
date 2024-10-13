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

interface FirebaseError {
  code: string;
  message: string;
}

const SignUp: React.FC<SignUpProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

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
        console.log('Sending stored data to backend:', storedData);
      }
      localStorage.removeItem('modalFormValues');
      onClose();
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && 'message' in err) {
        const error = err as FirebaseError;
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Please try logging in or use a different email.');
            break;
          case 'auth/invalid-email':
            setError('The email address is not valid. Please check and try again.');
            break;
          case 'auth/weak-password':
            setError('The password is too weak. Please choose a stronger password.');
            break;
          case 'auth/network-request-failed':
            setError('Network error. Please check your internet connection and try again.');
            break;
          default:
            setError(`An unexpected error occurred: ${error.message}`);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      if (storedData) {
        console.log('Sending stored data to backend:', storedData);
      }
      localStorage.removeItem('modalFormValues');
      onClose();
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && 'message' in err) {
        const error = err as FirebaseError;
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            setError('Sign-up was cancelled. Please try again.');
            break;
          case 'auth/popup-blocked':
            setError('Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.');
            break;
          case 'auth/account-exists-with-different-credential':
            setError('An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.');
            break;
          default:
            setError(`An error occurred during Google sign-up: ${error.message}`);
        }
      } else {
        setError('An unexpected error occurred.');
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
