import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { AddExpensePage } from './pages/AddExpensePage';
import { BudgetPage } from './pages/BudgetPage';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <ToastProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="add-expense" element={<AddExpensePage />} />
              <Route path="budget" element={<BudgetPage />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ExpenseProvider>
    </ToastProvider>
  );
}

export default App;
