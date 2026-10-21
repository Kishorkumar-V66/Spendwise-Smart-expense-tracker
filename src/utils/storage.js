import { STORAGE_KEYS, DEFAULT_BUDGET } from './constants';
import { getTodayString } from './formatters';

/**
 * Generates realistic initial demo expenses anchored around today's date
 */
export const generateDemoExpenses = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const todayDate = now.getDate();

  // Helper to format a date in YYYY-MM-DD
  const makeDate = (d, m = month, y = year) => {
    const safeMonth = m < 0 ? 11 : m;
    const safeYear = m < 0 ? y - 1 : y;
    const dt = new Date(safeYear, safeMonth, d);
    const yr = dt.getFullYear();
    const mn = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${yr}-${mn}-${day}`;
  };

  return [
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
    // Previous month expenses for realistic month-over-month comparisons & monthly chart
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
  ];
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
      const initialBudget = {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: DEFAULT_BUDGET,
        history: {
          [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`]: DEFAULT_BUDGET,
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
 * Get the budget data
 */
export const getStoredBudget = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (data) {
      return JSON.parse(data);
    }
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount: DEFAULT_BUDGET,
      history: {},
    };
  } catch (err) {
    console.error('Error reading budget from localStorage:', err);
    return { amount: DEFAULT_BUDGET };
  }
};

/**
 * Save or update budget
 */
export const saveStoredBudget = (amount, month, year) => {
  try {
    const currentBudget = getStoredBudget();
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();
    const key = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;

    const updated = {
      ...currentBudget,
      month: targetMonth,
      year: targetYear,
      amount: parseFloat(amount),
      history: {
        ...(currentBudget.history || {}),
        [key]: parseFloat(amount),
      },
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Error saving budget to localStorage:', err);
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
  const initialBudget = {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    amount: DEFAULT_BUDGET,
    history: {
      [`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`]: DEFAULT_BUDGET,
    },
  };
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(initialBudget));
  return { expenses: demoData, budget: initialBudget };
};
