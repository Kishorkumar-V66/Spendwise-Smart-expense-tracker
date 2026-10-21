import React from 'react';
import { CATEGORIES } from '../../utils/constants';
import * as Icons from 'lucide-react';

export const CategoryBadge = ({ category, size = 'sm' }) => {
  const cat = CATEGORIES.find((c) => c.id === category) || {
    id: category,
    label: category,
    icon: 'Tag',
    bgLight: 'bg-slate-50 text-slate-700 border-slate-200',
    color: '#64748B',
  };

  const IconComponent = Icons[cat.icon] || Icons.Tag;

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border ${
        cat.bgLight || 'bg-slate-50 text-slate-700 border-slate-200'
      } ${sizeClasses[size] || sizeClasses.sm}`}
    >
      <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{cat.label}</span>
    </span>
  );
};
