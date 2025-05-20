import React from 'react';

interface InputAreaProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  className?: string;
}

const InputArea: React.FC<InputAreaProps> = ({
  label,
  name,
  placeholder = '',
  value,
  onChange,
  required = false,
  rows = 4,
  className = '',
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1 opacity-75">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full text-black rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      />
    </div>
  );
};

export default InputArea;