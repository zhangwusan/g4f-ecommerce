'use client';

import { useSearchParams, useRouter } from 'next/navigation';
const errorMessages: Record<string, string> = {
  CredentialsSignin: 'Invalid credentials. Please check your email and password.',
  default: 'Something went wrong. Please try again.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const errorMessage = errorMessages[error ?? 'default'];

  const handleBack = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Authentication Error
        </h1>
        <p className="text-red-500 mb-6">{errorMessage}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}