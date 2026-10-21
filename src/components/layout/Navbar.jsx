import React from 'react';
import { Menu, Plus, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency } from '../../utils/formatters';

export const Navbar = ({ onOpenMobile, onOpenAddModal, title = 'Dashboard' }) => {
  const { dashboardStats } = useExpenses();

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Right: Budget Alert Badge & Add Expense Button */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Budget Status Badge */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            dashboardStats.isOverBudget
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : dashboardStats.isNearBudget
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {dashboardStats.isOverBudget ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Over Budget ({formatCurrency(Math.abs(dashboardStats.remainingBudget))})</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{formatCurrency(dashboardStats.remainingBudget)} Left</span>
            </>
          )}
        </div>

        {/* Quick Add Expense Trigger */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Expense</span>
        </button>
      </div>
    </header>
  );
};
