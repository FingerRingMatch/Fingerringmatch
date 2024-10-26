'use client'
import Hero from "@/components/Hero";
import Special_Someone from "@/components/Special_Someone";
import Success_Stories from "@/components/Success_Stories";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface Profile {
  subscriptionPlanId: string;
  subscriptionExpiry: string;
  // Add other profile properties here as needed
}

const LoadingAnimation = () => {
  return (
    <div className="relative w-60 h-60 flex items-center justify-center">
      <Image src="/images/LoadingLogo1.jpg" height={200} width={200} alt="Logo" priority className="rounded-full" />
      <motion.div
        className="absolute w-64 h-64 border-4 m-2 border-t-transparent border-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default function Home() { 
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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

          const data: Profile = await response.json();
          setProfile(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } else {
        setError("Please sign in to view your connections");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (profile) {
      if (hasValidSubscription()) {
        router.push('/Feed'); // Redirect to Feed if subscribed
      } else {
        router.push('/plans'); // Redirect to Plans if unsubscribed
      }
    } else {
      setIsLoading(false); // Stop loading if no profile is present
    }
  }, [profile, router]);

  const hasValidSubscription = (): boolean => {
    if (!profile?.subscriptionPlanId || !profile?.subscriptionExpiry) return false;

    const expiryDate = new Date(profile.subscriptionExpiry);
    const currentDate = new Date();

    return expiryDate > currentDate;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primaryPink">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <Special_Someone />
      <Success_Stories />
      <Footer />
    </div>
  );
}
