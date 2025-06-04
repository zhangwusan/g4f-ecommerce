import React from 'react';
import { Button } from '../../ui/button';

type ColorSwatchFilterProps = {
  colors: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export default function ColorSwatchFilter({ colors, selected, onChange }: ColorSwatchFilterProps) {
  const toggleColor = (color: string) => {
    if (selected.includes(color)) {
      onChange(selected.filter((c) => c !== color)); // Remove the color from the selection
    } else {
      onChange([...selected, color]); // Add the color to the selection
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <Button
          key={color}
          title={color}
          onClick={() => toggleColor(color)}
          className={`w-6 h-6 rounded-full border-2 transition duration-150 ${
            selected.includes(color) ? 'ring-2 ring-blue-500' : 'border-gray-300'
          }`}
          style={{ backgroundColor: color.toLowerCase() }}
        />
      ))}
    </div>
  );
}