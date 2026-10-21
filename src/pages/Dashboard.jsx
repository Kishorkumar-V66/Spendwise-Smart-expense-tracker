import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CalendarDays,
  Clock,
  PiggyBank,
  TrendingDown,
  ArrowRight,
  Plus,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Receipt,
  Layers,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { CategoryChart } from '../components/charts/CategoryChart';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { SmartInsights } from '../components/insights/SmartInsights';
import { CategoryBadge } from '../components/expenses/CategoryBadge';
import { BudgetModal } from '../components/budget/BudgetModal';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Dashboard = () => {
  const {
    expenses,
    budget,
    dashboardStats,
    categoryBreakdown,
    monthlySpending,
    smartInsights,
    updateBudget,
  } = useExpenses();

  const { addToast } = useToast();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const handleSaveBudget = (amount) => {
    updateBudget(amount);
    addToast(`Monthly budget set to ${formatCurrency(amount)}`, 'success');
  };

  // Recent 5 transactions
  const recentTransactions = expenses.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner / Overview Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Financial Tracking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SpendWise Dashboard
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              Track daily expenses, control monthly budget limits, and receive automated financial insights in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold transition-all border border-white/20"
            >
              Adjust Budget
            </button>
            <Link
              to="/add-expense"
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Expense
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Expenses */}
        <StatCard
          title="Total Expenses"
          value={formatCurrency(dashboardStats.totalAllTime)}
          subtitle={`${dashboardStats.totalCount} total entries`}
          iconName="Receipt"
          color="indigo"
        />

        {/* 2. This Month's Expenses */}
        <StatCard
          title="This Month"
          value={formatCurrency(dashboardStats.thisMonthTotal)}
          subtitle={`${dashboardStats.thisMonthCount} entries this month`}
          iconName="CalendarDays"
          color="blue"
        />

        {/* 3. Today's Expenses */}
        <StatCard
          title="Today's Spend"
          value={formatCurrency(dashboardStats.todayTotal)}
          subtitle={`${dashboardStats.todayCount} entries today`}
          iconName="Clock"
          color="amber"
        />

        {/* 4. Monthly Budget */}
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(dashboardStats.budgetAmount)}
          subtitle="Configured limit"
          iconName="Wallet"
          color="emerald"
        />

        {/* 5. Remaining Budget */}
        <StatCard
          title={dashboardStats.isOverBudget ? 'Budget Deficit' : 'Remaining Budget'}
          value={
            dashboardStats.isOverBudget
              ? `-${formatCurrency(Math.abs(dashboardStats.remainingBudget))}`
              : formatCurrency(dashboardStats.remainingBudget)
          }
          subtitle={dashboardStats.isOverBudget ? 'Limit exceeded!' : 'Available to spend'}
          iconName="PiggyBank"
          color={dashboardStats.isOverBudget ? 'rose' : 'emerald'}
          trend={dashboardStats.isOverBudget ? 'Over Budget' : 'Safe'}
          trendType={dashboardStats.isOverBudget ? 'negative' : 'positive'}
        />

        {/* 6. Budget Usage % */}
        <StatCard
          title="Budget Usage"
          value={`${Math.round(dashboardStats.budgetUsagePercent)}%`}
          progress={dashboardStats.budgetUsagePercent}
          iconName="TrendingDown"
          color={dashboardStats.isOverBudget ? 'rose' : dashboardStats.isNearBudget ? 'amber' : 'indigo'}
        />
      </div>

      {/* Charts Section: Category Breakdown & Monthly Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Spending by Category</h3>
                <p className="text-xs text-slate-500">Distribution of all recorded expenses</p>
              </div>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CategoryChart
            categories={categoryBreakdown.categories}
            totalAmount={categoryBreakdown.totalAmount}
          />
        </div>

        {/* Monthly Spending Trend Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Monthly Spending Trend</h3>
                <p className="text-xs text-slate-500">History across the last 6 months</p>
              </div>
            </div>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <MonthlyChart data={monthlySpending} />
        </div>
      </div>

      {/* Lower Section: Recent Transactions & Smart Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions (2 cols on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
                  <p className="text-xs text-slate-500">Your latest expense entries</p>
                </div>
              </div>
              <Link
                to="/expenses"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All ({expenses.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No recent transactions found. Click "Add Expense" to start!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>{formatDate(tx.date)}</span>
                          <span>•</span>
                          <span>{tx.paymentMethod || 'UPI'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <CategoryBadge category={tx.category} size="xs" />
                      <span className="font-bold text-sm text-slate-900 text-right min-w-[70px]">
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 5 recent expenses</span>
            <Link to="/expenses" className="text-indigo-600 hover:underline font-semibold">
              Manage all expenses →
            </Link>
          </div>
        </div>

        {/* Smart Spending Insights (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Smart Insights</h3>
                  <p className="text-xs text-slate-500">Rule-based financial alerts</p>
                </div>
              </div>
              <Link
                to="/analytics"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                All Insights <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <SmartInsights insights={smartInsights} limit={3} />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/analytics"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              Explore deep analytics & trends <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Budget Adjust Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentBudget={budget.amount}
        onSave={handleSaveBudget}
      />
    </div>
  );
};
