'use client';

import OAuthSection from "@/components/layouts/xoauth";
import RegisterForm from "@/components/layouts/register-form";
import { BackButton } from "@/components/section/back-btn";
import Link from "next/link";

export default function AccountRegister() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 my-20">
      <div className="w-full max-w-md space-y-6">
        <BackButton />
        <div className="p-8 rounded-2xl shadow-xl transition-all">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create your account 🚀
          </h2>

          <RegisterForm />

          <div className="my-6 flex items-center gap-2">
            <div className="flex-grow border-t" />
            <span className="text-sm ">OR</span>
            <div className="flex-grow border-t" />
          </div>
          <OAuthSection />

          <p className="text-center text-sm mt-6">
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