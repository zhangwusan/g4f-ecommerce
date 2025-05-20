import React from 'react';

interface AsideCategoriesProps {
  categories: string[];
  selected_category: string;
  on_select_category: (category: string) => void;
}

export default function AsideCategories({
  categories,
  selected_category,
  on_select_category,
}: AsideCategoriesProps) {
  return (
    <aside className="w-full p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
      <ul className="space-y-2">
        {categories.map((category) => {
          const isSelected = selected_category === category;
          return (
            <li key={category}>
              <button
                onClick={() => on_select_category(category)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition 
                  ${isSelected
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'hover:bg-blue-100 dark:hover:bg-blue-700'
                  }`}
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}