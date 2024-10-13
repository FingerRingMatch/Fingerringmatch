import React from 'react';
import OverlayForm from './OverlayForm';
import Navbar from './Navbar';

const Hero = () => {
 
  const image = '/images/wed.jpg'; 

  return (
    <div
      className="bg-cover bg-center min-h-screen bg-no-repeat"
      style={{ backgroundImage: `url(${image})` }}
    >
      <Navbar />
      <OverlayForm />
    </div>
  );
};

export default Hero;
