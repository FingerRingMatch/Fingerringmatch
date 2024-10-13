'use client'
import React, { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { useAuth } from '@/context/authContext';

const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      <button onClick={handleGoogleSignIn} className="mt-4 bg-red-500 text-white p-2 rounded">
        Sign in with Google
      </button>
      {loading && <p>Loading...</p>}
      {user && <p>Welcome back, {user.email}</p>}
    </div>
  );
};

export default Login;
