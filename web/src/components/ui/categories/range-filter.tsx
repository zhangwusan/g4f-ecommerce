// components/filters/range-filter.tsx

import React from 'react';

type PriceRangeFilterProps = {
  maxPrice: number;
  selectedPrice: number;
  onChange: (price: number) => void;
};

export default function PriceRangeFilter({
  maxPrice,
  selectedPrice,
  onChange,
}: PriceRangeFilterProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value)); // Update the selected price
  };

  return (
    <div>
      <label className="block text-sm font-medium">Price (Max)</label>
      <input
        type="range"
        min={0}
        max={maxPrice}
        value={selectedPrice}
        onChange={handlePriceChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs">
        <span>$0</span>
        <span>${selectedPrice}</span>
      </div>
    </div>
  );
}