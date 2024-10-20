import React from 'react';
import Navbar from '@/components/Navbar';

const PaymentPage: React.FC = () => {
  const plans = [
    {
      name: 'Gold',
      price: '₹2,000',
      discount: '50% off',
      originalPrice: '₹4,000',
      features: ['Send unlimited messages', 'View up to 75 contact numbers'],
      isTopSeller: false,
      isBestValue: false
    },
    {
      name: 'Gold Plus',
      price: '₹5,000',
      discount: '50% off',
      originalPrice: '₹10,000',
      features: ['Send unlimited messages', 'View up to 150 contact numbers'],
      isTopSeller: false,
      isBestValue: false
    },
    {
      name: 'Diamond Plus',
      price: '₹10,000',
      discount: '50% off',
      originalPrice: '₹20,000',
      features: ['Send unlimited messages', 'View up to 300 contact numbers'],
      isTopSeller: false,
      isBestValue: false
    },
    {
      name: 'Platinum',
      price: '₹25,000',
      discount: '50% off',
      originalPrice: '₹50,000',
      features: ['Send unlimited messages', 'View up to 600 contact numbers'],
      isTopSeller: true,
      isBestValue: false
    },
    {
      name: 'Platinum Plus',
      price: '₹50,000',
      discount: '50% off',
      originalPrice: '₹100,000',
      features: ['Send unlimited messages', 'View up to 600 contact numbers'],
      isTopSeller: false,
      isBestValue: false
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Curved background */}
      <div className="absolute inset-0 bg-primaryPink" 
           style={{
             clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 85%)'
           }}
      />
      <Navbar/>
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-center text-white text-3xl font-semibold mb-2">
            Upgrade now & Get Premium benefits!
          </h1>
          
         

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-white rounded-lg p-6 shadow-lg">
                {(plan.isTopSeller || plan.isBestValue) && (
                  <div className="text-red-500 text-sm text-center mb-2">
                    {plan.isTopSeller ? '— TOP SELLER —' : '— BEST VALUE —'}
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-medium text-gray-800">{plan.name}</h3>
                  <span className="text-gray-500">3 months</span>
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{plan.price}</div>
                    <div className='text-sm text-gray-500'>{plan.discount}</div>
                    <div className='text-2xl text-gray-300 line-through'>{plan.originalPrice}</div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
