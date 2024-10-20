import React from 'react';

const NoRefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Refund Policy</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! We appreciate your business. 
          Please take a moment to read our No Refund Policy outlined below.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Policy Overview</h2>
        <p className="text-gray-600 mb-4">
          All sales are final. Once a transaction has been completed, we do not offer refunds or exchanges on any products or services.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions regarding this policy, please reach out to us at{' '}
          <a href="mailto:support@example.com" className="text-blue-500 underline">
            support@example.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default NoRefundPolicy;
