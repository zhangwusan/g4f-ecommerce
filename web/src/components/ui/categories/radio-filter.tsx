import React from 'react';

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
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="form-radio"
            />
            {option}
          </label>
        </li>
      ))}
    </ul>
  );
}