import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initializeStorage,
  getStoredExpenses,
  addStoredExpense,
  updateStoredExpense,
  deleteStoredExpense,
  getStoredBudget,
  saveStoredBudget,
  resetToDemoData,
} from '../utils/storage';
import {
  calculateDashboardStats,
  calculateCategoryBreakdown,
  calculateMonthlySpending,
  calculateSpendingTrend,
  calculateAnalyticsMetrics,
  generateSmartInsights,
} from '../utils/calculations';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({ amount: 35000 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    initializeStorage();
    const loadedExpenses = getStoredExpenses();
    const loadedBudget = getStoredBudget();
    setExpenses(loadedExpenses);
    setBudget(loadedBudget);
    setIsInitialized(true);
  }, []);

  // Actions
  const handleAddExpense = useCallback((expenseData) => {
    const created = addStoredExpense(expenseData);
    setExpenses((prev) => [created, ...prev]);
    return created;
  }, []);

  const handleUpdateExpense = useCallback((id, updatedData) => {
    const updated = updateStoredExpense(id, updatedData);
    if (updated) {
      setExpenses((prev) => prev.map((item) => (item.id === id ? updated : item)));
    }
    return updated;
  }, []);

  const handleDeleteExpense = useCallback((id) => {
    const success = deleteStoredExpense(id);
    if (success) {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    }
    return success;
  }, []);

  const handleUpdateBudget = useCallback((amount, month, year) => {
    const updated = saveStoredBudget(amount, month, year);
    if (updated) {
      setBudget(updated);
    }
    return updated;
  }, []);

  const handleResetData = useCallback(() => {
    const { expenses: demoExpenses, budget: demoBudget } = resetToDemoData();
    setExpenses(demoExpenses);
    setBudget(demoBudget);
  }, []);

  // Memoized computations derived dynamically from real localStorage state
  const dashboardStats = useMemo(() => {
    return calculateDashboardStats(expenses, budget);
  }, [expenses, budget]);

  const categoryBreakdown = useMemo(() => {
    return calculateCategoryBreakdown(expenses);
  }, [expenses]);

  const monthlySpending = useMemo(() => {
    return calculateMonthlySpending(expenses, 6);
  }, [expenses]);

  const spendingTrend = useMemo(() => {
    return calculateSpendingTrend(expenses, 30);
  }, [expenses]);

  const analyticsMetrics = useMemo(() => {
    return calculateAnalyticsMetrics(expenses);
  }, [expenses]);

  const smartInsights = useMemo(() => {
    return generateSmartInsights(expenses, budget);
  }, [expenses, budget]);

  const value = {
    expenses,
    budget,
    isInitialized,
    dashboardStats,
    categoryBreakdown,
    monthlySpending,
    spendingTrend,
    analyticsMetrics,
    smartInsights,
    addExpense: handleAddExpense,
    updateExpense: handleUpdateExpense,
    deleteExpense: handleDeleteExpense,
    updateBudget: handleUpdateBudget,
    resetData: handleResetData,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
