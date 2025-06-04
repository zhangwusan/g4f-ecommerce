'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { stripePromise } from '@/lib/xutils/stripe';
import { useCart } from '@/context/cart';
import { useCheckout } from '@/context/checkout';

const CheckoutComplete = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Checking payment...');
  const [loading, setLoading] = useState(true);

  const { clearCartAndUpdateProduct } = useCart();
  const { shippingInfo } = useCheckout();

  const ship: string = shippingInfo
    ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}, ${shippingInfo.country}`
    : (() => {
        try {
          const stored = localStorage.getItem('shippingInfo');
          if (!stored) return '';
          const parsed = JSON.parse(stored);
          return `${parsed.address}, ${parsed.city}, ${parsed.zip}, ${parsed.country}`;
        } catch {
          return '';
        }
      })();

  useEffect(() => {
    const method = searchParams.get('method'); // cod | khqr
    const clientSecret = searchParams.get('payment_intent_client_secret');

    const createOrder = async ({
      paymentMethod,
      transactionId = '',
      paymentStatus = 'pending',
      amount = 0,
    }: {
      paymentMethod: string;
      transactionId?: string;
      paymentStatus?: string;
      amount?: number;
    }) => {
      try {
        await fetch('/api/orders/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shippingAddress: ship,
            amount,
            transactionId,
            paymentStatus,
            paymentMethod,
          }),
        });
        clearCartAndUpdateProduct();
        setMessage('Order placed successfully!');
      } catch (error) {
        setMessage('Order failed. Please contact support.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const checkPayment = async () => {
      if (clientSecret) {
        const stripe = await stripePromise;
        if (!stripe) return setMessage('Stripe failed to load.');

        const result = await stripe.retrievePaymentIntent(clientSecret);

        switch (result.paymentIntent?.status) {
          case 'succeeded':
            await createOrder({
              paymentMethod: result.paymentIntent.payment_method_types[0] || 'card',
              transactionId: result.paymentIntent.id,
              paymentStatus: result.paymentIntent.status,
              amount: result.paymentIntent.amount,
            });
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
      } else if (method === 'cod' || method === 'khqr') {
        // Simulate order creation for cod or khqr
        await createOrder({ paymentMethod: method });
      } else {
        setMessage('Missing payment information.');
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