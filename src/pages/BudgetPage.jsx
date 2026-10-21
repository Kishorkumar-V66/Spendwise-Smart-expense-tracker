import React, { useState } from 'react';
import {
  Wallet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  PiggyBank,
  IndianRupee,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { BudgetProgress } from '../components/budget/BudgetProgress';
import { BudgetModal } from '../components/budget/BudgetModal';
import { CategoryBadge } from '../components/expenses/CategoryBadge';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const BudgetPage = () => {
  const { budget, dashboardStats, categoryBreakdown, updateBudget } = useExpenses();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickInput, setQuickInput] = useState(budget.amount || 35000);

  const handleSaveBudget = (newAmount) => {
    updateBudget(newAmount);
    setQuickInput(newAmount);
    addToast(`Monthly budget updated to ${formatCurrency(newAmount)}`, 'success');
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(quickInput);
    if (isNaN(val) || val <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    handleSaveBudget(val);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Monthly Budget Management
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Set spending boundaries, track consumption pace, and avoid overspending
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
        >
          <Wallet className="w-4 h-4 stroke-[2.5]" />
          <span>Update Budget Limit</span>
        </button>
      </div>

      {/* Main Visual Progress Card */}
      <BudgetProgress
        budgetAmount={dashboardStats.budgetAmount}
        spentAmount={dashboardStats.thisMonthTotal}
        remainingAmount={dashboardStats.remainingBudget}
        usagePercent={dashboardStats.budgetUsagePercent}
        onEditBudget={() => setIsModalOpen(true)}
      />

      {/* Quick Budget Configuration Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Quick Budget Adjustment</h3>
        <p className="text-xs text-slate-500 mb-4">
          Directly alter your monthly spending target. Changes persist in localStorage immediately.
        </p>

        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="number"
              min="500"
              step="500"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            Apply Budget
          </button>
        </form>
      </div>

      {/* Category Breakdown vs Total Spend this Month */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Category Consumption</h3>
            <p className="text-xs text-slate-500">How your spending is distributed across categories</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Spend: <strong className="text-slate-900">{formatCurrency(dashboardStats.totalAllTime)}</strong>
          </span>
        </div>

        {categoryBreakdown.categories.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No categories recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {categoryBreakdown.categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col gap-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <CategoryBadge category={cat.id} />
                  <span className="font-bold text-slate-900 text-sm">
                    {formatCurrency(cat.value)}
                  </span>
                </div>
                <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(cat.percentage, 100)}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{cat.count} transactions</span>
                  <span>{cat.percentage}% of all expenses</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentBudget={budget.amount}
        onSave={handleSaveBudget}
      />
    </div>
  );
};
