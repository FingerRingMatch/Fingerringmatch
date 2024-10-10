import React, { useState } from 'react';
import Image from 'next/image';
import { ModalForm } from './ModalForm';
function Navbar() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
    // Automatically hide tooltip after a few seconds
    if (!showTooltip) {
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000); // Hide after 3 seconds
    }
  };

  return (
    <div>
      <nav className="sticky top-0 left-0 w-full flex justify-between items-center text-white bg-transparent pt-4 px-4 md:px-12">
        <Image src="/Head_Logo.png" alt="Logo" width={150} height={150} priority />

        <div className="flex space-x-4 md:space-x-20 font-poppins items-center font-semibold">
          <button className='p-3 rounded-lg text-white hover:underline outline-none' onClick={() =>setShowModal(true)}>Login</button>
          <button 
            className='p-3 rounded-lg text-white hover:underline' 
            onClick={toggleTooltip}
          >
            Help
          </button>

          {showTooltip && (
            <div className="absolute bg-gray-800 text-white text-sm  w-40 text-center rounded-lg p-2 z-10 top-16 right-4 md:right-12">
              Customer Support: 123-456-7890
            </div>
          )}
        </div>
      </nav>
      {showModal && <ModalForm onClose={() => setShowModal(false)} onSubmit={(values) => console.log('Modal submitted:', values)} />}
    </div>
  );
}

export default Navbar;
