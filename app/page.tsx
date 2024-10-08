'use client'
import Hero from "@/components/Hero";
import Special_Someone from "@/components/Special_Someone";
import Success_Stories from "@/components/Success_Stories";
import Image from "next/image";
import { motion } from "framer-motion";
import React, {useState} from 'react'
import logo from '../public/Logo.jpg'

export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

const loadSections = async () => {
  await new Promise(resolve => setTimeout(resolve, 1600));
  setIsLoading(false);
};
loadSections();

const LoadingAnimation = () => {
  return (
    <motion.div
      className="w-20 h-20 text-primaryPink"
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image src={logo} height={80} width={80} alt={''}/>
    </motion.div>
  );
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
      <Hero/>
      <Special_Someone/>
      <Success_Stories/>
    </div>
  );
}
