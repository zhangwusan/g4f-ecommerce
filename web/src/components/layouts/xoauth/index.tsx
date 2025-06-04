'use client';

import React, { useState } from 'react';
import { Chrome } from 'lucide-react';
import { signIn } from 'next-auth/react';
import OAuthButton from './button';

const OAuthSection = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: string) => {
    setLoadingProvider(provider);

    const response = await signIn(provider, {
      callbackUrl: '/',
    });

    setLoadingProvider(null);

  };

  return (
    <>
      <OAuthButton
        onClick={() => handleOAuthLogin('google')}
        icon={<Chrome size={18} />}
        provider="Google"
        loading={loadingProvider === 'google'}
      />
    </>
  );
};

export default OAuthSection;