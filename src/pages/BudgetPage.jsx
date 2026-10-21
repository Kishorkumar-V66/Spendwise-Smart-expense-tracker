import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Calendar,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  IndianRupee,
  History,
  Sparkles,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Tag,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { BudgetProgress } from '../components/budget/BudgetProgress';
import { BudgetModal } from '../components/budget/BudgetModal';
import { CategoryBadge } from '../components/expenses/CategoryBadge';
import { SmartInsights } from '../components/insights/SmartInsights';
import {
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  getMonthlyExpenses,
  getYearlyExpenses,
  getMonthlyTotal,
  getYearlyTotal,
  getCategoryTotals,
  getMonthlyTrendForYear,
  getHistoricalSpending,
  getYearOverYearComparison,
  getMonthToMonthComparison,
  getLongTermSpendingInsights,
  getPreviousMonth,
} from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-semibold text-slate-300">{data.fullLabel || label}</p>
        <p className="font-bold text-base text-indigo-400 mt-0.5">
          {formatCurrency(data.amount)}
        </p>
        <p className="text-slate-400 text-[11px] mt-0.5">
          {data.count} transaction{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export const BudgetPage = () => {
  const {
    expenses,
    budget,
    availableYears,
    updateBudget,
    updateYearlyBudget,
    getMonthlyBudget,
    getYearlyBudget,
  } = useExpenses();

  const { addToast } = useToast();

  const now = new Date();
  const currentCalendarYear = now.getFullYear();
  const currentCalendarMonth = now.getMonth() + 1; // 1-indexed

  // Navigation: Period View ('monthly' | 'yearly' | 'history')
  const [period, setPeriod] = useState('monthly');

  // Selected Year & Month state
  const [selectedYear, setSelectedYear] = useState(currentCalendarYear);
  const [selectedMonth, setSelectedMonth] = useState(currentCalendarMonth);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick inputs
  const currentMonthBudgetVal = getMonthlyBudget(selectedYear, selectedMonth);
  const currentYearBudgetVal = getYearlyBudget(selectedYear);
  const [quickMonthlyInput, setQuickMonthlyInput] = useState(currentMonthBudgetVal);
  const [quickYearlyInput, setQuickYearlyInput] = useState(currentYearBudgetVal);

  // Sync quick inputs when period/selected date changes
  React.useEffect(() => {
    setQuickMonthlyInput(getMonthlyBudget(selectedYear, selectedMonth));
    setQuickYearlyInput(getYearlyBudget(selectedYear));
  }, [selectedYear, selectedMonth, budget, getMonthlyBudget, getYearlyBudget]);

  // MONTHLY VIEW CALCULATIONS
  const monthlyExpenses = useMemo(() => {
    return getMonthlyExpenses(expenses, selectedYear, selectedMonth);
  }, [expenses, selectedYear, selectedMonth]);

  const monthlyTotal = useMemo(() => {
    return getMonthlyTotal(expenses, selectedYear, selectedMonth);
  }, [expenses, selectedYear, selectedMonth]);

  const monthlyBudgetAmount = getMonthlyBudget(selectedYear, selectedMonth);
  const monthlyRemaining = monthlyBudgetAmount - monthlyTotal;
  const monthlyUsagePercent = monthlyBudgetAmount > 0 ? (monthlyTotal / monthlyBudgetAmount) * 100 : 0;

  const monthlyCategoryBreakdown = useMemo(() => {
    return getCategoryTotals(monthlyExpenses);
  }, [monthlyExpenses]);

  const momComparison = useMemo(() => {
    return getMonthToMonthComparison(expenses, selectedYear, selectedMonth);
  }, [expenses, selectedYear, selectedMonth]);

  // YEARLY VIEW CALCULATIONS
  const yearlyExpenses = useMemo(() => {
    return getYearlyExpenses(expenses, selectedYear);
  }, [expenses, selectedYear]);

  const yearlyTotal = useMemo(() => {
    return getYearlyTotal(expenses, selectedYear);
  }, [expenses, selectedYear]);

  const yearlyBudgetAmount = getYearlyBudget(selectedYear);
  const yearlyRemaining = yearlyBudgetAmount - yearlyTotal;
  const yearlyUsagePercent = yearlyBudgetAmount > 0 ? (yearlyTotal / yearlyBudgetAmount) * 100 : 0;

  const activeMonthsInYear = useMemo(() => {
    const set = new Set(yearlyExpenses.map((i) => i.date && i.date.split('-')[1]).filter(Boolean));
    return Math.max(set.size, 1);
  }, [yearlyExpenses]);

  const avgMonthlySpendInYear = Math.round(yearlyTotal / activeMonthsInYear);

  const yearlyMonthlyTrend = useMemo(() => {
    return getMonthlyTrendForYear(expenses, selectedYear);
  }, [expenses, selectedYear]);

  const yoyComparison = useMemo(() => {
    return getYearOverYearComparison(expenses, selectedYear);
  }, [expenses, selectedYear]);

  const yearlyCategoryBreakdown = useMemo(() => {
    return getCategoryTotals(yearlyExpenses);
  }, [yearlyExpenses]);

  // HISTORICAL VIEW CALCULATIONS
  const historicalSpending = useMemo(() => {
    return getHistoricalSpending(expenses);
  }, [expenses]);

  const historicalChartData = useMemo(() => {
    return [...historicalSpending]
      .reverse()
      .map((h) => ({
        year: String(h.year),
        amount: h.totalSpent,
        fullLabel: `Year ${h.year}`,
        count: h.transactionCount,
      }));
  }, [historicalSpending]);

  // LONG-TERM INSIGHTS
  const longTermInsights = useMemo(() => {
    return getLongTermSpendingInsights(expenses, budget, selectedYear);
  }, [expenses, budget, selectedYear]);

  // Handlers
  const handleSaveMonthlyBudget = (newAmount) => {
    updateBudget(newAmount, selectedMonth, selectedYear);
    setQuickMonthlyInput(newAmount);
    addToast(
      `Monthly budget for ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} set to ${formatCurrency(newAmount)}`,
      'success'
    );
  };

  const handleSaveYearlyBudget = (newAmount) => {
    updateYearlyBudget(newAmount, selectedYear);
    setQuickYearlyInput(newAmount);
    addToast(`Yearly budget for ${selectedYear} set to ${formatCurrency(newAmount)}`, 'success');
  };

  const handleQuickMonthlySubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(quickMonthlyInput);
    if (isNaN(val) || val <= 0) {
      addToast('Please enter a valid monthly amount', 'error');
      return;
    }
    handleSaveMonthlyBudget(val);
  };

  const handleQuickYearlySubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(quickYearlyInput);
    if (isNaN(val) || val <= 0) {
      addToast('Please enter a valid yearly amount', 'error');
      return;
    }
    handleSaveYearlyBudget(val);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Budget & Spending History
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track monthly boundaries, analyze annual spending limits, and review multi-year history
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all self-start sm:self-auto"
        >
          <Wallet className="w-4 h-4 stroke-[2.5]" />
          <span>
            {period === 'yearly' ? 'Update Yearly Budget' : 'Update Budget Limit'}
          </span>
        </button>
      </div>

      {/* 1. Time Period Navigation: [ Monthly ] [ Yearly ] [ History ] */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              period === 'monthly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              period === 'yearly'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            Yearly
          </button>
          <button
            onClick={() => setPeriod('history')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              period === 'history'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            History
          </button>
        </div>

        {/* Date Selectors (Year & Month for Monthly, Year only for Yearly) */}
        {period !== 'history' && (
          <div className="flex items-center gap-2 flex-wrap">
            {period === 'monthly' && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Month:</span>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                    className="pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  >
                    {MONTH_NAMES.map((name, idx) => (
                      <option key={name} value={idx + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Year:</span>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="pl-3 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {(selectedYear !== currentCalendarYear || (period === 'monthly' && selectedMonth !== currentCalendarMonth)) && (
              <button
                onClick={() => {
                  setSelectedYear(currentCalendarYear);
                  setSelectedMonth(currentCalendarMonth);
                }}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Reset to Current
              </button>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. MONTHLY VIEW                                          */}
      {/* ======================================================== */}
      {period === 'monthly' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Visual Progress Card for Selected Month */}
          <BudgetProgress
            title={`${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} Budget Progress`}
            subtitle={`Real-time tracking of ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear} spending against your target`}
            budgetAmount={monthlyBudgetAmount}
            spentAmount={monthlyTotal}
            remainingAmount={monthlyRemaining}
            usagePercent={monthlyUsagePercent}
            onEditBudget={() => setIsModalOpen(true)}
          />

          {/* KPI Snapshot Cards for Selected Month */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Total Budget</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {formatCurrency(monthlyBudgetAmount)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Total Spent</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{formatCurrency(monthlyTotal)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                {monthlyRemaining < 0 ? 'Budget Deficit' : 'Remaining'}
              </p>
              <p
                className={`text-lg font-bold mt-1 ${
                  monthlyRemaining < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {monthlyRemaining < 0
                  ? `-${formatCurrency(Math.abs(monthlyRemaining))}`
                  : formatCurrency(monthlyRemaining)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Transactions</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{monthlyExpenses.length}</p>
            </div>
          </div>

          {/* 6. Month-to-Month Comparison Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Month-to-Month Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  {momComparison.currentMonthName} {momComparison.currentYear} vs{' '}
                  {momComparison.previousMonthName} {momComparison.previousYear}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  momComparison.change.direction === 'decrease'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : momComparison.change.direction === 'increase'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {momComparison.change.direction === 'decrease' ? 'Spending Reduced' : momComparison.change.direction === 'increase' ? 'Spending Increased' : 'Consistent'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  {momComparison.currentMonthName} {momComparison.currentYear}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(momComparison.currentTotal)}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  {momComparison.previousMonthName} {momComparison.previousYear}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(momComparison.previousTotal)}
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  momComparison.change.direction === 'decrease'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : momComparison.change.direction === 'increase'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <p className="text-xs font-medium opacity-80">Difference</p>
                <p className="text-xl font-bold mt-1 flex items-center gap-1">
                  {momComparison.change.direction === 'decrease' && (
                    <ArrowDownRight className="w-5 h-5 text-emerald-600" />
                  )}
                  {momComparison.change.direction === 'increase' && (
                    <ArrowUpRight className="w-5 h-5 text-rose-600" />
                  )}
                  <span>
                    {momComparison.change.hasPrevious
                      ? `${momComparison.change.percent}%`
                      : 'N/A'}
                  </span>
                </p>
                <p className="text-xs font-medium mt-0.5 opacity-90">
                  {momComparison.diffLabel}
                </p>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>{momComparison.insight}</span>
            </div>
          </div>

          {/* Quick Monthly Budget Adjustment Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Quick Budget Adjustment ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Directly alter spending target for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}. Changes persist in localStorage immediately.
            </p>

            <form onSubmit={handleQuickMonthlySubmit} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={quickMonthlyInput}
                  onChange={(e) => setQuickMonthlyInput(e.target.value)}
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

          {/* Category Consumption for Selected Month */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Category Consumption</h3>
                <p className="text-xs text-slate-500">
                  Spending breakdown for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Total Month Spend: <strong className="text-slate-900">{formatCurrency(monthlyTotal)}</strong>
              </span>
            </div>

            {monthlyCategoryBreakdown.categories.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No expense entries recorded for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {monthlyCategoryBreakdown.categories.map((cat) => (
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
                      <span>{cat.count} transaction{cat.count !== 1 ? 's' : ''}</span>
                      <span>{cat.percentage}% of month expenses</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. YEARLY VIEW                                           */}
      {/* ======================================================== */}
      {period === 'yearly' && (
        <div className="space-y-6 animate-fade-in">
          {/* Yearly Progress Card */}
          <BudgetProgress
            title={`Yearly Budget Progress (${selectedYear})`}
            subtitle={`Annual spending allocation and consumption tracking for ${selectedYear}`}
            budgetAmount={yearlyBudgetAmount}
            spentAmount={yearlyTotal}
            remainingAmount={yearlyRemaining}
            usagePercent={yearlyUsagePercent}
            onEditBudget={() => setIsModalOpen(true)}
          />

          {/* 5 Yearly KPI Cards matching User Specification */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Yearly Budget</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {formatCurrency(yearlyBudgetAmount)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Total Spent</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {formatCurrency(yearlyTotal)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Remaining</p>
              <p
                className={`text-lg font-bold mt-1 ${
                  yearlyRemaining < 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {yearlyRemaining < 0
                  ? `-${formatCurrency(Math.abs(yearlyRemaining))}`
                  : formatCurrency(yearlyRemaining)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Average / Month</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {formatCurrency(avgMonthlySpendInYear)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs col-span-2 sm:col-span-1">
              <p className="text-[11px] font-semibold uppercase text-slate-400">Budget Used</p>
              <p
                className={`text-lg font-bold mt-1 ${
                  yearlyUsagePercent > 100
                    ? 'text-rose-600'
                    : yearlyUsagePercent >= 80
                    ? 'text-amber-600'
                    : 'text-indigo-600'
                }`}
              >
                {Math.round(yearlyUsagePercent)}%
              </p>
            </div>
          </div>

          {/* 12-Month Spending Chart for Selected Year */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedYear} Monthly Spending Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Expenditure across each month of {selectedYear}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                12 Months
              </span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={yearlyMonthlyTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => formatCurrency(value, { compact: true })}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
                  <Bar
                    dataKey="amount"
                    fill="#4F46E5"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Set Yearly Budget & 5. Year-over-Year Comparison Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Yearly Budget Setter */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Yearly Budget Configuration ({selectedYear})
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Set the annual spending boundary for {selectedYear}. Stored in localStorage separately from monthly budgets.
                </p>

                <form onSubmit={handleQuickYearlySubmit} className="space-y-3">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <IndianRupee className="w-5 h-5 text-slate-500" />
                    </div>
                    <input
                      type="number"
                      min="5000"
                      step="5000"
                      value={quickYearlyInput}
                      onChange={(e) => setQuickYearlyInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                  >
                    Save Yearly Budget
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Monthly Equivalent:</span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(Math.round(yearlyBudgetAmount / 12))} / month
                </span>
              </div>
            </div>

            {/* 5. Year-over-Year Comparison */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Year-over-Year Comparison
                    </h3>
                    <p className="text-xs text-slate-500">
                      {yoyComparison.currentYear} vs {yoyComparison.previousYear}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      yoyComparison.change.direction === 'decrease'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : yoyComparison.change.direction === 'increase'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {yoyComparison.change.direction === 'decrease' ? 'Saved vs Last Year' : yoyComparison.change.direction === 'increase' ? 'Spend Increased' : 'Consistent'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-medium text-slate-500">{yoyComparison.currentYear} Total</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {formatCurrency(yoyComparison.currentTotal)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-medium text-slate-500">{yoyComparison.previousYear} Total</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {formatCurrency(yoyComparison.previousTotal)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900 text-xs font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>{yoyComparison.insight}</span>
              </div>
            </div>
          </div>

          {/* 8. Category Analysis by Year */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedYear} Category Spending Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Cumulative distribution across all categories for {selectedYear}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Annual Total: <strong className="text-slate-900">{formatCurrency(yearlyTotal)}</strong>
              </span>
            </div>

            {yearlyCategoryBreakdown.categories.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No recorded expenses for {selectedYear}.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {yearlyCategoryBreakdown.categories.map((cat) => (
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
                      <span>{cat.count} transaction{cat.count !== 1 ? 's' : ''}</span>
                      <span>{cat.percentage}% of annual spend</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. HISTORICAL VIEW                                       */}
      {/* ======================================================== */}
      {period === 'history' && (
        <div className="space-y-6 animate-fade-in">
          {/* Multi-Year Comparison Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Annual Spending Comparison Across Years
                  </h3>
                  <p className="text-xs text-slate-500">
                    Multi-year historical totals derived directly from your expense records
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                {historicalChartData.length} Years Tracked
              </span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={historicalChartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => formatCurrency(value, { compact: true })}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
                  <Bar
                    dataKey="amount"
                    fill="#4F46E5"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={55}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Spending History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Spending History</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Breakdown by calendar year (only years with recorded expenses are displayed)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Year</th>
                    <th className="py-3.5 px-4">Total Spent</th>
                    <th className="py-3.5 px-4">Avg / Month</th>
                    <th className="py-3.5 px-4">Transactions</th>
                    <th className="py-3.5 px-6">Top Spending Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {historicalSpending.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        {row.year}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-indigo-700">
                        {formatCurrency(row.totalSpent)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {formatCurrency(row.avgMonthly)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {row.transactionCount} entries
                      </td>
                      <td className="py-3.5 px-6">
                        {row.topCategory ? (
                          <div className="flex items-center gap-2">
                            <CategoryBadge category={row.topCategory.id} size="xs" />
                            <span className="text-xs text-slate-500 font-medium">
                              ({formatCurrency(row.topCategory.value)})
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. LONG-TERM SPENDING INSIGHTS (Universal at bottom)    */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending Insights</h3>
            <p className="text-xs text-slate-500">
              Evaluated strictly from your actual localStorage expenses & budget thresholds
            </p>
          </div>
        </div>

        <SmartInsights insights={longTermInsights} />
      </div>

      {/* Budget Modal (adapts between monthly and yearly) */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={period === 'yearly' ? 'yearly' : 'monthly'}
        periodLabel={
          period === 'yearly'
            ? `Year ${selectedYear}`
            : `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`
        }
        currentBudget={
          period === 'yearly'
            ? yearlyBudgetAmount
            : monthlyBudgetAmount
        }
        onSave={(newAmount) => {
          if (period === 'yearly') {
            handleSaveYearlyBudget(newAmount);
          } else {
            handleSaveMonthlyBudget(newAmount);
          }
        }}
      />
    </div>
  );
};
