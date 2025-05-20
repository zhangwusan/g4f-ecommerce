import { loadStripe } from '@stripe/stripe-js';

const NEXT_PUBLIC_STRIPE_PUBLISHAbLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RM7iYQ27LO6F'
export const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHAbLE_KEY);