'use client';

import Form from '@/components/ui/form/generic-form';
import InputArea from '@/components/ui/input-box/input-area';
import InputField from '@/components/ui/input-box/input-field';
import { ProfileResponse } from '@/lib/type/profile.interface';
import React from 'react';

interface ProfileFormProps {
  editableProfile: ProfileResponse;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ editableProfile, onChange, onSubmit }) => {
  return (
    <Form onSubmit={onSubmit} name_button="Save Profile">

      <div>
        <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
        <InputField
          label="First Name"
          name="first_name"
          value={editableProfile.first_name}
          onChange={onChange}
          required
        />
        <InputField
          label="Last Name"
          name="last_name"
          value={editableProfile.last_name}
          onChange={onChange}
          required
        />
        <InputField
          label="Username"
          name="username"
          value={editableProfile.username}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
        <InputField
          label="Email"
          name="email"
          type="email"
          disabled
          value={editableProfile.email}
          onChange={onChange}
          className=' disabled:bg-gray-400'
          required
        />
        <InputField
          label="Phone"
          name="phone_number"
          value={editableProfile.phone_number || ''}
          onChange={onChange}
        />
        <InputField
          label="Address"
          name="address"
          value={editableProfile.address || ''}
          onChange={onChange}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">About User</h3>
        <InputArea
          label="Bio"
          name="bio"
          value={editableProfile.bio || ''}
          onChange={onChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>
    </Form>
  );
};

export default ProfileForm;