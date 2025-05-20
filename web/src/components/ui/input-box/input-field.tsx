import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    required = false,
    value,
    onChange,
    className = '',
    disabled = false,
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium mb-1 opacity-75">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-nonetext-black focus:ring focus:ring-blue-300 ${className}`}
                disabled={disabled}
            />
        </div>
    );
};

export default InputField;