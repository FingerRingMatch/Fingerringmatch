'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Briefcase, GraduationCap, Users, Mail, Phone, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getAuth } from 'firebase/auth';

interface Profile {
  id: string;
  name: string;
  age: number;
  dob: string;
  gender: string;
  religion: string;
  language: string;
  email?: string;
  phone?: string;
  city?: string;
  livesWithFamily?: string;
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
  income?: string;
  bio?: string;
  profilePic?: string;
  subscriptionPlanId?: string;
  subscriptionExpiry?: Date;
}

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false); // Track connection status
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/profile/${params.id}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch profile');
        }
        const profileData = data.profile;
        profileData.age = calculateAge(profileData.dob);
        setProfile(profileData);
        console.log("Profile data:", profileData);
        setIsConnected(data.isConnected);
        console.log("Connection status:", isConnected) // Fetch connection status from API response
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProfile();
    }
  }, [params.id]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'uid': currentUser.uid,
            },
          });

          if (!response.ok) throw new Error('Failed to fetch profile data');
          console.log(currentUser)
          const data = await response.json();
          console.log("current user data:", data)
          setUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {

        }
      } else {
        setError("Please sign in to view your profile");

      }
    });

    return () => unsubscribe();
  }, []);

  const handleConnectionRequest = async () => {
    setRequestLoading(true);
    setRequestError(null);

    try {
      const response = await fetch('/api/connections/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId: profile?.id,
          // Assuming you have the logged-in user's ID available
          fromUserId: user?.id, // Replace with actual user ID from your auth system
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send connection request');
      }

      setConnectionStatus('pending');
      // Show success message or update UI
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Failed to send connection request');
      console.log(requestError)
    } finally {
      setRequestLoading(false);
    }
  };



  const hasValidSubscription = (): boolean => {
    if (!user?.subscriptionPlanId) return false;
    if (!user?.subscriptionExpiry) return false;

    const expiryDate = new Date(user.subscriptionExpiry);
    const currentDate = new Date();

    return expiryDate > currentDate;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error || 'Profile not found'}</div>
      </div>
    );
  }
  if (!isLoading && !hasValidSubscription()) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Subscription Required</h2>
          <p className="text-gray-600 mb-6">
            Please subscribe to view profiles and connect with potential matches.
          </p>
          <button
            onClick={() => router.push('/plans')}
            className="bg-primaryPink hover:bg-opacity-80 text-white px-6 py-3 rounded-xl"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden group">
        {profile.profilePic ? (
          <img
            src={profile.profilePic}
            alt={profile.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-pink-400 to-purple-500" />
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="text-white flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold">{profile.name}, {profile.age}</h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.city || 'Add your location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickInfoCard
          icon={<Briefcase className="w-5 h-5" />}
          title="Work"
          content={`${profile.role || 'Add your role'} at ${profile.company || 'Add your company'}`}
          editable
        />
        <QuickInfoCard
          icon={<GraduationCap className="w-5 h-5" />}
          title="Education"
          content={profile.qualification || 'Add your education'}
          editable
        />
        <QuickInfoCard
          icon={<Users className="w-5 h-5" />}
          title="Family"
          content={`${profile.livesWithFamily ? 'Lives with family' : 'Lives independently'}`}
          editable
        />
      </div>

      {/* About Me */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">About Me</h2>
          </div>
          <p className="text-gray-600 leading-relaxed capitalize">
            {profile.bio || 'Add a bio to tell others about yourself!'}
          </p>
        </CardContent>
      </Card>

      {/* Lifestyle & Preferences */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Lifestyle & Preferences</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <PreferenceItem label="Diet" value={profile.diet || 'Add diet'} />
            <PreferenceItem label="Religion" value={profile.religion || 'Add religion'} />
            <PreferenceItem label="Language" value={profile.language || 'Add language'} />
            <PreferenceItem label="Height" value={profile.height || 'Add height'} />
            <PreferenceItem label="Marital Status" value={profile.maritalStatus || 'Add status'} />
            <PreferenceItem label="Community" value={profile.subCommunity || 'Add community'} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Contact Information</h2>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{profile.phone || 'Add phone number'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {connectionStatus === 'pending' ? (
        <div>
          <button disabled className='w-full bg-gray-400 text-white font-medium rounded-lg px-5 py-3'>Request already sent</button>
        </div>
      ) : (<button
        onClick={handleConnectionRequest}
        disabled={requestLoading}
        className="w-full bg-primaryPink hover:bg-primaryPink/80 text-white font-medium rounded-lg px-5 py-3"
      >
        {requestLoading ? 'Sending Request...' : 'Send Connection Request'}

      </button>
      )}

    </div>
  );
}

const QuickInfoCard = ({
  icon,
  title,
  content,
  editable
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  editable?: boolean;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-pink-500">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-lg font-light">{content}</p>
          </div>
        </div>
        {editable && <Pencil className="w-4 h-4 text-gray-400" />}
      </div>
    </CardContent>
  </Card>
);

const PreferenceItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h3 className="text-sm font-normal text-gray-500">{label}</h3>
    <p className="text-lg font-light capitalize">{value}</p>
  </div>
);
