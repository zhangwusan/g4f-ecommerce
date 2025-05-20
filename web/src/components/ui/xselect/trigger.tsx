'use client';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils/cn';

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          'inline-flex items-center justify-between rounded-md border border-input px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </SelectPrimitive.Trigger>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger }