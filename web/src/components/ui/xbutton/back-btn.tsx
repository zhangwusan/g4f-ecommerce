'use client';

import { useRouter } from 'next/navigation';
import Button from './base';

export default function BackButton() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button
      onClick={handleGoBack}
      className="text-sm text-blue-600 hover:underline block mb-4 bg-transparent p-0"
      color="secondary"
    >
      ← Back
    </Button>
  );
}