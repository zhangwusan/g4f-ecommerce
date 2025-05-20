'use client';

import Form from '@/components/ui/form/generic-form';
import InputField from '@/components/ui/input-box/input-field';
import { ChangePasswordRequest } from '@/lib/type/profile.interface';
import { useState, FormEvent } from 'react';

export default function ChangePasswordSection() {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [passwords, setPasswords] = useState<ChangePasswordRequest>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const submitPasswordChange = async (e: FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            setToast({ message: 'Passwords do not match!', type: 'error' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        try {
            const res = await fetch('/api/auth/profile/change-password', {
                method: 'POST',
                body: JSON.stringify(passwords),
            });

            const result = await res.json();

            if (!res.ok) {
                const message = result?.message || 'Failed to change password';
                setToast({ message, type: 'error' });
                setTimeout(() => setToast(null), 3000);
                return;
            }

            setToast({ message: 'Password changed successfully!', type: 'success' });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            setToast({ message: 'Something went wrong', type: 'error' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    return (
        <div className="">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            {toast && (
                <div
                    className={`mt-4 px-4 py-2 rounded-md text-white text-sm shadow transition-opacity duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                >
                    {toast.message}
                </div>
            )}
            <Form onSubmit={submitPasswordChange} name_button="Update Password" className='w-full'>
                <InputField
                    label="Old Password"
                    name="oldPassword"
                    type="password"
                    placeholder="Enter old password"
                    value={passwords.oldPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <InputField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                />
            </Form>
        </div>
    );
}