import { STORAGE_KEYS, DEFAULT_BUDGET } from './constants';
import { getTodayString } from './formatters';

/**
 * Generates realistic initial demo expenses anchored around today's date,
 * covering current month, previous months in the current year, and historical years.
 */
export const generateDemoExpenses = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const todayDate = now.getDate();

  // Helper to format a date in YYYY-MM-DD
  const makeDate = (d, m = month, y = year) => {
    let safeMonth = m;
    let safeYear = y;
    while (safeMonth < 0) {
      safeMonth += 12;
      safeYear -= 1;
    }
    while (safeMonth > 11) {
      safeMonth -= 12;
      safeYear += 1;
    }
    const dt = new Date(safeYear, safeMonth, d);
    const yr = dt.getFullYear();
    const mn = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${yr}-${mn}-${day}`;
  };

  const currentYearExpenses = [
    {
      id: 'demo-1',
      amount: 450,
      category: 'Food',
      description: 'Morning breakfast & coffee at Starbucks',
      date: getTodayString(),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      amount: 1250,
      category: 'Transportation',
      description: 'Monthly metro pass recharge',
      date: makeDate(Math.max(1, todayDate - 1)),
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-3',
      amount: 3200,
      category: 'Shopping',
      description: 'New running sneakers from Nike',
      date: makeDate(Math.max(1, todayDate - 3)),
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'demo-4',
      amount: 1850,
      category: 'Bills',
      description: 'High-speed broadband internet fiber bill',
      date: makeDate(Math.max(1, todayDate - 5)),
      paymentMethod: 'Net Banking',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'demo-5',
      amount: 1400,
      category: 'Food',
      description: 'Weekend family dinner at Italian bistro',
      date: makeDate(Math.max(1, todayDate - 7)),
      paymentMethod: 'Debit Card',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'demo-6',
      amount: 899,
      category: 'Entertainment',
      description: 'IMAX movie tickets & popcorn combo',
      date: makeDate(Math.max(1, todayDate - 9)),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
    },
    {
      id: 'demo-7',
      amount: 650,
      category: 'Healthcare',
      description: 'Pharmacy vitamins & health supplements',
      date: makeDate(Math.max(1, todayDate - 11)),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    },
    {
      id: 'demo-8',
      amount: 2499,
      category: 'Education',
      description: 'Advanced React & TypeScript masterclass',
      date: makeDate(Math.max(1, todayDate - 14)),
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: 'demo-9',
      amount: 350,
      category: 'Food',
      description: 'Quick lunch cafeteria combo',
      date: makeDate(Math.max(1, todayDate - 16)),
      paymentMethod: 'Cash',
      createdAt: new Date(Date.now() - 16 * 86400000).toISOString(),
    },
    {
      id: 'demo-10',
      amount: 4200,
      category: 'Bills',
      description: 'Quarterly electricity utility bill',
      date: makeDate(Math.max(1, todayDate - 18)),
      paymentMethod: 'Net Banking',
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    },
    {
      id: 'demo-11',
      amount: 750,
      category: 'Other',
      description: 'Home plant pots and gardening tools',
      date: makeDate(Math.max(1, todayDate - 20)),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
    // Previous month (e.g. September)
    {
      id: 'demo-12',
      amount: 2800,
      category: 'Food',
      description: 'Monthly grocery replenishment at supermarket',
      date: makeDate(15, month - 1),
      paymentMethod: 'Credit Card',
      createdAt: new Date(Date.now() - 35 * 86400000).toISOString(),
    },
    {
      id: 'demo-13',
      amount: 1950,
      category: 'Bills',
      description: 'Previous month mobile & internet bills',
      date: makeDate(22, month - 1),
      paymentMethod: 'Net Banking',
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
    {
      id: 'demo-14',
      amount: 2100,
      category: 'Shopping',
      description: 'Casual work apparel & desk organizer',
      date: makeDate(28, month - 1),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    },
    // Additional months in current year to give rich 12-month charts
    {
      id: 'demo-15',
      amount: 18450,
      category: 'Bills',
      description: 'January house maintenance & utilities',
      date: makeDate(10, 0, year),
      paymentMethod: 'Net Banking',
      createdAt: new Date(year, 0, 10).toISOString(),
    },
    {
      id: 'demo-16',
      amount: 21200,
      category: 'Shopping',
      description: 'February appliances and home updates',
      date: makeDate(14, 1, year),
      paymentMethod: 'Credit Card',
      createdAt: new Date(year, 1, 14).toISOString(),
    },
    {
      id: 'demo-17',
      amount: 17850,
      category: 'Food',
      description: 'March organic groceries and dining',
      date: makeDate(18, 2, year),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(year, 2, 18).toISOString(),
    },
    {
      id: 'demo-18',
      amount: 23100,
      category: 'Education',
      description: 'April professional development & certifications',
      date: makeDate(12, 3, year),
      paymentMethod: 'Credit Card',
      createdAt: new Date(year, 3, 12).toISOString(),
    },
    {
      id: 'demo-19',
      amount: 19400,
      category: 'Transportation',
      description: 'May vehicle service and transit pass',
      date: makeDate(20, 4, year),
      paymentMethod: 'Net Banking',
      createdAt: new Date(year, 4, 20).toISOString(),
    },
    {
      id: 'demo-20',
      amount: 22600,
      category: 'Entertainment',
      description: 'June summer vacation and travel bookings',
      date: makeDate(25, 5, year),
      paymentMethod: 'Credit Card',
      createdAt: new Date(year, 5, 25).toISOString(),
    },
    {
      id: 'demo-21',
      amount: 18900,
      category: 'Healthcare',
      description: 'July health checkups and wellness package',
      date: makeDate(15, 6, year),
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(year, 6, 15).toISOString(),
    },
    {
      id: 'demo-22',
      amount: 20150,
      category: 'Bills',
      description: 'August insurance premiums & electricity',
      date: makeDate(11, 7, year),
      paymentMethod: 'Net Banking',
      createdAt: new Date(year, 7, 11).toISOString(),
    },
  ];

  // Historical data for previous years (e.g. 2025, 2024, 2023)
  const historicalExpenses = [
    // 2025
    {
      id: 'hist-2025-1',
      amount: 68000,
      category: 'Bills',
      description: '2025 Annual utilities and insurance package',
      date: `${year - 1}-03-15`,
      paymentMethod: 'Net Banking',
      createdAt: new Date(year - 1, 2, 15).toISOString(),
    },
    {
      id: 'hist-2025-2',
      amount: 55400,
      category: 'Food',
      description: '2025 Dining, supermarkets and groceries',
      date: `${year - 1}-06-20`,
      paymentMethod: 'Credit Card',
      createdAt: new Date(year - 1, 5, 20).toISOString(),
    },
    {
      id: 'hist-2025-3',
      amount: 48000,
      category: 'Shopping',
      description: '2025 Electronics and seasonal wardrobe',
      date: `${year - 1}-09-10`,
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(year - 1, 8, 10).toISOString(),
    },
    {
      id: 'hist-2025-4',
      amount: 47000,
      category: 'Transportation',
      description: '2025 Commute and highway tolls',
      date: `${year - 1}-11-05`,
      paymentMethod: 'Net Banking',
      createdAt: new Date(year - 1, 10, 5).toISOString(),
    },

    // 2024
    {
      id: 'hist-2024-1',
      amount: 62000,
      category: 'Bills',
      description: '2024 Annual utilities bundle',
      date: `${year - 2}-04-12`,
      paymentMethod: 'Net Banking',
      createdAt: new Date(year - 2, 3, 12).toISOString(),
    },
    {
      id: 'hist-2024-2',
      amount: 52000,
      category: 'Food',
      description: '2024 Annual food & culinary expenses',
      date: `${year - 2}-07-18`,
      paymentMethod: 'Credit Card',
      createdAt: new Date(year - 2, 6, 18).toISOString(),
    },
    {
      id: 'hist-2024-3',
      amount: 44200,
      category: 'Shopping',
      description: '2024 Home furnishing and gear',
      date: `${year - 2}-10-22`,
      paymentMethod: 'UPI / GPay',
      createdAt: new Date(year - 2, 9, 22).toISOString(),
    },
    {
      id: 'hist-2024-4',
      amount: 36000,
      category: 'Education',
      description: '2024 Coding bootcamps & software books',
      date: `${year - 2}-12-10`,
      paymentMethod: 'Net Banking',
      createdAt: new Date(year - 2, 11, 10).toISOString(),
    },

    // 2023
    {
      id: 'hist-2023-1',
      amount: 95000,
      category: 'Bills',
      description: '2023 Cumulative annual household bills',
      date: `${year - 3}-05-14`,
      paymentMethod: 'Net Banking',
      createdAt: new Date(year - 3, 4, 14).toISOString(),
    },
    {
      id: 'hist-2023-2',
      amount: 77500,
      category: 'Food',
      description: '2023 Dining & provisions',
      date: `${year - 3}-08-20`,
      paymentMethod: 'Credit Card',
      createdAt: new Date(year - 3, 7, 20).toISOString(),
    },
  ];

  return [...currentYearExpenses, ...historicalExpenses];
};

/**
 * Initialize storage with demo data only if expenses don't exist yet
 */
export const initializeStorage = () => {
  try {
    const existingExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!existingExpenses) {
      const demoData = generateDemoExpenses();
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(demoData));
    }

    const existingBudget = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!existingBudget) {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

      const initialBudget = {
        month: currentMonth,
        year: currentYear,
        amount: DEFAULT_BUDGET,
        history: {
          [currentKey]: DEFAULT_BUDGET,
        },
        monthly: {
          [currentKey]: DEFAULT_BUDGET,
          [`${currentYear}-${String(Math.max(1, currentMonth - 1)).padStart(2, '0')}`]: DEFAULT_BUDGET,
        },
        yearly: {
          [String(currentYear)]: DEFAULT_BUDGET * 12,
          [String(currentYear - 1)]: DEFAULT_BUDGET * 12,
        },
      };
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(initialBudget));
    }
  } catch (err) {
    console.error('Failed to initialize SpendWise localStorage:', err);
  }
};

/**
 * Retrieve all expenses from localStorage
 */
export const getStoredExpenses = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading expenses from localStorage:', err);
    return [];
  }
};

/**
 * Save all expenses to localStorage
 */
export const saveStoredExpenses = (expenses) => {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return true;
  } catch (err) {
    console.error('Error saving expenses to localStorage:', err);
    return false;
  }
};

/**
 * Add a single expense
 */
export const addStoredExpense = (expenseData) => {
  const current = getStoredExpenses();
  const newExpense = {
    id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    amount: parseFloat(expenseData.amount),
    category: expenseData.category,
    description: expenseData.description.trim(),
    date: expenseData.date,
    paymentMethod: expenseData.paymentMethod || 'UPI / GPay',
    createdAt: new Date().toISOString(),
  };
  const updated = [newExpense, ...current];
  saveStoredExpenses(updated);
  return newExpense;
};

/**
 * Update an existing expense by ID
 */
export const updateStoredExpense = (id, updatedFields) => {
  const current = getStoredExpenses();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updatedExpense = {
    ...current[index],
    ...updatedFields,
    amount: parseFloat(updatedFields.amount),
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedExpense;
  saveStoredExpenses(current);
  return updatedExpense;
};

/**
 * Delete an expense by ID
 */
export const deleteStoredExpense = (id) => {
  const current = getStoredExpenses();
  const filtered = current.filter((item) => item.id !== id);
  saveStoredExpenses(filtered);
  return true;
};

/**
 * Get normalized budget data supporting both monthly and yearly budgets
 * while fully preserving backwards compatibility with older formats.
 */
export const getStoredBudget = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    if (data) {
      const parsed = JSON.parse(data);
      // Ensure backwards compatibility with old structure
      const monthly = parsed.monthly || {};
      const history = parsed.history || {};

      // Merge history into monthly if not already present
      Object.keys(history).forEach((k) => {
        if (!monthly[k]) monthly[k] = history[k];
      });

      if (!monthly[currentKey] && parsed.amount) {
        monthly[currentKey] = parsed.amount;
      }

      const yearly = parsed.yearly || {};
      if (!yearly[String(currentYear)]) {
        yearly[String(currentYear)] = (parsed.amount || DEFAULT_BUDGET) * 12;
      }

      return {
        month: parsed.month || currentMonth,
        year: parsed.year || currentYear,
        amount: parsed.amount || DEFAULT_BUDGET,
        history: { ...history, ...monthly },
        monthly,
        yearly,
      };
    }

    return {
      month: currentMonth,
      year: currentYear,
      amount: DEFAULT_BUDGET,
      history: { [currentKey]: DEFAULT_BUDGET },
      monthly: { [currentKey]: DEFAULT_BUDGET },
      yearly: { [String(currentYear)]: DEFAULT_BUDGET * 12 },
    };
  } catch (err) {
    console.error('Error reading budget from localStorage:', err);
    return {
      amount: DEFAULT_BUDGET,
      monthly: {},
      yearly: {},
      history: {},
    };
  }
};

/**
 * Get monthly budget for a specific year and month
 */
export const getBudgetForMonth = (budgetObj, year, month) => {
  if (!budgetObj) return DEFAULT_BUDGET;
  const key = `${year}-${String(month).padStart(2, '0')}`;
  if (budgetObj.monthly && budgetObj.monthly[key] !== undefined) {
    return Number(budgetObj.monthly[key]);
  }
  if (budgetObj.history && budgetObj.history[key] !== undefined) {
    return Number(budgetObj.history[key]);
  }
  return Number(budgetObj.amount) || DEFAULT_BUDGET;
};

/**
 * Get yearly budget for a specific year
 */
export const getBudgetForYear = (budgetObj, year) => {
  if (!budgetObj) return DEFAULT_BUDGET * 12;
  const yrKey = String(year);
  if (budgetObj.yearly && budgetObj.yearly[yrKey] !== undefined) {
    return Number(budgetObj.yearly[yrKey]);
  }
  // Fallback: 12 times monthly budget
  const monthlyVal = getBudgetForMonth(budgetObj, year, 1);
  return monthlyVal * 12;
};

/**
 * Save or update monthly budget for a specific month and year
 */
export const saveStoredBudget = (amount, month, year) => {
  try {
    const currentBudget = getStoredBudget();
    const now = new Date();
    const targetMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year, 10) : now.getFullYear();
    const key = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
    const parsedAmount = Math.max(0, parseFloat(amount));

    const updated = {
      ...currentBudget,
      month: targetMonth,
      year: targetYear,
      amount: parsedAmount,
      history: {
        ...(currentBudget.history || {}),
        [key]: parsedAmount,
      },
      monthly: {
        ...(currentBudget.monthly || {}),
        [key]: parsedAmount,
      },
      yearly: {
        ...(currentBudget.yearly || {}),
        [String(targetYear)]: currentBudget.yearly?.[String(targetYear)] || parsedAmount * 12,
      },
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving monthly budget to localStorage:', err);
    return null;
  }
};

/**
 * Save or update yearly budget for a specific year
 */
export const saveStoredYearlyBudget = (amount, year) => {
  try {
    const currentBudget = getStoredBudget();
    const now = new Date();
    const targetYear = String(year || now.getFullYear());
    const parsedAmount = Math.max(0, parseFloat(amount));

    const updated = {
      ...currentBudget,
      yearly: {
        ...(currentBudget.yearly || {}),
        [targetYear]: parsedAmount,
      },
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving yearly budget to localStorage:', err);
    return null;
  }
};

/**
 * Reset all data back to fresh demo state
 */
export const resetToDemoData = () => {
  const demoData = generateDemoExpenses();
  saveStoredExpenses(demoData);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const initialBudget = {
    month: currentMonth,
    year: currentYear,
    amount: DEFAULT_BUDGET,
    history: {
      [currentKey]: DEFAULT_BUDGET,
    },
    monthly: {
      [currentKey]: DEFAULT_BUDGET,
      [`${currentYear}-${String(Math.max(1, currentMonth - 1)).padStart(2, '0')}`]: DEFAULT_BUDGET,
    },
    yearly: {
      [String(currentYear)]: 420000,
      [String(currentYear - 1)]: 380000,
      [String(currentYear - 2)]: 340000,
    },
  };
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(initialBudget));
  return { expenses: demoData, budget: initialBudget };
};
