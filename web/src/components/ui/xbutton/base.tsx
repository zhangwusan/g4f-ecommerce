import React from 'react';

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  color?: 'primary' | 'secondary';
  children?: React.ReactNode;
  default_style?: boolean,
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  color = 'primary',
  children,
  default_style=true
}) => {
  const colorClass = color === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-black';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md ${default_style ? colorClass : ''} ${className} disabled:opacity-50`}
    >
      {children ?? text}
    </button>
  );
};

export default Button;