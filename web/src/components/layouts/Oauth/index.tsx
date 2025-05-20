import React from 'react';
import { Chrome, Github } from 'lucide-react';
import OAuthButton from '@/components/ui/xbutton/Oauth-btn';
import { signIn } from 'next-auth/react';

const handleOAuthLogin = async (provider: string) => {
    await signIn(provider);
};

const OAuthSection = () => {
    return (
        <div className="space-y-3">
            <OAuthButton
                onClick={() => handleOAuthLogin('google')}
                icon={<Chrome size={18} />}
                provider="Google"
            />
            <OAuthButton
                onClick={() => handleOAuthLogin('github')}
                icon={<Github size={18} />}
                provider="GitHub"
            />
        </div>
    );
};

export default OAuthSection;