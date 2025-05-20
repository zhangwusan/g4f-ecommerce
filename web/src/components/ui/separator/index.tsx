import * as React from 'react';

export interface SeparatorProps extends React.HTMLProps<HTMLHRElement> {
  variant?: 'default' | 'dashed' | 'solid';
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClass = variant === 'dashed' ? 'border-dashed' : 'border-solid';

    return (
      <hr
        ref={ref}
        className={`my-4 border-t-2 border-gray-300 ${variantClass} ${className}`}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };