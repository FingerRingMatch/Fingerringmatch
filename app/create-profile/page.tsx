"use client"
import CreateProfile from '@/components/ProfileCreation';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Import your Firebase instance

export default function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to dashboard if user is authenticated
        router.push('/Feed');
      } else {
        // If user is not logged in, stop loading and show the profile creation page
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Show a loading indicator while checking authentication
  }

  return (
    <div>
      <CreateProfile />
    </div>
  );
}
