'use client'
import Hero from "@/components/Hero";
import Special_Someone from "@/components/Special_Someone";
import Success_Stories from "@/components/Success_Stories";
import Image from "next/image";
import { motion } from "framer-motion";
import React, {useState} from 'react'

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);
  const [loadingSection, setLoadingSection] = useState('hero');

  const loadSections = async () => {
      
    await new Promise(resolve => setTimeout(resolve, 1600));
    setIsLoading(false);
  };
  loadSections();

  


const LoadingAnimation = ({ section }: { section: string }) => {
  switch (section) {
    case 'hero':
      return (
        <motion.div
          className="w-20 h-20 text-primaryPink"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src='/IMG_6789.jpg' height={80} width={80} alt={''}/>
        </motion.div>
      );
   
  }
};

if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen bg-primaryPink">
      <LoadingAnimation section={loadingSection} />
    </div>
  );
}

  return (
    <div>
      <Hero/>
      <Special_Someone/>
      <Success_Stories/>
    </div>
  );
}
