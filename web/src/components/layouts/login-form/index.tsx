'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import GenericForm from '@/components/ui/form/generic-form';
import InputField from '@/components/ui/input-box/input-field';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = formData;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      toast.error(res.error);
      setLoading(false);
    } else {
      toast.success('Logged in successfully!');
      router.push('/');
    }
  };

  return (
    <>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <GenericForm
        onSubmit={handleSubmit}
        name_button={loading ? 'Logging in...' : 'Login'}
      >
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </GenericForm>
    </>
  );
}