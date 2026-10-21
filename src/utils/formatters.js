/**
 * Format a numeric amount to Indian Rupee (₹) standard currency format
 */
export const formatCurrency = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const { compact = false, showFraction = false } = options;

  if (compact && Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  if (compact && Math.abs(num) >= 1000) {
    return `₹${(num / 1000).toFixed(1)}k`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showFraction ? 2 : 0,
    minimumFractionDigits: showFraction ? 2 : 0,
  }).format(num);
};

/**
 * Format date string (YYYY-MM-DD) into readable format like "21 Oct 2026"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format full date with day of the week
 */
export const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a percentage number
 */
export const formatPercentage = (percent) => {
  const num = Number(percent) || 0;
  return `${Math.round(num)}%`;
};

/**
 * Helper to get current Year-Month string e.g. "2026-10"
 */
export const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Helper to get today's date formatted as YYYY-MM-DD
 */
export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
