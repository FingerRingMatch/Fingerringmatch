// pages/profile/[uid].tsx
'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use next/navigation for params

interface User {
  uid: string;
  name: string;
  dob: string;
  gender: string;
  religion: string;
  language: string;
  phone: string;
  email: string;
  city?: string;
  liveWithFamily?: string;
  familyCity?: string;
  maritalStatus?: string;
  diet?: string;
  height?: string;
  subCommunity?: string;
  qualification?: string;
  collegeName?: string;
  jobType?: string;
  role?: string;
  company?: string;
  incomeRange?: string;
  bio?: string;
  profilePic?: string; // URL
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const { uid } = useParams(); // Extract uid from params
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (uid) {
      const fetchUser = async () => {
        const response = await fetch(`/api/profile/${uid}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user data');
        }
        setLoading(false);
      };

      fetchUser();
    }
  }, [uid]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-primaryPink rounded-lg shadow-md">
      <div className="flex">
        {user.profilePic && (
          <img
            src={user.profilePic}
            alt={`${user.name}'s profile picture`}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        )}
        <div className="ml-6 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          <p className="text-white">{user.email}</p>
        </div>
      </div>

      {/* Family Details */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Family Details</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><strong>Live with Family:</strong> {user.liveWithFamily || 'N/A'}</p>
            <p className="text-gray-600"><strong>Family City:</strong> {user.familyCity || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Sub-Community:</strong> {user.subCommunity || 'N/A'}</p>
            <p className="text-gray-600"><strong>Diet:</strong> {user.diet || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Education & Career */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Education & Career</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><strong>Qualification:</strong> {user.qualification || 'N/A'}</p>
            <p className="text-gray-600"><strong>College:</strong> {user.collegeName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Job Type:</strong> {user.jobType || 'N/A'}</p>
            <p className="text-gray-600"><strong>Company:</strong> {user.company || 'N/A'}</p>
            <p className="text-gray-600"><strong>Income Range:</strong> {user.incomeRange || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Location Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600"><strong>City:</strong> {user.city || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Hobbies */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Hobbies & Interests</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Example tags for hobbies */}
          <span className="bg-gray-200 text-gray-700 rounded-full px-4 py-2">Music</span>
          <span className="bg-gray-200 text-gray-700 rounded-full px-4 py-2">Cooking</span>
          {/* Add more based on user hobbies */}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bio</h2>
        </div>
        <p className="text-gray-600">{user.bio || 'No bio available'}</p>
      </div>

      <button className='flex m-auto bg-golden p-2 rounded-lg mt-4'>
        <a href={`/update-profile/${uid}`}>Update Profile</a>
      </button>
    </div>
  );
};

export default ProfilePage;
