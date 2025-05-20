'use client';

import { cn } from '@/lib/utils/cn';
import * as React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, checked, onCheckedChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <div className="flex items-center space-x-2">
        {label && <label htmlFor={props.id} className="text-sm">{label}</label>}
        <input
          type="checkbox"
          className={cn(
            'peer h-6 w-11 rounded-full border-2 border-input bg-transparent transition-colors duration-200 ease-in-out',
            checked
              ? 'bg-primary border-primary'
              : 'bg-muted-foreground border-muted-foreground',
            className
          )}
          checked={checked}
          onChange={handleChange}
          {...props}
          ref={ref}
        />
        {/* <span
          className={cn(
            'peer-checked:translate-x-5 relative inline-block h-5 w-5 rounded-full bg-white transition-all',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        /> */}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export { Switch };