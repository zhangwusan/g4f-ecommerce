// components/AddressForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AddressFormProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AddressForm({ value, onChange }: AddressFormProps) {
  return (
    <div className="mb-6">
      <Label htmlFor="shipping-address">Shipping Address</Label>
      <Input
        id="shipping-address"
        placeholder="Enter your shipping address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}