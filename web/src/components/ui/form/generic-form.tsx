'use client';

import React, { ReactNode, FormEvent } from 'react';
import Button from '../xbutton/base';

interface FormProps {
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  className?: string;
  name_button?: string;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className = '',
  name_button = 'Submit',
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
        {name_button}
      </Button>
    </form>
  );
};

export default Form;