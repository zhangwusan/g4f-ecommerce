'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProfileResponse } from '@/lib/type/profile.interface';

interface ProfileFormProps {
  editableProfile: ProfileResponse;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ editableProfile, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={editableProfile.first_name}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={editableProfile.last_name}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={editableProfile.username}
              onChange={onChange}
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={editableProfile.email}
              onChange={onChange}
              disabled
              className="disabled:opacity-60"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={editableProfile.phone_number || ''}
              onChange={onChange}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={editableProfile.address || ''}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">About User</h3>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself..."
            value={editableProfile.bio || ''}
            onChange={onChange}
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Profile
      </Button>
    </form>
  );
};

export default ProfileForm;