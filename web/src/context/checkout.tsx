'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type BillingInfo = {
  fullName: string;
  email: string;
  phone: string;
};

type ShippingInfo = {
  address: string;
  city: string;
  zip: string;
  country: string;
};

type CheckoutContextType = {
  billingInfo: BillingInfo | null;
  setBillingInfo: (info: BillingInfo) => void;
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [billingInfo, setBillingInfoState] = useState<BillingInfo | null>(null);
  const [shippingInfo, setShippingInfoState] = useState<ShippingInfo | null>(null);

  // Load from localStorage once on mount
  useEffect(() => {
    const storedBilling = localStorage.getItem('billingInfo');
    const storedShipping = localStorage.getItem('shippingInfo');

    if (storedBilling) {
      setBillingInfoState(JSON.parse(storedBilling));
    }
    if (storedShipping) {
      setShippingInfoState(JSON.parse(storedShipping));
    }
  }, []);

  // Wrap setters to also persist to localStorage
  const setBillingInfo = (info: BillingInfo) => {
    setBillingInfoState(info);
    localStorage.setItem('billingInfo', JSON.stringify(info));
  };

  const setShippingInfo = (info: ShippingInfo) => {
    setShippingInfoState(info);
    localStorage.setItem('shippingInfo', JSON.stringify(info));
  };

  return (
    <CheckoutContext.Provider
      value={{ billingInfo, setBillingInfo, shippingInfo, setShippingInfo }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};