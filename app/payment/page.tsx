import React from 'react';
import Image from 'next/image';

const PaymentPage: React.FC = () => {
  const plans = [
    {
      name: 'Gold',
      price: '₹3,720',
      discount: '20% off',
      originalPrice: '₹4,650',
      features: ['Send unlimited messages', 'View up to 75 contact numbers'],
      highlight: false,
    },
    {
      name: 'Gold Plus',
      price: '₹4,095',
      discount: '30% off',
      originalPrice: '₹5,850',
      features: ['Send unlimited messages', 'View up to 150 contact numbers'],
      highlight: false,
    },
    {
      name: 'Diamond Plus',
      price: '₹5,310',
      discount: '40% off',
      originalPrice: '₹8,850',
      features: ['Send unlimited messages', 'View up to 300 contact numbers'],
      highlight: true,
    },
    {
      name: 'Platinum Plus',
      price: '₹7,325',
      discount: '50% off',
      originalPrice: '₹14,650',
      features: ['Send unlimited messages', 'View up to 600 contact numbers'],
      highlight: false,
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <header className="bg-primaryPink p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/Head_Logo.png" alt="Logo" width={150} height={150} />
        </div>
        <nav className="flex space-x-8">
          <button className="text-white font-semibold">Premium</button>
          <button className="text-white font-semibold">Personalized</button>
          <button className="text-white font-semibold">Help</button>
          <button className="text-white font-semibold">Skip for now</button>
        </nav>
      </header>

      {/* Pricing Section */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          Upgrade your search with our Perfect Plans
        </h2>
        <p className="text-center text-primaryPink mt-2">50% OFF! Valid for a Limited Time Only.</p>

        <div className="flex flex-wrap justify-center mt-10 space-x-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-lg shadow-lg bg-white ${plan.highlight ? 'border-2 border-primaryPink' : ''}`}
            >
              <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
              <p className="text-center text-gray-600 mt-2">{plan.discount}</p>
              <p className="text-center text-2xl font-bold text-gray-800 mt-2">{plan.price}</p>
              <p className="text-center line-through text-gray-500">{plan.originalPrice}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-gray-600 flex items-center">
                    <span className="text-primaryGreen mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-4 bg-primaryPink text-white py-2 rounded-lg font-semibold">
                Continue
              </button>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-8 text-gray-600">
          India's <strong>Safest, Smartest</strong> and the most <strong>Secure</strong> matchmaking service
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
