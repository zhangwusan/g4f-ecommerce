'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

type TwoFAProps = {
    enabled: boolean;
    onEnable: () => Promise<void>;
    onDisable: () => Promise<void>;
    generate2FA: () => Promise<{ qrCode: string }>;
    enable2FA: (code: string) => Promise<void>;
    disable2FA: (code: string) => Promise<void>;
};

export default function TwoFAComponent({
    enabled,
    onEnable,
    onDisable,
    generate2FA,
    enable2FA,
    disable2FA,
}: TwoFAProps) {
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [showPrompt, setShowPrompt] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = async (checked: boolean) => {
        setError(null);
        if (checked) {
            setLoading(true);
            try {
                const data = await generate2FA();
                setQrCode(data.qrCode);
                setShowPrompt(true);
            } catch (err: any) {
                setError(err.error || 'Failed to generate 2FA');
            } finally {
                setLoading(false);
            }
        } else {
            setShowPrompt(true);
        }
    };

    const handleConfirm = async () => {
        setError(null);
        setLoading(true);
        try {
            if (!isEnabled) {
                await enable2FA(code);
                setIsEnabled(true);
                await onEnable();
            } else {
                await disable2FA(code);
                setIsEnabled(false);
                await onDisable();
            }
            handleClose();
        } catch (err: any) {
            setError(err.error || 'Invalid code');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
        setQrCode(null);
        setCode('');
        setError(null);
    };

    return (
        <div>
            <div className="flex items-center space-x-2 cursor-pointer select-none">
                <Switch
                    id="twoFA"
                    checked={isEnabled}
                    onCheckedChange={handleToggle}
                    disabled={loading}
                />
                <Label htmlFor="twoFA">Enable Two-Factor Authentication</Label>
            </div>

            <Dialog open={showPrompt} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </DialogTitle>
                    </DialogHeader>

                    {!isEnabled && qrCode && (
                        <div className="flex flex-col items-center text-center mb-4">
                            <p className="mb-2">Scan this QR code with your authenticator app:</p>
                            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                        </div>
                    )}

                    <Label htmlFor="twoFACode">Enter 6-digit code</Label>
                    <Input
                        id="twoFACode"
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputMode="numeric"
                        autoFocus
                    />

                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

                    <DialogFooter className="mt-4">
                        <Button onClick={handleConfirm} disabled={loading || code.length !== 6}>
                            {isEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </Button>
                        <Button variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}