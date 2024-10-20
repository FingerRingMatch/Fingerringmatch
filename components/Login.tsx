'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { signInWithEmail, signInWithGoogle } from '../lib/auth';
import { ModalForm } from './Modal';

interface LoginProps {
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      onClose(); // Close the modal on successful login
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  const handleSignUp = () => {
    setShowModal(true);
  }


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
              onChange={(e) => setEmail(e.target.value)} // Update email state
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center mb-4">
            <a href="#" className="ml-auto text-primaryPink">Forgot Password?</a>
          </div>
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
