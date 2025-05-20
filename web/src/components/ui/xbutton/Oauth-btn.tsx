import React from 'react';
import { ReactNode } from 'react';

interface OAuthButtonProps {
  onClick: () => void;
  icon: ReactNode;
  provider: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ onClick, icon, provider }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      {icon}
      <span className="text-sm text-gray-800 dark:text-white">
        Continue with {provider}
      </span>
    </button>
  );
};

export default OAuthButton;