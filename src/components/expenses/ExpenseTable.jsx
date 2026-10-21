import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge } from './CategoryBadge';

export const ExpenseTable = ({ expenses = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
            <th className="py-3.5 px-4 sm:px-6">Description</th>
            <th className="py-3.5 px-4">Category</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Payment</th>
            <th className="py-3.5 px-4 text-right">Amount</th>
            <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="hover:bg-slate-50/60 transition-colors group"
            >
              {/* Description */}
              <td className="py-3.5 px-4 sm:px-6">
                <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {expense.description}
                </div>
              </td>

              {/* Category */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <CategoryBadge category={expense.category} />
              </td>

              {/* Date */}
              <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatDate(expense.date)}</span>
                </div>
              </td>

              {/* Payment Method */}
              <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>{expense.paymentMethod || 'UPI / GPay'}</span>
                </div>
              </td>

              {/* Amount */}
              <td className="py-3.5 px-4 whitespace-nowrap text-right">
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(expense.amount)}
                </span>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit Expense"
                    aria-label={`Edit ${expense.description}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(expense)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Expense"
                    aria-label={`Delete ${expense.description}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
