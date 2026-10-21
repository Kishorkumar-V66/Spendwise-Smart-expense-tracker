import { CATEGORIES } from './constants';
import { formatCurrency, formatPercentage } from './formatters';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Filter expenses that fall within a given month & year
 */
export const getExpensesForMonth = (expenses = [], year, month) => {
  const targetYear = parseInt(year, 10);
  const targetMonth = parseInt(month, 10);

  return (expenses || []).filter((item) => {
    if (!item.date) return false;
    const parts = item.date.split('-');
    if (parts.length < 2) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    return y === targetYear && m === targetMonth;
  });
};

export const getMonthlyExpenses = getExpensesForMonth;

/**
 * Filter expenses that fall within a given year
 */
export const getYearlyExpenses = (expenses = [], year) => {
  const targetYear = parseInt(year, 10);
  return (expenses || []).filter((item) => {
    if (!item.date) return false;
    const parts = item.date.split('-');
    if (parts.length < 1) return false;
    return parseInt(parts[0], 10) === targetYear;
  });
};

/**
 * Sum amounts for a given month
 */
export const getMonthlyTotal = (expenses = [], year, month) => {
  const list = getMonthlyExpenses(expenses, year, month);
  return list.reduce((sum, item) => sum + (Math.max(0, Number(item.amount)) || 0), 0);
};

/**
 * Sum amounts for a given year
 */
export const getYearlyTotal = (expenses = [], year) => {
  const list = getYearlyExpenses(expenses, year);
  return list.reduce((sum, item) => sum + (Math.max(0, Number(item.amount)) || 0), 0);
};

/**
 * Filter expenses for today's date
 */
export const getExpensesForToday = (expenses = []) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  return (expenses || []).filter((item) => item.date === todayStr);
};

/**
 * Extract sorted list of unique years present in expenses,
 * always including the current calendar year.
 */
export const getAvailableYears = (expenses = []) => {
  const currentYear = new Date().getFullYear();
  const yearSet = new Set([currentYear]);

  (expenses || []).forEach((item) => {
    if (item.date) {
      const yr = parseInt(item.date.split('-')[0], 10);
      if (!isNaN(yr) && yr > 1900 && yr < 2100) {
        yearSet.add(yr);
      }
    }
  });

  return Array.from(yearSet).sort((a, b) => b - a);
};

/**
 * Get previous month and year tuple
 */
export const getPreviousMonth = (year, month) => {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  if (m === 1) {
    return { year: y - 1, month: 12 };
  }
  return { year: y, month: m - 1 };
};

/**
 * Get previous year
 */
export const getPreviousYear = (year) => {
  return parseInt(year, 10) - 1;
};

/**
 * Safe percentage change calculation avoiding division by zero or NaN
 */
export const calculatePercentageChange = (current = 0, previous = 0) => {
  const curr = Math.max(0, Number(current) || 0);
  const prev = Math.max(0, Number(previous) || 0);

  if (prev === 0 && curr === 0) {
    return { percent: 0, direction: 'same', diff: 0, hasPrevious: false };
  }
  if (prev === 0) {
    return { percent: 100, direction: 'increase', diff: curr, hasPrevious: false };
  }

  const diff = curr - prev;
  const rawPercent = (diff / prev) * 100;
  const roundedPercent = parseFloat(Math.abs(rawPercent).toFixed(2));

  let direction = 'same';
  if (diff > 0.001) direction = 'increase';
  else if (diff < -0.001) direction = 'decrease';

  return {
    percent: roundedPercent,
    direction,
    diff,
    hasPrevious: true,
  };
};

/**
 * Group expenses by category with dynamic amounts, counts, and colors
 */
