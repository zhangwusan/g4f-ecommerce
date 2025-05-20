'use client';

import OAuthSection from "@/components/layouts/Oauth";
import RegisterForm from "@/components/layouts/register-form";
import BackButton from "@/components/ui/xbutton/back-btn";
import Link from "next/link";

export default function AccountRegister() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 my-20">
      <div className="w-full max-w-md space-y-6">
        <BackButton />
        <div className="p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-800 transition-all">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Create your account 🚀
          </h2>

          <RegisterForm />

          <div className="my-6 flex items-center gap-2">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
          </div>
          <OAuthSection />

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}