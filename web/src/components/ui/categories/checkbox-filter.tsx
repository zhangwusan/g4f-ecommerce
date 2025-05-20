// components/filters/CheckboxFilter.tsx
import React from 'react';

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
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="form-checkbox rounded"
            />
            {option}
          </label>
        </li>
      ))}
    </ul>
  );
}
