import { CATEGORIES } from './constants';
import { formatCurrency, formatPercentage } from './formatters';

/**
 * Filter expenses that fall within a given month & year
 */
export const getExpensesForMonth = (expenses, year, month) => {
  const targetYear = parseInt(year, 10);
  const targetMonth = parseInt(month, 10);

  return expenses.filter((item) => {
    if (!item.date) return false;
    const [y, m] = item.date.split('-').map((v) => parseInt(v, 10));
    return y === targetYear && m === targetMonth;
  });
};

/**
 * Filter expenses for today's date
 */
export const getExpensesForToday = (expenses) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  return expenses.filter((item) => item.date === todayStr);
};

/**
 * Calculate primary summary statistics for dashboard and budget
 */
export const calculateDashboardStats = (expenses = [], budgetObj = {}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // Total all-time expenses
  const totalAllTime = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // This month's expenses
  const thisMonthExpenses = getExpensesForMonth(expenses, currentYear, currentMonth);
  const thisMonthTotal = thisMonthExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Today's expenses
  const todayExpenses = getExpensesForToday(expenses);
  const todayTotal = todayExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Budget
  const budgetAmount = Number(budgetObj.amount) || 0;
  const remainingBudget = budgetAmount - thisMonthTotal;
  const budgetUsagePercent = budgetAmount > 0 ? (thisMonthTotal / budgetAmount) * 100 : 0;

  // Previous month expenses for comparison
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const prevMonthExpenses = getExpensesForMonth(expenses, prevYear, prevMonth);
  const prevMonthTotal = prevMonthExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return {
    totalAllTime,
    thisMonthTotal,
    thisMonthCount: thisMonthExpenses.length,
    todayTotal,
    todayCount: todayExpenses.length,
    budgetAmount,
    remainingBudget,
    budgetUsagePercent: Math.min(Math.max(budgetUsagePercent, 0), 999),
    isOverBudget: remainingBudget < 0,
    isNearBudget: budgetUsagePercent >= 80 && budgetUsagePercent <= 100,
    prevMonthTotal,
    totalCount: expenses.length,
  };
};

/**
 * Group expenses by category with dynamic amounts, counts, and colors
 */
export const calculateCategoryBreakdown = (expenses = []) => {
  const categoryMap = {};

  // Initialize with zero for all known categories
  CATEGORIES.forEach((cat) => {
    categoryMap[cat.id] = {
      id: cat.id,
      name: cat.label,
      shortName: cat.id,
      color: cat.color,
      bgLight: cat.bgLight,
      icon: cat.icon,
      value: 0,
      count: 0,
    };
  });

  let totalAmount = 0;
  expenses.forEach((item) => {
    const amt = Number(item.amount) || 0;
    const cat = item.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        id: cat,
        name: cat,
        shortName: cat,
        color: '#64748B',
        value: 0,
        count: 0,
      };
    }
    categoryMap[cat].value += amt;
    categoryMap[cat].count += 1;
    totalAmount += amt;
  });

  // Convert to array and filter out categories with 0 spend unless needed
  const list = Object.values(categoryMap)
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((item) => ({
      ...item,
      percentage: totalAmount > 0 ? Math.round((item.value / totalAmount) * 100) : 0,
    }));

  return {
    categories: list,
    totalAmount,
  };
};

/**
 * Calculate monthly spending for Bar Chart
 */
export const calculateMonthlySpending = (expenses = [], monthsCount = 6) => {
  const result = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yr = d.getFullYear();
    const mo = d.getMonth() + 1;
    const monthKey = `${yr}-${String(mo).padStart(2, '0')}`;
    const monthName = d.toLocaleDateString('en-IN', { month: 'short' });
    const fullLabel = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

    const monthExpenses = getExpensesForMonth(expenses, yr, mo);
    const total = monthExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    result.push({
      key: monthKey,
      month: monthName,
      fullLabel,
      amount: total,
      count: monthExpenses.length,
    });
  }

  return result;
};

