'use client'
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import Navbar from '@/components/Navbar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  subscriptionPlanId?: string;
  subscriptionExpiry?: string;
}

const UserProfilePage: React.FC<UserProfile> = ({}) => {
  const [data, setData] = useState({ pendingRequests: 0, totalConnections: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

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

          const data = await response.json();
          console.log(data);
          setUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } else {
        setError("Please sign in to view your connections");
      }
    });

    return () => unsubscribe();
  }, []);

  // Second useEffect to fetch dashboard data based on the user
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return; // Check if user is not null before fetching
      console.log(user);
      try {
        const response = await fetch(`/api/connections/dashboard?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]); // Depend on user instead of userId
  
  if (loading) return <div className='flex m-auto'>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 p-6">
     
      <h1 className="text-3xl font-bold my-6 text-center">User Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Pending Connection Requests</h3>
            <p className="text-2xl font-bold">{data.pendingRequests}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Connected People</h3>
            <p className="text-2xl font-bold">{data.totalConnections}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserProfilePage;
