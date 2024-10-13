'use client';
import { useState, useEffect } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust path as needed

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: ConfirmationResult | undefined;
  }
}

const OtpAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA verified");
        }
      });
    }
  }, []);

  const requestOtp = async () => {
    setError(null);
    setMessage(null);
    try {
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error('reCAPTCHA not loaded');
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setVerificationSent(true);
      setMessage('OTP sent successfully');
    } catch (err) {
      console.error('Error sending OTP', err);
      setError('Error sending OTP: ' + (err instanceof Error ? err.message : String(err)));
      // Reset reCAPTCHA so user can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible'
        });
      }
    }
  };

  const verifyOtp = async () => {
    setError(null);
    setMessage(null);
    try {
      if (!window.confirmationResult) {
        throw new Error('No confirmation result found. Please request OTP first.');
      }
      const result = await window.confirmationResult.confirm(otp);
      setMessage('User signed in successfully');
      console.log('User signed in:', result.user);
    } catch (err) {
      console.error('Error verifying OTP', err);
      setError('Invalid OTP');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">OTP Authentication</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="+1234567890"
          />
        </div>
        <div id="recaptcha-container"></div>
        <button
          onClick={requestOtp}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Send OTP
        </button>

        {verificationSent && (
          <>
            <div className="mt-4">
              <label className="block text-gray-700">Enter OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter OTP"
              />
            </div>
            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md mt-2"
            >
              Verify OTP
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default OtpAuth;