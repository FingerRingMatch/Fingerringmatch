'use client'
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Heart, MapPin, Briefcase, GraduationCap, Users, Mail, Phone, Pencil  } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

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
  incomeRange?: string;
  bio?: string;
  profilePic?: string;
  createdAt: string;
  updatedAt: string;
}

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

 

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
          setUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please sign in to view your profile");
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl text-pink-500">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Heart className="w-16 h-16 text-pink-500" />
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Heart className="w-16 h-16 text-pink-500" />
        <div className="text-2xl">Profile not found</div>
        <button className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600">
          Create Profile
        </button>
      </div>
    );
  }
  const handleUpdate = () => {
    router.push( `/update-profile`);
    console.log(user.uid)
  }
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden group">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-pink-400 to-purple-500" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white/90 text-pink-500 p-3 rounded-full hover:bg-white">
            <Pencil onClick={handleUpdate} className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="text-white flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold">{user.name}, {calculateAge(user.dob)}</h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{user.city || 'Add your location'}</span>
              </div>
            </div>
            <button onClick={handleUpdate} className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickInfoCard
          icon={<Briefcase className="w-5 h-5" />}
          title="Work"
          content={`${user.role || 'Add your role'} at ${user.company || 'Add your company'}`}

        />
        <QuickInfoCard
          icon={<GraduationCap className="w-5 h-5" />}
          title="Education"
          content={user.qualification || 'Add your education'}

        />
        <QuickInfoCard
          icon={<Users className="w-5 h-5" />}
          title="Family"
          content={`${user.livesWithFamily ? 'Lives with family'  : 'Lives independently'}`}
        />
      </div>

      {/* About Me */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">About Me</h2>
            <button className="text-pink-500 hover:text-pink-600">
              <Pencil onClick={handleUpdate} className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {user.bio || 'Add a bio to tell others about yourself!'}
          </p>
        </CardContent>
      </Card>

      {/* Lifestyle & Preferences */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Lifestyle & Preferences</h2>
            <button className="text-pink-500 hover:text-pink-600">
              <Pencil onClick={handleUpdate} className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <PreferenceItem label="Diet" value={user.diet || 'Add diet'} />
            <PreferenceItem label="Religion" value={user.religion || 'Add religion'} />
            <PreferenceItem label="Language" value={user.language || 'Add language'} />
            <PreferenceItem label="Height" value={user.height || 'Add height'} />
            <PreferenceItem label="Marital Status" value={user.maritalStatus || 'Add status'} />
            <PreferenceItem label="Community" value={user.subCommunity || 'Add community'} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <button className="text-pink-500 hover:text-pink-600">
              <Pencil onClick={handleUpdate} className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{user.phone || 'Add phone number'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


const QuickInfoCard = ({ 
  
  icon, 
  title, 
  content,

}: { 
  icon: React.ReactNode; 
  title: string; 
  content: string;

}) => (

  
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-pink-500">{icon}</div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-gray-900">{content}</p>
          </div>
        </div>
      
      </div>
    </CardContent>
  </Card>
);

const PreferenceItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-gray-900 capitalize">{value}</dd>
  </div>
);
