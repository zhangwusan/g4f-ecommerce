'use client';

import { Input } from '@/components/ui/input';
import { useCheckout } from '@/context/checkout';

import { useEffect, useState } from 'react';

export default function ShippingInfoForm({
  onValidChange,
}: {
  onValidChange: (valid: boolean) => void;
}) {
  const { setShippingInfo } = useCheckout();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const valid = !!(address && city && zip && country);
    onValidChange(valid);
    if (valid) {
      setShippingInfo({ address, city, zip, country });
    }
  }, [address, city, zip, country]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Shipping Information</h2>
      <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <Input placeholder="ZIP Code" value={zip} onChange={(e) => setZip(e.target.value)} />
      <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
    </div>
  );
}