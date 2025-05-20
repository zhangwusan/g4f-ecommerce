import { Button } from "@/components/ui/xbutton";
import { nextPublicApiBaseUrl } from "@/lib/constants/env";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        // Confirm the payment with Stripe
        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${nextPublicApiBaseUrl}/cart/complete`,
            },
        });

        // Handle any errors that occur during the confirmation
        if (result.error) {
            console.error(result.error.message);
            alert(result.error.message);
        }

        // clear cart and update
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
            <PaymentElement />
            <Button type="submit" disabled={!stripe} className='w-full bg-blue-500'>
                Pay
            </Button>
        </form>
    );
};