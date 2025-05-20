'use client';
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils/cn';

interface SelectValueProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value> {
    className?: string;
}

const SelectValue = React.forwardRef<HTMLDivElement, SelectValueProps>(
    ({ className, ...props }, ref) => {
        return (
            <SelectPrimitive.Value
                ref={ref}
                className={cn('text-sm', className)}
                {...props}
            />
        );
    }
);

SelectValue.displayName = 'SelectValue';

export { SelectValue };