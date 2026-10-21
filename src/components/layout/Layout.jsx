import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Modal } from '../common/Modal';
import { ExpenseForm } from '../expenses/ExpenseForm';
import { useExpenses } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';
import { X } from 'lucide-react';

export const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const location = useLocation();
  const { addExpense } = useExpenses();
  const { addToast } = useToast();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/expenses':
        return 'Expense Management';
      case '/add-expense':
        return 'Add New Expense';
      case '/budget':
        return 'Monthly Budget & Targets';
      case '/analytics':
        return 'Financial Analytics & Insights';
      default:
        return 'SpendWise';
    }
  };

  const handleCreateExpense = (expenseData) => {
    addExpense(expenseData);
    addToast('Expense recorded successfully!', 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white animate-fade-in z-10 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          title={getPageTitle(location.pathname)}
          onOpenMobile={() => setMobileMenuOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Quick Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Expense"
        subtitle="Log a new transaction to update your budget and statistics"
        maxWidth="max-w-lg"
      >
        <ExpenseForm
          onSubmit={handleCreateExpense}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Add Transaction"
        />
      </Modal>
    </div>
  );
};
