import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

type CheckboxFilterProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function CheckboxFilter({ options, selected, onChange }: CheckboxFilterProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <ul className="space-y-1">
      {options.map((option) => (
        <li key={option}>
          <Label className="flex items-center gap-2 text-sm cursor-pointer">
            <Input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="form-checkbox rounded"
            />
            {option}
          </Label>
        </li>
      ))}
    </ul>
  );
}
