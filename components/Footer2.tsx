// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-xs py-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* First Line */}
        <div className="flex justify-center space-x-6 text-gray-600">
          <a href="/About-us" className="hover:underline">About us</a>
          
          <a href="success-stories" className="hover:underline">Success Stories</a>

          <a href="/contact-us" className="hover:underline">Contact Us</a>

        </div>

        {/* Second Line */}
        <div className="flex justify-center space-x-6 text-gray-600 mt-2">
          <a href="#" className="hover:underline">Be Safe Online</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Offer Terms</a>
        </div>

        {/* Bottom Line (Optional: if you want additional information or credits) */}
        <div className="text-center text-gray-500 py-4">
        &copy; {new Date().getFullYear()} Fingerring Match. All Rights Reserved.
      </div>
      </div>
    </footer>
  );
};

export default Footer;
