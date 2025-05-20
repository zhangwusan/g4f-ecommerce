'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { stripePromise } from '@/lib/utils/stripe';
import { useCart } from '@/context/cart';

const CheckoutComplete = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Checking payment...');
  const [loading, setLoading] = useState(true);
  const { clearCartAndUpdateProduct } = useCart();

  useEffect(() => {
    const checkPayment = async () => {
      const clientSecret = searchParams.get('payment_intent_client_secret');
      if (!clientSecret) return setMessage('Missing payment information.');

      const stripe = await stripePromise;
      if (!stripe) return setMessage('Stripe failed to load.');

      const result = await stripe.retrievePaymentIntent(clientSecret);

      switch (result.paymentIntent?.status) {
        case 'succeeded':
          clearCartAndUpdateProduct();
          setMessage('Payment successful!');
          break;
        case 'processing':
          setMessage('Payment processing...');
          setLoading(false);
          break;
        case 'requires_payment_method':
          setMessage('Payment failed. Try again.');
          setLoading(false);
          break;
        default:
          setMessage('Something went wrong.');
          setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams]);

  return (
    <div className="text-center text-lg mt-10">
      {loading ? <p>{message}</p> : <p>{message}</p>}
    </div>
  );
};

export default CheckoutComplete;