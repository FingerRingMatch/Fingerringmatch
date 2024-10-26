"use client";
import React from 'react';
import Image from 'next/image';
import CheckoutButton from '@/components/Checkout';
import Footer from '@/components/Footer2';


const PaymentPage: React.FC = () => {
  const plans = [
    {
      name: 'Gold',
      price: 2000,
      discount: '50% off',
      originalPrice: '₹4,000',
      features: ['Send unlimited messages', 'View up to 75 contact numbers'],
      maxConnections: 75,
      isTopSeller: false,
      isBestValue: false,
    },
    {
      name: 'Gold Plus',
      price: 5000,
      discount: '50% off',
      originalPrice: '₹10,000',
      features: ['Send unlimited messages', 'View up to 150 contact numbers'],
      maxConnections: 150,
      isTopSeller: false,
      isBestValue: false,
    },
    {
      name: 'Diamond Plus',
      price: 10000,
      discount: '50% off',
      originalPrice: '₹20,000',
      features: ['Send unlimited messages', 'View up to 300 contact numbers'],
      maxConnections: 300,
      isTopSeller: false,
      isBestValue: false,
    },
    {
      name: 'Platinum',
      price: 25000,
      discount: '50% off',
      originalPrice: '₹50,000',
      features: ['Send unlimited messages', 'View up to 600 contact numbers'],
      maxConnections: 600,
      isTopSeller: true,
      isBestValue: false,
    },
    {
      name: 'Platinum Plus',
      price: 50000,
      discount: '50% off',
      originalPrice: '₹100,000',
      features: ['Send unlimited messages', 'View up to 600 contact numbers'],
      maxConnections: 600,
      isTopSeller: false,
      isBestValue: false,
    },
  ];

  const [selectedPlan, setSelectedPlan] = React.useState<string>('');

  return (
    <div>
      <div className="min-h-screen relative overflow-hidden pt-8">
        {/* Curved background */}
        <div
          className="absolute inset-0 bg-primaryPink"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 85%)',
          }}
        />
        {/* Content */}
        <div className="relative z-10">
          <header className='flex justify-between items-center'>
            <Image
              alt='logo'
              src="/images/Head_Logo.png"
              width={150}
              height={150}
              priority
              className='ml-12'
            />
            <nav className='flex justify-end text-white space-x-8 mr-20 font-bold text-lg'>
              <button className='rounded-full border-2 p-2 border-white'>Personalized Plans</button>
              <button>Help</button>
            </nav>
          </header>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className='flex justify-between'>
              <h1 className="text-center text-white text-3xl font-semibold mb-2 mx-auto">
                Upgrade now & Get Premium benefits!
              </h1>
              <a href='/Feed' className='text-white underline text-lg'>Do this later</a>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {plans.map((plan) => (
                <div key={plan.name} className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800">{plan.name}</h3>
                    <span className="text-gray-500">3 months</span>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">₹{plan.price}</div>
                      <div className='text-sm text-gray-500'>{plan.discount}</div>
                      <div className='text-2xl text-gray-300 line-through'>{plan.originalPrice}</div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <CheckoutButton
                    onClick={() => setSelectedPlan(plan.name)}
                    amount={plan.price}
                    currency="INR"
                    maxConnections={plan.maxConnections}
                    name={plan.name}
                    price={plan.price}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
