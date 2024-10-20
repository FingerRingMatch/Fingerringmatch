import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 border-t border-gray-200">
      
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-center text-primaryPink space-x-0 md:space-x-12 mb-8">
          <div className="text-center mb-4 md:mb-0">
            <p className="text-lg font-semibold">Best Matches</p>
          </div>
          <div className="text-center mb-4 md:mb-0">
            <p className="text-lg font-semibold">Verified Profiles</p>
          </div>
          <div className="text-center mb-4 md:mb-0">
            <p className="text-lg font-semibold">100% Privacy</p>
          </div>
        </div>
        <div className=' flex justify-center'>
        {/* Bottom Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8  text-gray-600">
          {/* Need Help Section */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Need Help?</h4>
            <ul>
              <li><a href="#" className="hover:underline">Member Login</a></li>
              <li><a href="#" className="hover:underline">Sign Up</a></li>
              <li><a href="#" className="hover:underline">Partner Search</a></li>
              <li><a href="#" className="hover:underline">How to Use Finger ring matrimony?</a></li>
              <li><a href="#" className="hover:underline">Premium Memberships</a></li>
              <li><a href="#" className="hover:underline">Customer Support</a></li>
              <li><a href="#" className="hover:underline">Site Map</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Company</h4>
            <ul>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">FR Blog</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Awards & Recognition</a></li>
              <li><a href="#" className="hover:underline">Cov-Aid</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>

          {/* Privacy & You Section */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Privacy & You</h4>
            <ul>
              <li><a href="#" className="hover:underline">Terms of Use</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Be Safe Online</a></li>
              <li><a href="#" className="hover:underline">Report Misuse</a></li>
            </ul>
          </div>

          {/* More Section */}
          <div>
            <h4 className="text-lg font-semibold mb-2">More</h4>
            <ul>
              <li><a href="/no-refund-policy" className="hover:underline">No refund Policy</a></li>
              <li><a href="#" className="hover:underline">Select Wedding</a></li>
              <li><a href="#" className="hover:underline">Sangam</a></li>
              <li><a href="#" className="hover:underline">Marriage Centres</a></li>
              <li><a href="#" className="hover:underline">Success Stories</a></li>
              <li><a href="#" className="hover:underline">Become a Member</a></li>
              <li><a href="#" className="hover:underline">Pledge</a></li>
            </ul>
          </div>
        </div>
      </div>
      </div>
      <div className="text-center text-gray-500 py-4">
        &copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
