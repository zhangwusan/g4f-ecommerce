'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface OAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  provider: string;
  loading?: boolean;
}

const OAuthButton = ({ icon, provider, loading = false, ...props }: OAuthButtonProps) => {
  return (
    <Button
      variant="outline"
      type="button"
      disabled={loading}
      className="w-full justify-start gap-2"
      {...props}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        icon
      )}
      <span className="text-sm">Continue with {provider}</span>
    </Button>
  );
};

export default OAuthButton;