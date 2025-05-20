'use client';

import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/utils/stripe';
import { CheckoutForm } from '@/components/layouts/checkout-form';
import { useCart } from '@/context/cart';

const CheckoutPage = () => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { cart } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const amount = Math.round(Number(total.toFixed(2)) * 100);

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const res = await fetch('/api/stripe/payments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount }),
                });

                if (!res.ok) {
                    throw new Error('Failed to create payment intent');
                }

                const data = await res.json();
                setClientSecret(data.clientSecret);
            } catch (err: any) {
                setError(err.message || 'Unexpected error');
            } finally {
                setLoading(false);
            }
        };

        stripePromise.then(() => setIsStripeLoaded(true));
        fetchClientSecret();
    }, [cart, amount]);


    if (cart.length === 0) return <p className="text-center">Cart is empty</p>;
    if (loading || !isStripeLoaded) return <p className="text-center">Loading payment...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!clientSecret) return <p className="text-center text-red-500">Failed to initialize payment.</p>;
    
    const appearance: { theme: 'stripe' | 'flat' | 'night' } = { theme: 'stripe' };
    const options = {
        clientSecret, // safe now
        appearance,
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
                <h1 className="text-center text-2xl font-bold mb-6">Checkout</h1>
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    );
};

export default CheckoutPage;