export const calculateCategoryBreakdown = (expenses = []) => {
  const categoryMap = {};

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
  (expenses || []).forEach((item) => {
    const amt = Math.max(0, Number(item.amount) || 0);
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

export const getCategoryTotals = calculateCategoryBreakdown;

/**
 * Generate 12 months array (Jan to Dec) for a specific year for Recharts Bar/Area charts
 */
export const getMonthlyTrendForYear = (expenses = [], year) => {
  const targetYear = parseInt(year, 10);
  const months = [];

  for (let m = 1; m <= 12; m++) {
    const monthExpenses = getExpensesForMonth(expenses, targetYear, m);
    const total = monthExpenses.reduce((sum, i) => sum + (Math.max(0, Number(i.amount)) || 0), 0);
    months.push({
      monthNumber: m,
      month: MONTH_SHORT_NAMES[m - 1],
      fullLabel: MONTH_NAMES[m - 1],
      amount: total,
      count: monthExpenses.length,
    });
  }

  return months;
};

/**
 * Calculate multi-year historical spending records from expense array
 */
export const getHistoricalSpending = (expenses = []) => {
  const years = getAvailableYears(expenses);

  return years.map((yr) => {
    const yrExpenses = getYearlyExpenses(expenses, yr);
    const totalSpent = yrExpenses.reduce((sum, i) => sum + (Math.max(0, Number(i.amount)) || 0), 0);

    // Active months or 12
    const activeMonths = new Set(
      yrExpenses.map((i) => i.date && i.date.split('-')[1]).filter(Boolean)
    ).size;
    const divisor = Math.max(activeMonths, 1);
    const avgMonthly = Math.round(totalSpent / (activeMonths > 0 ? divisor : 12));

    const { categories } = calculateCategoryBreakdown(yrExpenses);
    const topCategory = categories.length > 0 ? categories[0] : null;

    return {
      year: yr,
      totalSpent,
      avgMonthly,
      transactionCount: yrExpenses.length,
      topCategory,
    };
  });
};

/**
 * Year-over-Year comparison data & insight
 */
export const getYearOverYearComparison = (expenses = [], year) => {
  const currYear = parseInt(year, 10);
  const prevYear = currYear - 1;

  const currentTotal = getYearlyTotal(expenses, currYear);
  const previousTotal = getYearlyTotal(expenses, prevYear);
  const change = calculatePercentageChange(currentTotal, previousTotal);

  let insight = '';
  if (!change.hasPrevious || previousTotal === 0) {
    if (currentTotal > 0) {
      insight = `Total spending for ${currYear} is ${formatCurrency(currentTotal)}. No prior expense history recorded for ${prevYear}.`;
    } else {
      insight = `No expenses recorded for ${currYear} yet.`;
    }
  } else if (change.direction === 'increase') {
    insight = `Your spending increased by ${change.percent}% compared with last year.`;
  } else if (change.direction === 'decrease') {
    insight = `Your spending decreased by ${change.percent}% compared with last year.`;
  } else {
    insight = `Your spending in ${currYear} matches your ${prevYear} spending.`;
  }

  return {
    currentYear: currYear,
    previousYear: prevYear,
    currentTotal,
    previousTotal,
    change,
    insight,
  };
};

/**
 * Month-to-Month comparison data & insight
 */
export const getMonthToMonthComparison = (expenses = [], year, month) => {
  const currYear = parseInt(year, 10);
  const currMonth = parseInt(month, 10);
  const prev = getPreviousMonth(currYear, currMonth);

  const currentTotal = getMonthlyTotal(expenses, currYear, currMonth);
  const previousTotal = getMonthlyTotal(expenses, prev.year, prev.month);
  const change = calculatePercentageChange(currentTotal, previousTotal);

  const currentMonthName = MONTH_NAMES[currMonth - 1] || 'Current Month';
  const previousMonthName = MONTH_NAMES[prev.month - 1] || 'Previous Month';

  let insight = '';
  let diffLabel = '';

  if (!change.hasPrevious || previousTotal === 0) {
    if (currentTotal > 0) {
      insight = `${currentMonthName} spending is ${formatCurrency(currentTotal)}. No prior data for ${previousMonthName}.`;
      diffLabel = 'First month of recorded data';
    } else {
      insight = `No expenses recorded for ${currentMonthName} ${currYear}.`;
      diffLabel = 'No spending recorded';
    }
  } else if (change.direction === 'increase') {
    insight = `Your spending increased by ${change.percent}% compared with ${previousMonthName}.`;
    diffLabel = `${formatCurrency(Math.abs(change.diff))} more than last month`;
  } else if (change.direction === 'decrease') {
    insight = `Your spending decreased by ${change.percent}% compared with ${previousMonthName}.`;
    diffLabel = `${formatCurrency(Math.abs(change.diff))} less than last month`;
  } else {
    insight = `Your spending is identical to ${previousMonthName}.`;
    diffLabel = 'Same as last month';
  }

  return {
    currentMonthName,
    previousMonthName,
    currentYear: currYear,
    currentMonth: currMonth,
    previousYear: prev.year,
    previousMonth: prev.month,
    currentTotal,
    previousTotal,
    change,
    diffLabel,
    insight,
  };
};

/**
 * Dynamic Long-Term Spending Insights generated strictly from real data
 */
export const getLongTermSpendingInsights = (expenses = [], budgetObj = {}, selectedYear = null) => {
  const insights = [];
  const now = new Date();
  const year = selectedYear ? parseInt(selectedYear, 10) : now.getFullYear();

  if (!expenses || expenses.length === 0) {
    return [
      {
        id: 'no-data',
        type: 'info',
        title: 'Start Tracking',
        message: 'Log your expenses to unlock automated long-term budget and historical spending insights.',
        tag: 'Welcome',
      },
    ];
  }

  const yearlyExpenses = getYearlyExpenses(expenses, year);
  const yearlyTotal = getYearlyTotal(expenses, year);
  const historical = getHistoricalSpending(expenses);

  // 1. Highest Spending Year
  if (historical.length > 0) {
    const sortedYears = [...historical].sort((a, b) => b.totalSpent - a.totalSpent);
    const topYear = sortedYears[0];
    if (topYear && topYear.totalSpent > 0) {
      insights.push({
        id: 'top-year',
        type: 'info',
        title: 'Peak Spending Year',
        message: `Your highest spending year was ${topYear.year} with ${formatCurrency(topYear.totalSpent)} recorded across ${topYear.transactionCount} transactions.`,
        tag: 'Historical Peak',
      });
    }
  }

  // 2. Average Monthly Spending this year
  if (yearlyTotal > 0) {
    const activeMonths = new Set(
      yearlyExpenses.map((i) => i.date && i.date.split('-')[1]).filter(Boolean)
    ).size;
    const monthsCount = Math.max(activeMonths, 1);
    const avgMonthly = Math.round(yearlyTotal / monthsCount);
    insights.push({
      id: 'avg-monthly-year',
      type: 'neutral',
      title: 'Average Monthly Velocity',
      message: `Your average monthly spending in ${year} is ${formatCurrency(avgMonthly)} across ${monthsCount} active month${monthsCount > 1 ? 's' : ''}.`,
      tag: 'Yearly Pace',
    });
  }

  // 3. Highest spending category this year
  const yearCategoryData = calculateCategoryBreakdown(yearlyExpenses);
  if (yearCategoryData.categories.length > 0) {
    const topCat = yearCategoryData.categories[0];
    insights.push({
      id: 'top-cat-year',
      type: 'info',
      title: 'Dominant Category',
      message: `${topCat.name} is your highest spending category this year at ${formatCurrency(topCat.value)} (${topCat.percentage}% of ${year} spend).`,
      tag: 'Category Driver',
    });
  }

  // 4. Highest spending month of the year
  const yearMonthlyTrend = getMonthlyTrendForYear(expenses, year);
  const activeMonthsTrend = yearMonthlyTrend.filter((m) => m.amount > 0);
  if (activeMonthsTrend.length > 0) {
    const topMonth = [...activeMonthsTrend].sort((a, b) => b.amount - a.amount)[0];
    if (topMonth) {
      insights.push({
        id: 'peak-month',
        type: 'neutral',
        title: 'Highest Spending Month',
        message: `Your highest spending month in ${year} was ${topMonth.fullLabel} (${formatCurrency(topMonth.amount)}).`,
        tag: 'Seasonality',
      });
    }
  }

  // 5. Year-over-Year Insight
  const yoy = getYearOverYearComparison(expenses, year);
  if (yoy.change.hasPrevious && yoy.previousTotal > 0) {
    insights.push({
      id: 'yoy-insight',
      type: yoy.change.direction === 'decrease' ? 'success' : 'warning',
      title: 'Year-over-Year Trajectory',
      message: yoy.insight,
      tag: yoy.change.direction === 'decrease' ? 'Spending Reduced' : 'Spend Velocity',
    });
  }

  // 6. Current Month vs Previous Month
  const currentMonth = now.getMonth() + 1;
  const mom = getMonthToMonthComparison(expenses, now.getFullYear(), currentMonth);
  if (mom.change.hasPrevious && mom.previousTotal > 0) {
    insights.push({
      id: 'mom-insight',
      type: mom.change.direction === 'decrease' ? 'success' : 'warning',
      title: 'Month-to-Month Pace',
      message: mom.insight,
      tag: 'Pacing',
    });
  }

  return insights;
};

/**
 * Calculate primary summary statistics for dashboard and budget
 */
export const calculateDashboardStats = (expenses = [], budgetObj = {}) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const totalAllTime = (expenses || []).reduce(
    (acc, curr) => acc + (Math.max(0, Number(curr.amount)) || 0),
    0
  );

  const thisMonthExpenses = getExpensesForMonth(expenses, currentYear, currentMonth);
  const thisMonthTotal = thisMonthExpenses.reduce(
    (acc, curr) => acc + (Math.max(0, Number(curr.amount)) || 0),
    0
  );

  const todayExpenses = getExpensesForToday(expenses);
  const todayTotal = todayExpenses.reduce(
    (acc, curr) => acc + (Math.max(0, Number(curr.amount)) || 0),
    0
  );

  const budgetAmount = Number(budgetObj.amount) || 0;
  const remainingBudget = budgetAmount - thisMonthTotal;
  const budgetUsagePercent = budgetAmount > 0 ? (thisMonthTotal / budgetAmount) * 100 : 0;

  const prev = getPreviousMonth(currentYear, currentMonth);
  const prevMonthExpenses = getExpensesForMonth(expenses, prev.year, prev.month);
  const prevMonthTotal = prevMonthExpenses.reduce(
    (acc, curr) => acc + (Math.max(0, Number(curr.amount)) || 0),
    0
  );

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
    totalCount: (expenses || []).length,
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
    const total = monthExpenses.reduce((acc, curr) => acc + (Math.max(0, Number(curr.amount)) || 0), 0);

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

  (expenses || []).forEach((item) => {
    if (dayMap[item.date]) {
      dayMap[item.date].amount += Math.max(0, Number(item.amount) || 0);
      dayMap[item.date].count += 1;
    }
  });

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
 * Key analytics metrics
 */
export const calculateAnalyticsMetrics = (expenses = []) => {
  if (!expenses || expenses.length === 0) {
    return {
      highestCategory: null,
      highestExpense: null,
      averageDailySpend: 0,
      totalTransactions: 0,
      totalSpend: 0,
    };
  }

  const highestExpense = [...expenses].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];
  const { categories } = calculateCategoryBreakdown(expenses);
  const highestCategory = categories.length > 0 ? categories[0] : null;

  const totalSpend = expenses.reduce((sum, item) => sum + (Math.max(0, Number(item.amount)) || 0), 0);
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
 * Backward compatibility alias for generateSmartInsights
 */
export const generateSmartInsights = (expenses = [], budgetObj = {}) => {
  return getLongTermSpendingInsights(expenses, budgetObj);
};
