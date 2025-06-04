import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

type RadioFilterProps = {
  name: string;
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
};

export default function RadioFilter({ name, options, selected, onChange }: RadioFilterProps) {
  return (
    <ul className="space-y-1">
      {options.map((option) => (
        <li key={option}>
          <Label className="flex items-center gap-2 text-sm cursor-pointer">
            <Input
              type="radio"
              name={name}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="form-radio"
            />
            {option}
          </Label>
        </li>
      ))}
    </ul>
  );
}