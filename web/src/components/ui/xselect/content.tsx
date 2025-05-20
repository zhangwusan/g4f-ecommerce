'use client';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

export interface SelectContentProps {
    children: React.ReactNode;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
    ({ children, ...props }, ref) => {
        return (
            <SelectPrimitive.Content ref={ref} {...props} className="z-50">
                <div className="w-56 rounded-md border border-gray-300 bg-white shadow-md">{children}</div>
            </SelectPrimitive.Content>
        );
    }
);

SelectContent.displayName = 'SelectContent';

export { SelectContent };