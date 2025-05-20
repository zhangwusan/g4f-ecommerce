import React from 'react';

export default function TopBar() {
  return (
    <div className="bg-white text-black dark:bg-gray-800 dark:text-white text-sm px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-medium">Welcome to My G4F Store</div>
        <div className="flex gap-4">
          <div className="cursor-pointer hover:underline">Deliver to</div>
          <div className="cursor-pointer hover:underline">Location</div>
          <div className="cursor-pointer hover:underline">All Offers</div>
        </div>
      </div>
    </div>
  );
}