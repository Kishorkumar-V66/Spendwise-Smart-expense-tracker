import React from 'react';
import { CATEGORIES } from '../../utils/constants';

export const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelectCategory('ALL')}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === 'ALL'
            ? 'bg-slate-900 text-white shadow-xs'
            : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
        }`}
      >
        All Categories
      </button>

      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
