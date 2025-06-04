'use client';

import { useState, useEffect } from 'react';
import { Separator } from '@/components/section/separator';
import { Label } from '@/components/ui/label';
import DeleteAccountSection from '@/components/layouts/delete-account-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSession } from 'next-auth/react';
import TwoFAComponent from '@/components/section/two-fa';
import { disable2FA, enable2FA, generate2FA } from './service';

export default function UserSettings() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // Profile data from session (replace with your real profile fetch if needed)
  const profile = session?.user ?? null;

  // User settings state
  const [settings, setSettings] = useState({
    notifications: true,
    twoFA: false,
    language: 'en',
    currency: 'USD',
  });

  // Initialize 2FA enabled state from session user info
  useEffect(() => {
    if (session?.user) {
      setSettings((prev) => ({
        ...prev,
        twoFA: session.user.is_2fa ?? false,
      }));
    }
  }, [session]);

  // Toggle notification and 2FA switches
  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Select language or currency
  const handleSelect = (key: 'language' | 'currency', value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account?')) {
      console.log('Account deletion initiated');
      // Implement actual delete logic here
    }
  };

  // Called when 2FA successfully enabled
  const handle2FAEnable = async () => {
    setSettings((prev) => ({ ...prev, twoFA: true }));
  };

  // Called when 2FA successfully disabled
  const handle2FADisable = async () => {
    setSettings((prev) => ({ ...prev, twoFA: false }));
  };

  if (loading || !profile) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="space-y-8 p-4 max-w-xl mx-auto">
      {/* Preferences Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Preferences</h2>

        <div className="flex items-center space-x-4">
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(val) => handleToggle('notifications', val)}
          />
          <Label htmlFor="notifications">Email Notifications</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={settings.language} onValueChange={(val) => handleSelect('language', val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={settings.currency}
            onValueChange={(val) => handleSelect('currency', val)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* Security Section - 2FA */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Security</h2>
        <TwoFAComponent
          enabled={settings.twoFA}
          onEnable={handle2FAEnable}
          onDisable={handle2FADisable}
          generate2FA={generate2FA}
          enable2FA={enable2FA}
          disable2FA={disable2FA}
        />
      </section>

      <Separator />

      {/* Danger Zone - Delete Account */}
      <DeleteAccountSection onDelete={handleDeleteAccount} />
    </div>
  );
}