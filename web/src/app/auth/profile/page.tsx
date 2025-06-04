'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { ProfileResponse } from '@/lib/type/profile.interface';
import AvatarUploader from '@/components/section/upload-profile';
import ChangePasswordSection from '@/components/layouts/change-password';
import ProfileForm from '@/components/layouts/update-profile';
import { errorToast, successToast } from '@/components/layouts/toast';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editableProfile, setEditableProfile] = useState<ProfileResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/auth/profile');
      const json = await res.json();
      setProfile(json.data);
      setEditableProfile(json.data);
    } catch (err) {
      console.error('Failed to load:', err);
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/auth/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setProfile((prev) => prev && { ...prev, avatar: json.avatar });
      successToast('User profile update successfully')
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload avatar.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => prev && ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!editableProfile) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/profile/update-infomation', {
        method: 'PATCH',
        body: JSON.stringify(editableProfile),
      });

      if (!res.ok) throw new Error('Update failed');
      const json = await res.json();
      setProfile(json.data);
      successToast('User profile update successfully')
    } catch (err: any) {
      console.error('Update error:', err);
      errorToast(err.error || 'Failed to create product')
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session || loading || !profile || !editableProfile) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div className="bg-card shadow-xl rounded-2xl p-6 space-y-6 transition-colors text-foreground">
        <AvatarUploader avatarUrl={profile.avatar} onFileChange={handleUpload} />

        <ProfileForm
          editableProfile={editableProfile}
          onChange={handleChange}
          onSubmit={handleUpdateProfile}
        />

        <ChangePasswordSection />
      </div>
    </div>
  );
}