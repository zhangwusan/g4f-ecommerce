'use client'

import BillingInfoForm from "@/components/layouts/checkout/BillingInfoForm";
import OrderPreview from "@/components/layouts/checkout/OrderPreview";
import { PaymentSection } from "@/components/layouts/checkout/PaymentSection";
import ShippingInfoForm from "@/components/layouts/checkout/ShippingInfoForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CheckoutPage = () => {
    const [step, setStep] = useState(0);
    const [isStepValid, setIsStepValid] = useState(false);

    const handleNext = () => {
        if (!isStepValid) return;
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => Math.max(0, prev - 1));
    };

    return (
            <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="w-full rounded-lg shadow-lg p-8">
                    {step === 0 && <BillingInfoForm onValidChange={setIsStepValid} />}
                    {step === 1 && <ShippingInfoForm onValidChange={setIsStepValid} />}
                    {step === 2 && <OrderPreview />}
                    {step === 3 && <PaymentSection />}
                    {/* {step === 4 && <ConfirmationMessage />} */}

                    {/* Button row */}
                    {step < 3 && (
                        <div className="flex justify-between mt-8">
                            <div>
                                {step > 0 && (
                                    <Button onClick={handleBack} variant="outline">
                                        Back
                                    </Button>
                                )}
                            </div>
                            <div>
                                <Button onClick={handleNext} disabled={!isStepValid}>
                                    {step === 3 ? "Confirm Payment" : "Next"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

    );
};

export default CheckoutPage;