'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ModalForm } from './Modal';
import Login from '../components/Login';
import { useAuth } from '@/context/authContext'; // Assume this provides user and logout methods
import { useParams } from 'next/navigation';

function Navbar() {
  const { user, logout } = useAuth();
  const {id} = useParams();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  }
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        // Make sure that user is available and contains an email before making the API call
        if (!user || !user.email) {
          console.error("User or email is missing");
          return;
        }

        const response = await fetch(`/api/getprofilepic?email=${user.email}`);
        const data = await response.json();

        if (data.profilePic) {
          setProfilePic(data.profilePic);
        } else {
          console.error("Profile picture not found for the user");
        }

        console.log('Profile picture fetched:', data.profilePic);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    // Fetch the profile picture if the user object is available
    if (user && user.email) {
      fetchProfilePic();
    }
  }, [user]);



  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
    if (!showTooltip) {
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }
  };

  return (
    <div>
      {/* Conditional background color based on authentication status */}
      <nav className={`sticky top-0 left-0 w-full flex justify-between items-center text-white pt-4 px-4 md:px-12 ${user ? 'bg-primaryPink py-2' : 'bg-transparent'}`}>
        <Image src="/Head_Logo.png" alt="Logo" width={150} height={150} priority />

        <div className="flex space-x-4 md:space-x-20 font-poppins items-center font-semibold">
          {user ? (
            <div className='flex space-x-4 md:space-x-20 font-poppins items-center font-semibold'>
              {/* Display user-specific navigation */}
              <a href="/dashboard" className="p-3 rounded-lg hover:underline">Dashboard</a>
              <a href="/Feed" className="p-3 rounded-lg hover:underline">Feed</a>
              <a href="/plans" className="p-3 rounded-lg hover:underline">Plans</a>
              <a onClick={logout} className="p-3 rounded-lg hover:underline">Logout</a>
             
              <div className="rounded-full">
                <img
                  onClick={toggleDropdown}
                  src={profilePic}
                  alt="User profile picture"
                  className="rounded-full w-20 h-20 cursor-pointer border-2 border-white"
                  width={60}
                  height={60}
                />
              </div>
              {isOpen && (
                <div className="absolute right-12 top-16  bg-primaryPink bg-opacity-50 mt-2 w-40 shadow-lg z-10">
                  <ul className=''>
                    <li  className="px-4 py-2 border text-center hover:bg-primaryPink cursor-pointer">
                    <a href={`/profile/${user.uid}`}>Profile</a>
                    </li>
                    <li>
                    
                    </li>
                    {/* Add more options here if needed */}
                  </ul>
                </div>
              )}
              
            </div>
          ) : (
            // For unauthenticated users
            <button
              className="p-3 rounded-lg text-white hover:underline"
              onClick={() => setLoginModalOpen(true)}
            >
              Login
            </button>
          )}

          <button
            className="p-3 rounded-lg text-white hover:underline"
            onClick={toggleTooltip}
          >
            Help
          </button>

          {showTooltip && (
            <div className="absolute bg-gray-800 text-white text-sm w-40 text-center rounded-lg p-2 z-10 top-16 right-4 md:right-12">
              Customer Support: 123-456-7890
            </div>
          )}
        </div>
      </nav>

      {isLoginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Login</h2>
            <button
              className="absolute top-2 right-2"
              onClick={() => setLoginModalOpen(false)}
            >
              &times;
            </button>
            <Login onClose={() => setLoginModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <ModalForm onClose={() => setShowModal(false)} onSubmit={(values) => console.log('Modal submitted:', values)} />
      )}
    </div>
  );
}

export default Navbar;
