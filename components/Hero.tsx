'use client';
import React, { useState, useEffect } from 'react';
import OverlayForm from './OverlayForm';
import Navbar from './Navbar';

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
     <Navbar/>
     <OverlayForm/>
    </div>
  );
};

export default Hero;
