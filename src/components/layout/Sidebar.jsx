import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  PieChart,
  Wallet,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export const Sidebar = ({ onCloseMobile }) => {
  const { dashboardStats, resetData } = useExpenses();
  const { addToast } = useToast();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'All Expenses', icon: Receipt },
    { to: '/add-expense', label: 'Add Expense', icon: PlusCircle },
    { to: '/budget', label: 'Budget Tracker', icon: Wallet },
    { to: '/analytics', label: 'Analytics & Trends', icon: PieChart },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all expense data to initial demo state?')) {
      resetData();
      addToast('Expenses and budget reset to demo data', 'info');
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <TrendingUp className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight flex items-center gap-1">
            SpendWise
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          </h1>
          <p className="text-[11px] font-medium text-slate-400">Expense Tracker</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 transition-transform duration-150 ${
                      isActive ? 'text-indigo-600 scale-105' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.to === '/analytics' && (
                    <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Mini Budget Widget */}
      <div className="p-4 mx-3 mb-3 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200/70">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
          <span>This Month</span>
          <span className="font-semibold text-slate-700">
            {Math.round(dashboardStats.budgetUsagePercent)}%
          </span>
        </div>
        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              dashboardStats.isOverBudget
                ? 'bg-rose-500'
                : dashboardStats.isNearBudget
                ? 'bg-amber-500'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(dashboardStats.budgetUsagePercent, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-bold text-slate-800">
            {formatCurrency(dashboardStats.thisMonthTotal, { compact: true })}
          </span>
          <span className="text-slate-400">
            of {formatCurrency(dashboardStats.budgetAmount, { compact: true })}
          </span>
        </div>
      </div>

      {/* Footer Info & Demo reset */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 px-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local Storage</span>
        </div>
        <button
          onClick={handleReset}
          title="Reset to sample data"
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </aside>
  );
};
