import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

export const BudgetProgress = ({
  budgetAmount = 0,
  spentAmount = 0,
  remainingAmount = 0,
  usagePercent = 0,
  onEditBudget,
  title = 'Monthly Budget Progress',
  subtitle = 'Real-time tracking of current month spending against your target',
}) => {
  const isOverBudget = remainingAmount < 0;
  const isNearBudget = usagePercent >= 80 && !isOverBudget;
  const clampedPercent = Math.min(Math.max(usagePercent, 0), 100);

  let statusColor = 'bg-emerald-500';
  let badgeText = 'On Track';
  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (isOverBudget) {
    statusColor = 'bg-rose-500';
    badgeText = 'Budget Exceeded';
    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (isNearBudget) {
    statusColor = 'bg-amber-500';
    badgeText = 'Near Limit (≥ 80%)';
    badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${badgeClass}`}>
              {badgeText}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        {onEditBudget && (
          <button
            onClick={onEditBudget}
            className="self-start sm:self-auto text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            Adjust Budget
          </button>
        )}
      </div>

      {/* Warning/Alert Banner if 80%+ or over */}
      {isOverBudget && (
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs leading-relaxed animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Over-Budget Alert: </strong>
            You have spent {formatCurrency(Math.abs(remainingAmount))} more than your monthly allocation of {formatCurrency(budgetAmount)}. Review non-essential expenses to curb further deficit.
          </div>
        </div>
      )}

      {isNearBudget && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Caution: </strong>
            You have consumed {formatPercentage(usagePercent)} of your budget. Only {formatCurrency(remainingAmount)} remains for the rest of this month.
          </div>
        </div>
      )}

      {/* Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>{formatPercentage(usagePercent)} Used</span>
          <span>{isOverBudget ? `Deficit: ${formatCurrency(Math.abs(remainingAmount))}` : `${formatCurrency(remainingAmount)} Left`}</span>
        </div>
        <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
          <div
            className={`h-full rounded-full transition-all duration-700 ${statusColor}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      </div>

      {/* Grid of Key Budget Numbers */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-center">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-semibold uppercase text-slate-400">Total Budget</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{formatCurrency(budgetAmount)}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-[11px] font-semibold uppercase text-slate-400">Spent So Far</p>
          <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{formatCurrency(spentAmount)}</p>
        </div>
        <div className={`p-2 rounded-xl border ${isOverBudget ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
          <p className={`text-[11px] font-semibold uppercase ${isOverBudget ? 'text-rose-500' : 'text-slate-400'}`}>
            {isOverBudget ? 'Deficit' : 'Remaining'}
          </p>
          <p className={`text-sm sm:text-base font-bold mt-0.5 ${isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {isOverBudget ? `-${formatCurrency(Math.abs(remainingAmount))}` : formatCurrency(remainingAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};
