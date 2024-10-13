'use client'
import React, { useState } from 'react';

// Define the Profile interface
interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  language: string;
  education: string;
  jobType: string;
  income: number;
  livesWithFamily: boolean;
  bio: string;
  image: string; // Field for profile image
}

// Mock profile data (including image URLs)
const profiles: Profile[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    age: 28,
    location: "Mumbai",
    language: "Hindi",
    education: "MBA",
    jobType: "Software Engineer",
    income: 800000,
    livesWithFamily: true,
    bio: "Loves hiking and traveling.",
    image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Rahul",
  },
  {
    id: 2,
    name: "Priya Mehta",
    age: 30,
    location: "Delhi",
    language: "English",
    education: "M.Tech",
    jobType: "Data Scientist",
    income: 1200000,
    livesWithFamily: false,
    bio: "Avid reader and coffee enthusiast.",
    image: "https://via.placeholder.com/150/33C1FF/FFFFFF?text=Priya",
  },
  {
    id: 3,
    name: "Anjali Rao",
    age: 27,
    location: "Bangalore",
    language: "Kannada",
    education: "B.Sc. Computer Science",
    jobType: "Product Manager",
    income: 1000000,
    livesWithFamily: true,
    bio: "Enjoys cooking and music.",
    image: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Anjali",
  },
  {
    id: 4,
    name: "Vikram Singh",
    age: 25,
    location: "Hyderabad",
    language: "Telugu",
    education: "B.Tech",
    jobType: "Web Developer",
    income: 600000,
    livesWithFamily: false,
    bio: "Fitness freak and beach lover.",
    image: "https://via.placeholder.com/150/FF33A1/FFFFFF?text=Vikram",
  },
];

const Home: React.FC = () => {
  const [filter, setFilter] = useState({
    location: '',
    language: '',
    education: '',
    jobType: '',
    income: 0,
    livesWithFamily: ''
  });

  // Filter profiles based on selected criteria
  const filteredProfiles = profiles.filter(profile => {
    const matchesLocation = filter.location ? profile.location.toLowerCase().includes(filter.location.toLowerCase()) : true;
    const matchesLanguage = filter.language ? profile.language === filter.language : true;
    const matchesEducation = filter.education ? profile.education === filter.education : true;
    const matchesJobType = filter.jobType ? profile.jobType === filter.jobType : true;
    const matchesIncome = filter.income ? profile.income >= filter.income : true;
    const matchesLivesWithFamily = filter.livesWithFamily ? profile.livesWithFamily.toString() === filter.livesWithFamily : true;
    return matchesLocation && matchesLanguage && matchesEducation && matchesJobType && matchesIncome && matchesLivesWithFamily;
  });

  return (
    <div className="container mx-auto flex">
      {/* Filters Sidebar */}
      <div className="w-1/3 mx-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Filters</h2>

        <div className="mb-4">
          <h3 className="font-semibold">Location</h3>
          <input
            type="text"
            placeholder="Location"
            className="border rounded w-full p-2"
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Language</h3>
          <select
            className="border rounded w-full p-2"
            onChange={(e) => setFilter({ ...filter, language: e.target.value })}
            value={filter.language}
          >
            <option value="">Any</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Marathi">Marathi</option>
            <option value="Kannada">Kannada</option>
            <option value="Telugu">Telugu</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Education</h3>
          <select
            className="border rounded w-full p-2"
            onChange={(e) => setFilter({ ...filter, education: e.target.value })}
            value={filter.education}
          >
            <option value="">Any</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MBA">MBA</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Job Type</h3>
          <select
            className="border rounded w-full p-2"
            onChange={(e) => setFilter({ ...filter, jobType: e.target.value })}
            value={filter.jobType}
          >
            <option value="">Any</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Web Developer">Web Developer</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Minimum Income</h3>
          <input
            type="number"
            placeholder="Minimum Income"
            className="border rounded w-full p-2"
            onChange={(e) => setFilter({ ...filter, income: Number(e.target.value) })}
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Lives with Family</h3>
          <select
            className="border rounded w-full p-2"
            onChange={(e) => setFilter({ ...filter, livesWithFamily: e.target.value })}
            value={filter.livesWithFamily}
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      {/* Border Between Filters and Profiles */}
      <div className="border-l border-gray-300" />

      {/* Profiles Feed */}
      <div className="w-3/4 pl-4 py-8 bg-primaryPink bg-opacity-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Matrimonial Profiles</h1>

        <div className="space-y-4 flex flex-col items-center">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map(profile => (
              <div key={profile.id} className="flex items-center w-2/3 bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow p-4">
                <img src={profile.image} alt={profile.name} className="w-32 h-32 object-cover mr-4" />
                <div>
                  <h3 className="text-xl font-bold">{profile.name}</h3>
                  <p>{profile.age} years old</p>
                  <p>{profile.location}</p>
                  <p>{profile.language}, {profile.education}</p>
                  <p>{profile.jobType} - ₹{profile.income}</p>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No profiles found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
