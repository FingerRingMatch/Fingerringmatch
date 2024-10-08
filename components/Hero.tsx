'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import OverlayForm from './OverlayForm';

const Hero = () => {
  const images = [
    '/images/ring.jpg',
    '/images/un.jpg',
    '/images/wed.jpg',
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  
  return (
    <div
      className="bg-cover bg-center min-h-screen bg-no-repeat transition-all duration-5000"
      style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
    >
      {/* Responsive Navigation Bar */}
      <nav className="fixed top-0 left-48 w-full flex justify-between items-center  text-white bg-transparent pt-4 ">
        <Image src="/Head_Logo3.png" alt="Logo" width={150} height={150}  priority/>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-20 font-poppins items-center font-semibold mr-60">
          <button className=' p-3 rounded-lg text-white hover:text-primaryPink hover:underline'>Login</button>
        </div>
        
        </nav>
     <OverlayForm/>
    </div>
  );
};

export default Hero;
