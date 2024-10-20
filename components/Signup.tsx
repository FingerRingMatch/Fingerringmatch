'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { signUpWithEmail, signInWithGoogle } from '../lib/auth';
import { useFormContext } from '@/context/formContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase storage
import { storage } from '@/lib/firebase'


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
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = useFormContext();

  useEffect(() => {
    const storedValues = localStorage.getItem('modalFormValues');
    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      setStoredData(parsedValues);
      console.log(storedData)
      setEmail(parsedValues.email || '');
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    console.log('Starting signup process...'); // Debug log

    try {
      // Basic validation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Attempting Firebase signup...'); // Debug log
      
      // First create the Firebase user
      const firebaseResponse = await signUpWithEmail(email, password);
      console.log('Firebase signup successful:', firebaseResponse.user.uid); // Debug log

      // Upload profile picture to Firebase Storage
      const file = formData.profilePic;
      let profilePicUrl = '';
      if (file) {
        const storageRef = ref(storage, `profile_pictures/${firebaseResponse.user.uid}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        profilePicUrl = await getDownloadURL(snapshot.ref); // Get the file's URL
  
       
        console.log('Profile pic uploaded, URL:', profilePicUrl); // Debug log
      }
      // Prepare the data for your backend
      const userData = {
        email,
        firebaseUid: firebaseResponse.user.uid,
        profilePic: profilePicUrl,
        formData: {
          ...formData,
          email: email,
        }
      };

      console.log('Sending data to backend:', userData); // Debug log

      // Send data to your backend API
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        console.log('API Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error response:', errorText); // Debug log
          throw new Error(`API Error: ${errorText}`);
        }

        const data = await response.json();
        console.log('API Success response:', data); // Debug log

        // Clear stored data and close modal
        localStorage.removeItem('modalFormValues');
        onClose();

      } catch (apiError) {
        console.error('API call failed:', apiError); // Debug log
        throw new Error('Failed to save user data. Please try again.');
      }

    } catch (err) {
      console.error('Signup error:', err); // Debug log

      if (typeof err === 'object' && err !== null && 'code' in err) {
        const firebaseError = err as FirebaseError;
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered');
            break;
          case 'auth/invalid-email':
            setError('Invalid email address');
            break;
          case 'auth/operation-not-allowed':
            setError('Email/password accounts are not enabled. Please contact support.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak');
            break;
          default:
            setError(`Firebase error: ${firebaseError.message}`);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primaryPink text-white py-2 rounded-md hover:bg-opacity-50 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

       
        <button
          className="absolute top-5 right-10 text-gray-600 text-3xl"
          onClick={onClose}
          disabled={isLoading}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SignUp;