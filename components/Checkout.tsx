'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
    onClick: () => void;
    amount: number;
    currency: string;
    maxConnections: number;
    price: number;
    name: string;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
}

interface VerificationResponse {
    isOk: boolean;
    message?: string;
}

// Razorpay types
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
}

// Declare Razorpay on window object
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
        };
    }
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
    amount,
    currency,
    maxConnections,
    price,
    name
}) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setIsAuthenticated(!!firebaseUser);
            if (firebaseUser) {
                fetchUserProfile(firebaseUser.uid);
            } else {
                setUser(null);
                setError('Please log in to continue');
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!document.getElementById('razorpay-script')) {
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setIsRazorpayLoaded(true);
            script.onerror = () => setError('Failed to load payment system');
            document.body.appendChild(script);
        } else {
            setIsRazorpayLoaded(true);
        }
    }, []);

    const fetchUserProfile = async (uid: string): Promise<void> => {
        try {
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'uid': uid,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const userData = await response.json() as UserData;
            
            if (!userData.id || !userData.name || !userData.email || !userData.phone) {
                throw new Error('Please complete your profile before proceeding');
            }

            setUser(userData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load user profile');
            console.error('Error fetching user:', err);
        }
    };

    const handlePayment = async (): Promise<void> => {
        if (!isAuthenticated) {
            setError('Please log in to continue');
            return;
        }

        if (!isRazorpayLoaded) {
            setError('Payment system is still loading');
            return;
        }

        if (!user) {
            setError('Please complete your profile before proceeding');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    name,
                    price,
                    userId: user.id,
                    maxConnections
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const order = await response.json() as RazorpayOrder;

            if (!order?.id) {
                throw new Error('Invalid order response');
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: order.amount,
                currency: order.currency,
                name: 'FR Match',
                description: 'Payment for the service',
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    try {
                        const res = await fetch("/api/verify-order", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                amount,
                                currency,
                                name,
                                price,
                                userId: user.id,
                                maxConnections
                            }),
                        });

                        const data = await res.json() as VerificationResponse;
                        if (data.isOk) {
                            alert("Payment successful");
                            router.push('/Feed');
                        } else {
                            throw new Error(data.message || "Payment verification failed");
                        }
                    } catch (err) {
                        alert("Payment verification failed");
                        console.error('Verification error:', err);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment processing failed');
            console.error('Payment error:', err);
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = !isAuthenticated || !user || loading || !isRazorpayLoaded;

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handlePayment}
                disabled={isButtonDisabled}
                className={`py-2 px-4 mt-4 rounded-xl ${
                    isButtonDisabled 
                        ? 'bg-gray-200 cursor-not-allowed' 
                        : 'bg-primaryPink hover:bg-primaryPink/60'
                } text-white transition-colors`}
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
    );
};

export default CheckoutButton;