'use client';

import React, { useState } from 'react';
import GenericForm from '@/components/ui/form/generic-form';
import InputField from '@/components/ui/input-box/input-field';
import { useRouter } from 'next/navigation';

interface Props {
    className?: string;
}

export default function RegisterForm({ className = '' }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        username: '',
        phone_number: '',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const {
            email,
            password,
            confirm_password,
            first_name,
            last_name,
            username,
            phone_number,
            address,
        } = formData;

        if (password !== confirm_password) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    confirm_password,
                    first_name,
                    last_name,
                    username,
                    phone_number,
                    address,
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Registration error:', errorResponse);
                setError(errorResponse.error || 'Registration failed');
            }
            const data = await response.json();
            if (data.message === 'User registered successfully') {
                setSuccess(true);
                router.push('/auth/login');
            } else {
                setError(data.message || 'Registration failed');
            }

        } catch (err) {
            console.error('Error during registration:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GenericForm
            onSubmit={handleFormSubmit}
            className={`p-6 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${className}`}
            name_button={loading ? 'Registering...' : 'Register'}
        >
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            {/* Section 1: Credentials */}
            <div className="space-y-4 border-b pb-6 border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Account Credentials</h3>
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    placeholder="Re-enter password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Section 2: Profile Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h3>
                <div className="flex gap-4 justify-center">
                    <InputField
                        label="First Name"
                        name="first_name"
                        type="text"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Last Name"
                        name="last_name"
                        type="text"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <InputField
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Phone Number"
                    name="phone_number"
                    type="tel"
                    placeholder="0123456789"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Address"
                    name="address"
                    type="text"
                    placeholder="Street 578, Phnom Penh"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
        </GenericForm>
    );
}