'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Dialog,
} from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';

export default function TwoFAPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const provider = searchParams.get('provider') || 'credentials';
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setError('');

        if (!provider || !token || !code) {
            setError('Missing provider, token, or code');
            return;
        }

        setLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            token,
            code,
            email,
            password: `__from_${provider}__`,
        });

        setLoading(false);

        if (typeof res === 'string') {
            router.push(res);
        } else if (res?.error) {
            setError('Invalid code or login failed');
        } else {
            router.push('/');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 border rounded-xl shadow-sm">
            <Dialog>
                <DialogHeader>
                    <DialogTitle>Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        Enter the 6-digit 2FA code from your authenticator app.
                    </DialogDescription>
                </DialogHeader>
            </Dialog>
            <Input
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="mt-4"
                autoFocus
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleVerify} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify'}
                </Button>
            </div>
        </div>
    );
}