import React, { useState, useMemo } from 'react';
import {
  Plus,
  ArrowUpDown,
  Filter,
  Download,
  Calendar,
  Layers,
  Search,
  Receipt,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { ExpenseTable } from '../components/expenses/ExpenseTable';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { CategoryFilter } from '../components/expenses/CategoryFilter';
import { SearchBar } from '../components/expenses/SearchBar';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { formatCurrency } from '../utils/formatters';

export const Expenses = () => {
  const { expenses, updateExpense, deleteExpense, addExpense } = useExpenses();
  const { addToast } = useToast();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL' | 'THIS_MONTH' | 'LAST_30' | 'THIS_YEAR'
  const [sortBy, setSortBy] = useState('DATE_DESC'); // 'DATE_DESC' | 'DATE_ASC' | 'AMOUNT_DESC' | 'AMOUNT_ASC'

  // Modals
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter & Sort Logic
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Search filter (description, category, amount)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          String(item.amount).includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Date range filter
    if (dateFilter === 'THIS_MONTH') {
      result = result.filter((item) => {
        if (!item.date) return false;
        const [y, m] = item.date.split('-').map(Number);
        return y === currentYear && m === currentMonth;
      });
    } else if (dateFilter === 'LAST_30') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      result = result.filter((item) => {
        if (!item.date) return false;
        const itemDate = new Date(item.date + 'T00:00:00');
        return itemDate >= thirtyDaysAgo && itemDate <= now;
      });
    } else if (dateFilter === 'THIS_YEAR') {
      result = result.filter((item) => {
        if (!item.date) return false;
        const [y] = item.date.split('-').map(Number);
        return y === currentYear;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'DATE_DESC') {
        return new Date(b.date || 0) - new Date(a.date || 0);
      }
      if (sortBy === 'DATE_ASC') {
        return new Date(a.date || 0) - new Date(b.date || 0);
      }
      if (sortBy === 'AMOUNT_DESC') {
        return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      }
      if (sortBy === 'AMOUNT_ASC') {
        return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      }
      return 0;
    });

    return result;
  }, [expenses, searchTerm, selectedCategory, dateFilter, sortBy]);

  // Total amount of currently filtered expenses
  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredExpenses]);

  // Handlers
  const handleEditSubmit = (updatedData) => {
    if (!editingExpense) return;
    updateExpense(editingExpense.id, updatedData);
    addToast('Expense updated successfully!', 'success');
    setEditingExpense(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingExpense) return;
    deleteExpense(deletingExpense.id);
    addToast('Expense deleted', 'info');
    setDeletingExpense(null);
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      addToast('No expenses available to export', 'warning');
      return;
    }
    const headers = ['ID', 'Date', 'Description', 'Category', 'Payment Method', 'Amount (INR)'];
    const rows = filteredExpenses.map((e) => [
      e.id,
      e.date,
      `"${e.description.replace(/"/g, '""')}"`,
      e.category,
      e.paymentMethod || 'UPI',
      e.amount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `spendwise_expenses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exported expenses to CSV', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Expenses</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage, filter, search, and analyze all your logged transactions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            title="Export filtered expenses to CSV"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search by description, category, or amount..."
          />

          {/* Date Filter Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-auto pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="ALL">All Time</option>
                <option value="THIS_MONTH">This Month</option>
                <option value="LAST_30">Last 30 Days</option>
                <option value="THIS_YEAR">This Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="DATE_DESC">Newest First</option>
                <option value="DATE_ASC">Oldest First</option>
                <option value="AMOUNT_DESC">Highest Amount</option>
                <option value="AMOUNT_ASC">Lowest Amount</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="pt-2 border-t border-slate-100">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Summary Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredExpenses.length}</strong> of{' '}
          <strong className="text-slate-800">{expenses.length}</strong> expenses
        </span>
        <span>
          Filtered Total: <strong className="text-slate-900 font-bold text-sm">{formatCurrency(filteredTotal)}</strong>
        </span>
      </div>

      {/* Main Expense Listing: Desktop Table & Mobile Cards */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          iconName="Receipt"
          title={searchTerm || selectedCategory !== 'ALL' || dateFilter !== 'ALL' ? 'No matching expenses' : 'No expenses recorded'}
          description={
            searchTerm || selectedCategory !== 'ALL' || dateFilter !== 'ALL'
              ? 'Try modifying your search query or reset your filters.'
              : 'Add your first expense to begin managing your finances.'
          }
          actionText={
            searchTerm || selectedCategory !== 'ALL' || dateFilter !== 'ALL'
              ? 'Reset Filters'
              : 'Add Expense'
          }
          onAction={() => {
            if (searchTerm || selectedCategory !== 'ALL' || dateFilter !== 'ALL') {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setDateFilter('ALL');
            } else {
              setIsAddModalOpen(true);
            }
          }}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <ExpenseTable
              expenses={filteredExpenses}
              onEdit={(exp) => setEditingExpense(exp)}
              onDelete={(exp) => setDeletingExpense(exp)}
            />
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {filteredExpenses.map((exp) => (
              <ExpenseCard
                key={exp.id}
                expense={exp}
                onEdit={(item) => setEditingExpense(item)}
                onDelete={(item) => setDeletingExpense(item)}
              />
            ))}
          </div>
        </>
      )}

      {/* Edit Expense Modal */}
      <Modal
        isOpen={Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
        subtitle="Update the transaction details and save changes"
        maxWidth="max-w-lg"
      >
        {editingExpense && (
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingExpense(null)}
            submitLabel="Update Expense"
          />
        )}
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Expense"
        subtitle="Enter new expense details to update your records"
        maxWidth="max-w-lg"
      >
        <ExpenseForm
          onSubmit={(data) => {
            addExpense(data);
            addToast('Expense logged successfully!', 'success');
            setIsAddModalOpen(false);
          }}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Create Expense"
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingExpense)}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deletingExpense?.description}" for ${formatCurrency(deletingExpense?.amount || 0)}? This action cannot be reversed.`}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      />
    </div>
  );
};
