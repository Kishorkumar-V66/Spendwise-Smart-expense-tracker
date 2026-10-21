import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Sparkles, ShieldCheck, ArrowLeft, History } from 'lucide-react';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { CategoryBadge } from '../components/expenses/CategoryBadge';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AddExpensePage = () => {
  const { addExpense, expenses, dashboardStats } = useExpenses();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = (expenseData) => {
    addExpense(expenseData);
    addToast('Expense recorded successfully!', 'success');
    navigate('/expenses');
  };

  const recentEntries = expenses.slice(0, 4);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Log New Expense
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All data is stored directly in your browser's localStorage
              </p>
            </div>
          </div>

          <ExpenseForm
            onSubmit={handleFormSubmit}
            submitLabel="Save Transaction"
          />
        </div>

        {/* Side Info & Recent Entries (1 col) */}
        <div className="space-y-5">
          {/* Budget Health Mini Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-indigo-200">
              <span>This Month's Budget</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {formatCurrency(dashboardStats.remainingBudget)}
              </p>
              <p className="text-xs text-indigo-300 mt-0.5">
                {dashboardStats.isOverBudget ? 'Deficit' : 'Remaining available'}
              </p>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  dashboardStats.isOverBudget
                    ? 'bg-rose-400'
                    : dashboardStats.isNearBudget
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(dashboardStats.budgetUsagePercent, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-200/80">
              Budget: {formatCurrency(dashboardStats.budgetAmount)} • Spent: {formatCurrency(dashboardStats.thisMonthTotal)}
            </p>
          </div>

          {/* Recent Added preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recently Logged</span>
            </div>

            {recentEntries.length === 0 ? (
              <p className="text-xs text-slate-400">No expenses recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-slate-800 truncate">{entry.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(entry.date)}</p>
                    </div>
                    <span className="font-bold text-slate-900 flex-shrink-0">
                      {formatCurrency(entry.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
