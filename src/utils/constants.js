export const CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', icon: 'Utensils', color: '#F97316', bgLight: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'Transportation', label: 'Transportation', icon: 'Car', color: '#3B82F6', bgLight: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#EC4899', bgLight: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'Bills', label: 'Bills & Utilities', icon: 'Receipt', color: '#8B5CF6', bgLight: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Education', label: 'Education', icon: 'GraduationCap', color: '#10B981', bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Entertainment', label: 'Entertainment', icon: 'Film', color: '#F59E0B', bgLight: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Healthcare', label: 'Healthcare', icon: 'HeartPulse', color: '#EF4444', bgLight: 'bg-rose-50 text-rose-700 border-rose-200' },
  { id: 'Other', label: 'Other', icon: 'MoreHorizontal', color: '#64748B', bgLight: 'bg-slate-50 text-slate-700 border-slate-200' },
];

export const PAYMENT_METHODS = [
  'UPI / GPay',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Net Banking',
];

export const STORAGE_KEYS = {
  EXPENSES: 'spendwise_expenses_v1',
  BUDGET: 'spendwise_budget_v1',
  SETTINGS: 'spendwise_settings_v1',
};

export const DEFAULT_BUDGET = 35000;
