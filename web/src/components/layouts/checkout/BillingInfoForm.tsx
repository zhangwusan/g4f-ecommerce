import { Input } from '@/components/ui/input';
import { useCheckout } from '@/context/checkout';
import { useEffect, useState } from 'react';

export default function BillingInfoForm({ onValidChange }: { onValidChange: (valid: boolean) => void }) {
  const { setBillingInfo } = useCheckout();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const valid = !!(fullName && email && phone);
    onValidChange(valid);
    if (valid) {
      setBillingInfo({ fullName, email, phone });
    }
  }, [fullName, email, phone]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Billing Information</h2>
      <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
    </div>
  );
}