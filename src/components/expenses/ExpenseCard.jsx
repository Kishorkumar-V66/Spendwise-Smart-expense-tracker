import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge } from './CategoryBadge';

export const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-sm transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="mb-1.5">
            <CategoryBadge category={expense.category} size="xs" />
          </div>
          <h4 className="font-semibold text-slate-900 text-sm leading-snug truncate">
            {expense.description}
          </h4>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-900 text-base">
            {formatCurrency(expense.amount)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(expense.date)}
          </span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            {expense.paymentMethod || 'UPI'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(expense)}
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
