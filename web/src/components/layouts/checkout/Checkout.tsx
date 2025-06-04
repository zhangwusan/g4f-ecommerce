'use client';

import React, { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { useCheckout } from "@/context/checkout";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "KHQR">("card");
    const [khqrScanned, setKhqrScanned] = useState(false);

    const { billingInfo, shippingInfo } = useCheckout();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shippingInfo) {
            alert("Please enter a shipping address.");
            return;
        }

        if (!billingInfo) {
            alert("Please enter billing information.");
            return;
        }

        setIsSubmitting(true);

        try {
            if (paymentMethod === "card") {
                if (!stripe || !elements) {
                    alert("Stripe is not initialized.");
                    setIsSubmitting(false);
                    return;
                }

                const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/cart/complete`,
                    },
                });

                if (result.error) {
                    alert(result.error.message);
                    console.error(result.error.message);
                    setIsSubmitting(false);
                }
            } else if (paymentMethod === "cod") {
                alert("Order placed with Cash on Delivery.");
                window.location.href = "/cart/complete?method=cod";
            } else if (paymentMethod === "KHQR") {
                if (!khqrScanned) {
                    alert("Please confirm that you've scanned the QR code.");
                    setIsSubmitting(false);
                    return;
                }

                alert("Order placed via KHQR.");
                window.location.href = "/cart/complete?method=khqr";
            }
        } catch (error: any) {
            alert(error.message || "Something went wrong");
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {/* Payment Method Selector */}
            <div className="space-y-2">
                <label className="font-medium">Select Payment Method:</label>
                <Select
                    value={paymentMethod}
                    onValueChange={(value) => {
                        setPaymentMethod(value as any);
                        setKhqrScanned(false);
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a payment method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                        <SelectItem value="KHQR">KHQR</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Conditional UI for Card */}
            {paymentMethod === "card" && <PaymentElement />}

            {/* Conditional UI for KHQR */}
            {paymentMethod === "KHQR" && (
                <div className="border p-4 rounded-md text-center space-y-2">
                    <p className="text-sm">Scan this QR Code to pay:</p>
                    <img
                        src="/mock-khqr.png"
                        alt="KHQR"
                        className="w-48 mx-auto"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setKhqrScanned(true)}
                        className="w-full"
                    >
                        I've scanned the QR code
                    </Button>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={
                    isSubmitting ||
                    (paymentMethod === "card" && !stripe) ||
                    (paymentMethod === "KHQR" && !khqrScanned)
                }
                className="w-full bg-blue-500"
            >
                {isSubmitting
                    ? paymentMethod === "card"
                        ? "Processing Payment..."
                        : "Placing Order..."
                    : paymentMethod === "card"
                        ? "Pay"
                        : "Place Order"}
            </Button>
        </form>
    );
};