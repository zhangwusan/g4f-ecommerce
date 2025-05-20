'use client';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils/cn';


export interface SelectItemProps extends React.HTMLProps<HTMLDivElement> {
    value: string;
    children: React.ReactNode;
}


const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
    ({ value, children, className, ...props }, ref) => {
        return (
            <SelectPrimitive.Item
                ref={ref}
                value={value}
                className={cn(
                    'relative cursor-pointer select-none px-4 py-2 text-sm hover:bg-primary text-black hover:bg-slate-400',
                    className
                )}
                {...props}
            >
                <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
        );
    }
);

SelectItem.displayName = 'SelectItem';

export { SelectItem }