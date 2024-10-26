'use client';
import React, { useState, useEffect } from 'react';
import { languageOptions, religionOptions } from './formOptions';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import {
  Menu, Lock,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
  Users,
  Heart,
  Building2,
  IndianRupee,
  Calendar
} from 'lucide-react';

interface Profile {
  id: string;
  firebaseUid: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  religion: string;
  language: string;
  city?: string;
  liveWithFamily?: string;
  subCommunity?: string;
  qualification?: string;
  jobType?: string;
  role?: string;
  company?: string;
  income?: string;
  profilePic?: string;
}

interface CurrentUser {
  id: string;
  gender: string;
  subscriptionPlanId?: string;
  subscriptionExpiry?: string;
}

interface Connection {
  connectedUser: {
    id: string;
  };
}

interface ConnectionsResponse {
  connections: Connection[];
}

interface ProfilesResponse {
  profiles: Profile[];
}

interface FilterState {
  age: { min: number; max: number };
  city: string;
  language: string;
  religion: string;
  subCommunity: string;
  qualification: string;
  jobType: string;
  income: { min: number; max: number };
  livesWithFamily: string;
}

const Home = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const dummyProfiles: Profile[] = [
    {
      id: 'dummy1',
      name: 'Priya Sharma',
      firebaseUid: 'firebase_uid_value',
      age: 27,
      dob: '1990-01-01',
      city: 'Mumbai',
      gender: 'female',
      language: 'Hindi',
      religion: 'Hindu',
      qualification: 'MBA',
      jobType: 'Full-time',
      role: 'Product Manager',
      company: 'Tech Solutions Ltd',
      income: '18 LPA',
      profilePic: '/api/placeholder/150/150',
    },
    {
      id: 'dummy2',
      name: 'Neha Patel',
      firebaseUid: 'firebase_uid_value',
      age: 25,
      dob: '1992-02-02',
      city: 'Bangalore',
      gender: 'female',
      language: 'English',
      religion: 'Hindu',
      qualification: 'B.Tech',
      jobType: 'Full-time',
      role: 'Software Engineer',
      company: 'Global Systems Inc',
      income: '16 LPA',
      profilePic: '/api/placeholder/150/150',
    },
    {
      id: 'dummy3',
      name: 'Rishabh Gupta',
      firebaseUid: 'firebase_uid_value',
      age: 26,
      dob: '1991-03-03',
      city: 'Delhi',
      gender: 'male',
      language: 'Hindi',
      religion: 'Hindu',
      qualification: 'CA',
      jobType: 'Full-time',
      role: 'Senior Accountant',
      company: 'Finance Pro Ltd',
      income: '15 LPA',
      profilePic: '/api/placeholder/150/150',
    }
  ];
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({
    age: { min: 0, max: 100 },
    city: '',
    language: '',
    religion: '',
    subCommunity: '',
    qualification: '',
    jobType: '',
    income: { min: 0, max: 2000000 },
    livesWithFamily: '',
  });

  // Fetch current user data
  useEffect(() => {
    let isMounted = true;
    const auth = getAuth();

    const fetchUserProfile = async (uid: string) => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'uid': uid,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data: CurrentUser = await response.json();

        if (isMounted) {
          setCurrentUser(data);
          setIsLoadingUser(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setIsLoadingUser(false);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        if (isMounted) {
          setError("Please sign in to view your profile");
          setIsLoadingUser(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Fetch profiles
  useEffect(() => {
    let isMounted = true;

    const fetchProfilesAndConnections = async () => {
      try {
        const [profilesResponse, connectionsResponse] = await Promise.all([
          fetch('/api/profiles'),
          fetch(`/api/connections/connected?userId=${currentUser?.id}`)
        ]);

        if (!profilesResponse.ok) {
          throw new Error('Failed to fetch profiles');
        }

        const [profilesData, connectionsData]: [ProfilesResponse, ConnectionsResponse] = await Promise.all([
          profilesResponse.json(),
          connectionsResponse.json()
        ]);

        if (isMounted) {
          // Create a Set of connected profile IDs for efficient lookup
          const connectedIds = new Set(
            connectionsData.connections?.map(
              (conn) => conn.connectedUser.id
            ) || []
          );

          // Filter out connected profiles before setting state
          const availableProfiles = profilesData.profiles?.filter(
            (profile) => !connectedIds.has(profile.id)
          ) || [];

          setProfiles(availableProfiles);
          setIsLoadingProfiles(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching profiles:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch profiles');
          setIsLoadingProfiles(false);
        }
      }
    };

    if (currentUser?.id) {
      fetchProfilesAndConnections();
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleProfileClick = (profileId: string) => {
    if (!hasValidSubscription()) {
      router.push("/plans")
    }
    router.push(`/profile/${profileId}`);
  };

  // Check if user has valid subscription
  const hasValidSubscription = (): boolean => {
    if (!currentUser?.subscriptionPlanId) return false;
    if (!currentUser?.subscriptionExpiry) return false;

    const expiryDate = new Date(currentUser.subscriptionExpiry);
    const currentDate = new Date();

    return expiryDate > currentDate;
  };

  // Filter profiles based on all criteria including gender and subscription
  const filteredProfiles = profiles.filter(profile => {
    // Check for valid subscription first
    if (!hasValidSubscription()) return false;
    console.log(currentUser?.gender)
    // Filter by opposite gender
    const oppositeGender = currentUser?.gender === 'male' ? 'female' : 'male';
    if (profile.gender !== oppositeGender) return false;

    // Age filter
    if (filter.age.min && profile.age < filter.age.min) return false;
    if (filter.age.max && profile.age > filter.age.max) return false;

    // Location filter
    if (filter.city && !profile.city?.toLowerCase().includes(filter.city.toLowerCase())) {
      return false;
    }

    // Language filter
    if (filter.language && profile.language?.toLowerCase() !== filter.language.toLowerCase()) {
      return false;
    }

    // Religion filter
    if (filter.religion && !profile.religion?.toLowerCase().includes(filter.religion.toLowerCase())) {
      return false;
    }

    // Sub-community filter
    if (filter.subCommunity && !profile.subCommunity?.toLowerCase().includes(filter.subCommunity.toLowerCase())) {
      return false;
    }

    return true;
  });


  if (isLoadingUser || isLoadingProfiles) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  const ProfileCard = ({ profile }: { profile: Profile }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-start hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="sm:w-40 flex justify-center md:items-center ">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt={`${profile.name}'s profile`}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-gray-200 flex items-center justify-center">
                <Users size={40} className="text-gray-400" />
              </div>
            )}
          </div>

          <div
            onClick={() => handleProfileClick(profile.id)}
            className="flex-1 cursor-pointer"
          >
            {/* Basic Info Section */}
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl capitalize font-semibold text-gray-800 mb-2">
                {profile.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar size={18} />
                <span>{profile.age} years</span>
              </div>
            </div>

            {/* Location & Language Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 mb-4">
              <div className="flex capitalize items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-primary-600" />
                <span>{profile.city}</span>
              </div>
              <div className="flex capitalize items-center gap-2 text-gray-600">
                <Languages size={18} className="text-primary-600" />
                <span>{profile.language}</span>
              </div>
            </div>

            {/* Religion & Community Section */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-gray-600">
              <div className="flex items-center capitalize gap-2">
                <Users size={18} className="text-primary-600" />
                <span>{profile.religion}</span>
              </div>
              {profile.subCommunity && (
                <div className="flex items-center capitalize gap-2">
                  <span>•</span>
                  <span>{profile.subCommunity}</span>
                </div>
              )}
            </div>

            {/* Education & Career Section */}
            <div className="space-y-2">
              {profile.qualification && (
                <div className="flex items-center gap-2 text-gray-600 capitalize">
                  <GraduationCap size={18} className="text-primary-600" />
                  <span>{profile.qualification}</span>
                </div>
              )}

              {(profile.jobType || profile.role) && (
                <div className="flex items-center gap-2 text-gray-600 capitalize">
                  <Briefcase size={18} className="text-primary-600" />
                  <span>
                    {profile.jobType}
                    {profile.role && ` • ${profile.role}`}
                  </span>
                </div>
              )}

              {profile.company && (
                <div className="flex items-center gap-2 text-gray-600 capitalize">
                  <Building2 size={18} className="text-primary-600" />
                  <span>{profile.company}</span>
                </div>
              )}

              {profile.income && (
                <div className="flex items-center gap-2 text-gray-600">
                  <IndianRupee size={18} className="text-primary-600" />
                  <span>{profile.income}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col justify-center items-stretch sm:items-end gap-2 min-w-[140px]">
            <button className="w-full bg-primaryPink hover:bg-opacity-80 rounded-xl px-6 py-3 text-white flex items-center justify-center gap-2 transition-colors">
              <Heart size={18} />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FilterSection = () => (
    <div className={`
      fixed md:relative inset-0  bg-white md:bg-transparent
      transform ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:transform-none transition-transform duration-300 ease-in-out
      w-full md:w-80 p-4 overflow-y-auto
      md:block md:sticky md:top-6 h-full md:h-fit
    `}>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center md:hidden mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={toggleFilters} className="text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Age Filter */}
          <div>
            <h3 className="font-semibold mb-2">Age Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Age"
                className="border rounded w-full p-2"
                onChange={(e) => setFilter({
                  ...filter,
                  age: { ...filter.age, min: Number(e.target.value) || 0 }
                })}
              />
              <input
                type="number"
                placeholder="Max Age"
                className="border rounded w-full p-2"
                onChange={(e) => setFilter({
                  ...filter,
                  age: { ...filter.age, max: Number(e.target.value) || 100 }
                })}
              />
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <input
              type="text"
              placeholder="Location"
              className="border rounded w-full p-2"
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            />
          </div>

          {/* Language Filter */}
          <div>
            <h3 className="font-semibold mb-2">Language</h3>
            <select
              onChange={(e) => setFilter({ ...filter, language: e.target.value })}
              className="border rounded w-full p-2"
            >
              <option value="">Select language</option>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Religion Filter */}
          <div>
            <h3 className="font-semibold mb-2">Religion</h3>
            <select
              onChange={(e) => setFilter({ ...filter, religion: e.target.value })}
              className="border rounded w-full p-2"
            >
              <option value="">Select religion</option>
              {religionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Community Filter */}
          <div>
            <h3 className="font-semibold mb-2">Sub-Community</h3>
            <input
              type="text"
              placeholder="Sub-Community"
              className="border rounded w-full p-2"
              onChange={(e) => setFilter({ ...filter, subCommunity: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );



  const BlurredProfileCard = () => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-start hover:shadow-lg transition-shadow relative overflow-hidden">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
        <Lock size={32} className="text-gray-400 mb-2" />
        <p className="text-gray-600 font-semibold mb-2">Subscribe to View Profile</p>
        <button
          onClick={() => router.push('/plans')}
          className="bg-primaryPink hover:bg-opacity-80 text-white px-6 py-2 rounded-xl"
        >
          View Plans
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 filter blur-sm">
        <div className="sm:w-40 flex justify-center md:items-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-gray-200 flex items-center justify-center">
            <Users size={40} className="text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <div className="h-8 bg-gray-200 rounded-md w-48 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded-md w-24"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded-md w-36"></div>
            <div className="h-6 bg-gray-200 rounded-md w-40"></div>
            <div className="h-6 bg-gray-200 rounded-md w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isLoadingUser && !hasValidSubscription()) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:space-x-6 justify-center">
          
            <div className="w-full md:max-w-2xl">
              <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Find Your Perfect Match</h2>
                <p className="text-gray-600 mb-4">Subscribe to unlock all profiles and features.</p>
                <button
                  onClick={() => router.push('/plans')}
                  className="bg-primaryPink hover:bg-opacity-80 text-white px-6 py-3 rounded-xl"
                >
                  View Subscription Plans
                </button>
              </div>

              <div className="space-y-4">
                {/* Show dummy profiles */}
                {dummyProfiles.map((profile) => (
                  <div onClick={() => router.push(`/plans`)}>
                  <ProfileCard key={profile.id} profile={profile}/>
                  </div>
                ))}

                {/* Show 5 blurred profiles */}
                {[1, 2, 3, 4, 5].map((index) => (
                  <BlurredProfileCard key={`blurred-${index}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden sticky top-0 bg-gray-100 pb-4 max-w-2xl mx-auto">
        <button
          onClick={toggleFilters}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md"
        >
          <Menu size={24} />
          <span>Filters</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-6 justify-center">
          <FilterSection /> {/* FilterSection component remains the same */}

          {/* Profiles Grid */}
          <div className="w-full md:max-w-2xl">
            <div className="space-y-4">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 text-lg">No profiles match your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Home;