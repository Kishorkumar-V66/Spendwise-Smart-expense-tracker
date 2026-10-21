import React from 'react';
import * as Icons from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  iconName = 'DollarSign',
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  color = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue'
  progress,
  className = '',
}) => {
  const IconComponent = Icons[iconName] || Icons.CircleDot;

  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-50/70 text-indigo-600 border-indigo-100',
      badge: 'bg-indigo-50 text-indigo-700',
      bar: 'bg-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700',
      bar: 'bg-emerald-500',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600 border-amber-100',
      badge: 'bg-amber-50 text-amber-700',
      bar: 'bg-amber-500',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 border-rose-100',
      badge: 'bg-rose-50 text-rose-700',
      bar: 'bg-rose-500',
    },
    blue: {
      bg: 'bg-blue-50/70 text-blue-600 border-blue-100',
      badge: 'bg-blue-50 text-blue-700',
      bar: 'bg-blue-600',
    },
  };

  const currentTheme = colorStyles[color] || colorStyles.indigo;

  return (
    <div
      className={`relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl border ${currentTheme.bg}`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {typeof progress === 'number' && (
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Usage</span>
            <span className={progress > 100 ? 'text-rose-600 font-bold' : progress >= 80 ? 'text-amber-600 font-bold' : 'text-slate-700'}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress > 100
                  ? 'bg-rose-500'
                  : progress >= 80
                  ? 'bg-amber-500'
                  : currentTheme.bar
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {(subtitle || trend) && (
        <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded ${
                trendType === 'positive'
                  ? 'bg-emerald-50 text-emerald-700'
                  : trendType === 'negative'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
