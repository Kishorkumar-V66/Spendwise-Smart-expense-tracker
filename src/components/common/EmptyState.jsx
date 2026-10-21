import React from 'react';
import * as Icons from 'lucide-react';

export const EmptyState = ({
  iconName = 'Receipt',
  title = 'No expenses found',
  description = 'You have not added any expenses matching this criteria yet.',
  actionText,
  onAction,
}) => {
  const IconComponent = Icons[iconName] || Icons.Inbox;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="p-4 bg-white rounded-2xl shadow-xs border border-slate-200/80 text-slate-400 mb-4">
        <IconComponent className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="mt-1 text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Icons.Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
