import React, { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS } from '../../utils/constants';
import { getTodayString } from '../../utils/formatters';
import { AlertCircle, IndianRupee, Calendar, FileText, Tag, CreditCard } from 'lucide-react';

export const ExpenseForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  submitLabel = 'Save Expense',
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: getTodayString(),
    paymentMethod: 'UPI / GPay',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        description: initialData.description || '',
        date: initialData.date || getTodayString(),
        paymentMethod: initialData.paymentMethod || 'UPI / GPay',
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    const amt = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.description.trim()) {
      errs.description = 'Please provide a short description';
    } else if (formData.description.trim().length < 2) {
      errs.description = 'Description must be at least 2 characters';
    }
    if (!formData.category) {
      errs.category = 'Please select a category';
    }
    if (!formData.date) {
      errs.date = 'Please select a date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
    });

    if (!initialData) {
      // Reset form if creating new
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: getTodayString(),
        paymentMethod: 'UPI / GPay',
      });
      setErrors({});
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Amount (₹) <span className="text-rose-500">*</span>
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IndianRupee className="w-5 h-5 text-slate-500" />
          </div>
          <input
            type="number"
            step="any"
            min="1"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 font-semibold placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.amount
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.amount}
          </p>
        )}
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Category <span className="text-rose-500">*</span>
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Tag className="w-4 h-4 text-slate-400" />
          </div>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`block w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
              errors.category
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
        {errors.category && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.category}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Description <span className="text-rose-500">*</span>
        </label>
        <div className="relative rounded-xl shadow-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="e.g. Grocery shopping at supermarket"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-rose-300 focus:ring-rose-400'
                : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.description}
          </p>
        )}
      </div>

      {/* Date & Payment Method Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`block w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.date
                  ? 'border-rose-300 focus:ring-rose-400'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Payment Mode
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="w-4 h-4 text-slate-400" />
            </div>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              className="block w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-3 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