/**
 * Calculate spending trend over time (daily data)
 */
export const calculateSpendingTrend = (expenses = [], days = 30) => {
  const now = new Date();
  const dayMap = {};

  // Prepopulate last `days` days
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${day}`;
    const displayLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    dayMap[dateStr] = {
      date: dateStr,
      label: displayLabel,
      amount: 0,
      count: 0,
    };
  }

  // Populate actual expenses
  expenses.forEach((item) => {
    if (dayMap[item.date]) {
      dayMap[item.date].amount += Number(item.amount) || 0;
      dayMap[item.date].count += 1;
    }
  });

  // Calculate cumulative trend
  let runningTotal = 0;
  return Object.values(dayMap).map((entry) => {
    runningTotal += entry.amount;
    return {
      ...entry,
      cumulative: runningTotal,
    };
  });
};

/**
 * Calculate key analytics metrics:
 * - Highest spending category
 * - Highest single expense
 * - Average daily spending
 * - Total number of transactions
 */
export const calculateAnalyticsMetrics = (expenses = []) => {
  if (!expenses || expenses.length === 0) {
    return {
      highestCategory: null,
      highestExpense: null,
      averageDailySpend: 0,
      totalTransactions: 0,
    };
  }

  // Highest single expense
  const highestExpense = [...expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];

  // Category breakdown
  const { categories } = calculateCategoryBreakdown(expenses);
  const highestCategory = categories.length > 0 ? categories[0] : null;

  // Average daily spending (over the distinct active days or calendar range)
  const totalSpend = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const uniqueDates = new Set(expenses.map((e) => e.date).filter(Boolean));
  const distinctDays = Math.max(uniqueDates.size, 1);
  const averageDailySpend = Math.round(totalSpend / distinctDays);

  return {
    highestCategory,
    highestExpense,
    averageDailySpend,
    totalTransactions: expenses.length,
    totalSpend,
  };
};

/**
 * Generate dynamic, rule-based Smart Insights strictly from actual expense & budget data
 */
export const generateSmartInsights = (expenses = [], budgetObj = {}) => {
  const insights = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const thisMonthExpenses = getExpensesForMonth(expenses, currentYear, currentMonth);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const prevMonthExpenses = getExpensesForMonth(expenses, prevYear, prevMonth);
  const prevMonthTotal = prevMonthExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const budgetAmount = Number(budgetObj.amount) || 0;
  const usagePercent = budgetAmount > 0 ? (thisMonthTotal / budgetAmount) * 100 : 0;

  // Insight 1: Budget Status & Alerts
  if (budgetAmount > 0) {
    if (thisMonthTotal > budgetAmount) {
      const overAmount = thisMonthTotal - budgetAmount;
      insights.push({
        id: 'budget-exceeded',
        type: 'danger',
        title: 'Budget Exceeded',
        message: `You have exceeded your monthly budget by ${formatCurrency(overAmount)}. Total spent is ${formatCurrency(thisMonthTotal)} of ${formatCurrency(budgetAmount)}.`,
        tag: 'Critical Alert',
      });
    } else if (usagePercent >= 80) {
      insights.push({
        id: 'budget-warning',
        type: 'warning',
        title: 'High Budget Usage',
        message: `You have used ${Math.round(usagePercent)}% of your monthly budget. Only ${formatCurrency(budgetAmount - thisMonthTotal)} remaining for this month.`,
        tag: 'Warning',
      });
    } else {
      insights.push({
        id: 'budget-healthy',
        type: 'success',
        title: 'Healthy Budget',
        message: `You are currently within your monthly budget at ${Math.round(usagePercent)}% utilization (${formatCurrency(thisMonthTotal)} of ${formatCurrency(budgetAmount)}).`,
        tag: 'On Track',
      });
    }
  }

  // Insight 2: Highest Spending Category this month
  const thisMonthCat = calculateCategoryBreakdown(thisMonthExpenses);
  if (thisMonthCat.categories.length > 0) {
    const topCat = thisMonthCat.categories[0];
    insights.push({
      id: 'top-category',
      type: 'info',
      title: 'Top Spending Category',
      message: `${topCat.name} is your highest spending category this month at ${formatCurrency(topCat.value)} (${topCat.percentage}% of monthly spend).`,
      tag: 'Category Insight',
    });
  }

  // Insight 3: Month-over-Month comparison
  if (prevMonthTotal > 0 && thisMonthTotal > 0) {
    const diff = thisMonthTotal - prevMonthTotal;
    const changePercent = Math.abs(Math.round((diff / prevMonthTotal) * 100));

    if (diff > 0) {
      insights.push({
        id: 'mom-increase',
        type: 'warning',
        title: 'Monthly Spending Trend',
        message: `Your spending increased by ${changePercent}% compared with last month (${formatCurrency(thisMonthTotal)} vs ${formatCurrency(prevMonthTotal)}).`,
        tag: 'Spend Velocity',
      });
    } else if (diff < 0) {
      insights.push({
        id: 'mom-decrease',
        type: 'success',
        title: 'Spending Saved',
        message: `Great job! Your spending is ${changePercent}% lower than last month (${formatCurrency(thisMonthTotal)} vs ${formatCurrency(prevMonthTotal)}).`,
        tag: 'Savings',
      });
    }
  }

  // Insight 4: Category Specific MoM Comparison (e.g. Shopping or Food)
  const prevCatBreakdown = calculateCategoryBreakdown(prevMonthExpenses);
  const thisFood = thisMonthCat.categories.find((c) => c.id === 'Food')?.value || 0;
  const prevFood = prevCatBreakdown.categories.find((c) => c.id === 'Food')?.value || 0;
  const thisShopping = thisMonthCat.categories.find((c) => c.id === 'Shopping')?.value || 0;
  const prevShopping = prevCatBreakdown.categories.find((c) => c.id === 'Shopping')?.value || 0;

  if (thisShopping > 0 && prevShopping > 0 && thisShopping > prevShopping) {
    insights.push({
      id: 'shopping-rise',
      type: 'info',
      title: 'Shopping Trend',
      message: `Shopping expenses (${formatCurrency(thisShopping)}) are higher than last month (${formatCurrency(prevShopping)}).`,
      tag: 'Shopping',
    });
  } else if (thisFood > 0 && prevFood > 0 && thisFood < prevFood) {
    insights.push({
      id: 'food-savings',
      type: 'success',
      title: 'Dining Optimization',
      message: `You spent less on Food this month (${formatCurrency(thisFood)}) compared to last month (${formatCurrency(prevFood)}).`,
      tag: 'Food & Dining',
    });
  }

  // Insight 5: Daily Average Spending
  const daysInCurrentMonthPassed = Math.max(now.getDate(), 1);
  if (thisMonthTotal > 0) {
    const avgDaily = Math.round(thisMonthTotal / daysInCurrentMonthPassed);
    insights.push({
      id: 'daily-average',
      type: 'neutral',
      title: 'Daily Spending Velocity',
      message: `Your average daily spending is ${formatCurrency(avgDaily)} across the past ${daysInCurrentMonthPassed} days of this month.`,
      tag: 'Daily Pace',
    });
  }

  // Insight 6: Highest Single Expense
  if (expenses.length > 0) {
    const sorted = [...expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    const highest = sorted[0];
    if (highest) {
      insights.push({
        id: 'highest-single',
        type: 'info',
        title: 'Largest Single Expense',
        message: `Your largest single recorded expense is "${highest.description}" at ${formatCurrency(highest.amount)} in ${highest.category}.`,
        tag: 'Peak Expense',
      });
    }
  }

  return insights;
};
