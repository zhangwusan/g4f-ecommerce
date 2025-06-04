import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./Checkout";
import { useCart } from "@/context/cart";
import { BackButton } from "@/components/section/back-btn";

// Load Stripe outside the component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const PaymentSection = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { total } = useCart();

  useEffect(() => {
    const createPaymentIntent = async () => {
      const res = await fetch('/api/stripe/payments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100)}),
      });

      const data = await res.json();
      setClientSecret(data.clientSecret);
    };

    createPaymentIntent();
  }, []);

  if (!clientSecret) return <p>Loading payment form...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <BackButton/>
      <CheckoutForm />
    </Elements>
  );
};