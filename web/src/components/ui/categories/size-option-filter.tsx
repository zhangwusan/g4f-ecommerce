// components/filters/SizeOptionFilter.tsx
import React from 'react';

type SizeOptionFilterProps = {
  sizes: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function SizeOptionFilter({ sizes, selected, onChange }: SizeOptionFilterProps) {
  const toggleSize = (size: string) => {
    if (selected.includes(size)) {
      onChange(selected.filter((s) => s !== size));
    } else {
      onChange([...selected, size]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => toggleSize(size)}
          className={`text-sm px-2 py-1 rounded border transition duration-150 ${
            selected.includes(size)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-blue-100 dark:hover:bg-gray-700'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}