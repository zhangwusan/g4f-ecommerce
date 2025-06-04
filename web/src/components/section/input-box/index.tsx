import React from "react";

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  default_style?: boolean;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className = "", default_style = true, ...props }, ref) => {
    const baseStyle = "w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none transition";
    
    return (
      <input
        ref={ref}
        className={`${default_style ? baseStyle : ""} ${className}`}
        {...props}
      />
    );
  }
);

BaseInput.displayName = "BaseInput";

export default BaseInput;