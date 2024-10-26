'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User as LucideUser, CheckCircle, XCircle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface User {
  id: string;
  name: string;
  email: string;
  profilePic?: string;
  age?: number;
  city?: string;
  occupation?: string;
  subscriptionPlanId?: string | null;
  subscriptionExpiry?: string | null; // ISO string for date
}

interface ConnectionRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
    age?: number;
    city?: string;
    occupation?: string;
  };
  createdAt: string;
  status: string;
}

export default function ConnectionRequestsPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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

          const data: User = await response.json();
          setUser(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } else {
        setError('Please sign in to view your profile');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/connections/index?userId=${user?.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch requests');
      }

      setRequests(data.connectionRequests);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch requests');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load connection requests',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch('/api/connections/index', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setRequests(requests.filter((request) => request.id !== requestId));

      toast({
        title: 'Success',
        description: `Connection request ${action}ed successfully`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update request',
      });
    }
  };

  const hasValidSubscription = (): boolean => {
    if (!user?.subscriptionPlanId || !user?.subscriptionExpiry) return false;
    
    const expiryDate = new Date(user.subscriptionExpiry);
    const currentDate = new Date();
    
    return expiryDate > currentDate;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!loading && !hasValidSubscription()) {
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
    <div>
      <Navbar/>
    
    <div className="max-w-full md:max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-center">Connection Requests</h1>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-4 sm:p-6 text-center text-gray-500">
            No pending connection requests
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {request.fromUser.profilePic ? (
                      <img
                        src={request.fromUser.profilePic}
                        alt={request.fromUser.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <LucideUser className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{request.fromUser.name}</h3>
                      <div className="text-sm text-gray-500">
                        {request.fromUser.age && `${request.fromUser.age} years`}
                        {request.fromUser.city && ` • ${request.fromUser.city}`}
                      </div>
                      {request.fromUser.occupation && (
                        <div className="text-sm text-gray-500">
                          {request.fromUser.occupation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex mt-4 md:mt-0 space-x-2">
                    <Button
                      onClick={() => handleRequest(request.id, 'accept')}
                      className="bg-green-500 hover:bg-green-600 text-sm md:text-base"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRequest(request.id, 'reject')}
                      variant="destructive"
                      className="text-sm md:text-base"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
