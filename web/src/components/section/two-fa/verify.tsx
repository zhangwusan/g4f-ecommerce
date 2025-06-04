'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Verify2FA() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('2FA verified');
        router.push('/');
      } else {
        toast.error(result.message || 'Invalid 2FA code');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold text-center">Enter 2FA Code</h2>
      <Input
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <Button onClick={handleVerify} disabled={loading || code.length !== 6}>
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
    </div>
  );
}