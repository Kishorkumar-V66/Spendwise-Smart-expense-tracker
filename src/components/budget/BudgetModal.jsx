import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { IndianRupee, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const BudgetModal = ({ isOpen, onClose, currentBudget = 35000, onSave }) => {
  const [amount, setAmount] = useState(currentBudget);
  const [error, setError] = useState('');

  useEffect(() => {
    setAmount(currentBudget);
    setError('');
  }, [currentBudget, isOpen]);

  const presets = [15000, 25000, 35000, 50000, 75000];

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid monthly budget amount');
      return;
    }
    onSave(val);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Monthly Budget"
      subtitle="Define your monthly spending limit to receive automatic alerts and pacing feedback"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Budget Amount (₹)
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <IndianRupee className="w-5 h-5 text-slate-500" />
            </div>
            <input
              type="number"
              min="500"
              step="500"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="e.g. 35000"
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-xs font-semibold text-slate-500 mb-2">Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setError('');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  Number(amount) === preset
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {formatCurrency(preset)}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-all"
          >
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};
