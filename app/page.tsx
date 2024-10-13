'use client'
import Hero from "@/components/Hero";
import Special_Someone from "@/components/Special_Someone";
import Success_Stories from "@/components/Success_Stories";
import Image from "next/image";
import { motion } from "framer-motion";
import React, {useState, useEffect} from 'react'
import Footer from "@/components/Footer";


const LoadingAnimation = () => {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Logo Image */}
      <Image src="/logo.jpg" height={150} width={150} alt="Logo" priority className="rounded-full" />

      {/* Rotating Ring */}
      <motion.div
        className="absolute w-32 h-32 border-4 m-2 border-t-transparent border-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSections = async () => {
      await new Promise(resolve => setTimeout(resolve, 1600));
      setIsLoading(false);
    };
    loadSections();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primaryPink">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div>
      <Hero/>
      <Special_Someone/>
      <Success_Stories/>
      <Footer/>
    </div>
  );
}
