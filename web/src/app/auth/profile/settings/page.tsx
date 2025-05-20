'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/xbutton';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/xselect';
import DeleteAccountSection from '@/components/layouts/delete-account-section';

export default function UserSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    twoFA: false,
    language: 'en',
    currency: 'USD',
  });

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelect = (key: 'language' | 'currency', value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account?')) {
      // API call or logic here
      console.log('Account deletion initiated');
    }
  };

  return (
    <div className="space-y-8">
      {/* Preferences */}
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

      {/* Security */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Security</h2>
        <div className="flex items-center space-x-4">
          <Switch
            id="twoFA"
            checked={settings.twoFA}
            onCheckedChange={(val) => handleToggle('twoFA', val)}
          />
          <Label htmlFor="twoFA">Enable Two-Factor Authentication</Label>
        </div>
      </section>

      <Separator />

      {/* Danger Zone */}
      <DeleteAccountSection onDelete={() => {
        // Call your API here to delete the account
        console.log('Account deletion logic goes here');
      }} />
    </div>
  );
}