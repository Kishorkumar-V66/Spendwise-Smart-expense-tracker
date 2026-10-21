import React from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Calendar,
  Hash,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { CategoryChart } from '../components/charts/CategoryChart';
import { MonthlyChart } from '../components/charts/MonthlyChart';
import { SpendingTrendChart } from '../components/charts/SpendingTrendChart';
import { SmartInsights } from '../components/insights/SmartInsights';
import { StatCard } from '../components/common/StatCard';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Analytics = () => {
  const {
    categoryBreakdown,
    monthlySpending,
    spendingTrend,
    analyticsMetrics,
    smartInsights,
    expenses,
  } = useExpenses();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Analytics Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Financial Analytics & Trends
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Deep dive into your spending patterns, categorical distribution, and time-series behavior
          </p>
        </div>
      </div>

      {/* 4 Required Analytical KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Highest Spending Category */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Top Spending Category
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {analyticsMetrics.highestCategory ? analyticsMetrics.highestCategory.name : 'N/A'}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>
              {analyticsMetrics.highestCategory
                ? formatCurrency(analyticsMetrics.highestCategory.value)
                : '₹0'}
            </span>
            <span className="font-semibold text-slate-700">
              {analyticsMetrics.highestCategory ? `${analyticsMetrics.highestCategory.percentage}% of total` : ''}
            </span>
          </div>
        </div>

        {/* 2. Highest Single Expense */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Highest Single Expense
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {analyticsMetrics.highestExpense
                  ? formatCurrency(analyticsMetrics.highestExpense.amount)
                  : '₹0'}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 truncate">
            {analyticsMetrics.highestExpense
              ? `${analyticsMetrics.highestExpense.description} (${formatDate(analyticsMetrics.highestExpense.date)})`
              : 'No entries'}
          </div>
        </div>

        {/* 3. Average Daily Spending */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg Daily Spend
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(analyticsMetrics.averageDailySpend)}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
            Across active transaction days
          </div>
        </div>

        {/* 4. Total Number of Transactions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Transactions
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {analyticsMetrics.totalTransactions}
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Hash className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
            All logged expense entries
          </div>
        </div>
      </div>

      {/* Main Charts: 1. Category Chart (Donut) & 2. Monthly Chart (Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Category Breakdown</h3>
              <p className="text-xs text-slate-500">
                Dynamic expenditure share by category
              </p>
            </div>
          </div>

          <CategoryChart
            categories={categoryBreakdown.categories}
            totalAmount={categoryBreakdown.totalAmount}
          />
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Spending Comparison</h3>
              <p className="text-xs text-slate-500">
                Month-by-month spending aggregated from localStorage
              </p>
            </div>
          </div>

          <MonthlyChart data={monthlySpending} />
        </div>
      </div>

      {/* 3. Spending Trend Chart (Full width) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending Trend Over Time</h3>
            <p className="text-xs text-slate-500">
              Daily spending trajectory and cumulative velocity (last 30 days)
            </p>
          </div>
        </div>

        <SpendingTrendChart data={spendingTrend} />
      </div>

      {/* Section 6: Full Smart Spending Insights */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Rule-Based Smart Insights</h3>
            <p className="text-xs text-slate-500">
              Evaluated strictly from your actual localStorage expenses & budget thresholds
            </p>
          </div>
        </div>

        <SmartInsights insights={smartInsights} />
      </div>
    </div>
  );
};
