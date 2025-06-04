'use client';
import LoginForm from '@/components/layouts/login-form';
import OAuthSection from '@/components/layouts/xoauth';
import { BackButton } from '@/components/section/back-btn';
import Link from 'next/link';

export default function AccountLogin() {

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Back Button */}
        <BackButton />

        {/* Login Card */}
        <div className="p-8 rounded-2xl shadow-xl transition-all">
          <h2 className="text-2xl font-bold text-center mb-6">
            Welcome back 👋
          </h2>

          {/* Login form component */}
          <LoginForm />

          {/* OAuth Login Options */}
          <div className="my-6 flex items-center gap-2">
            <div className="flex-grow border-t" />
            <span className="text-sm ">OR</span>
            <div className="flex-grow border-t" />
          </div>
          <OAuthSection />

          <p className="text-center text-sm mt-6">
            Don’t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}