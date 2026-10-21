import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  DollarSign,
  PieChart,
} from 'lucide-react';

export const SmartInsights = ({ insights = [], limit = null }) => {
  const displayInsights = limit ? insights.slice(0, limit) : insights;

  const getStyleForType = (type) => {
    switch (type) {
      case 'danger':
        return {
          card: 'bg-rose-50/60 border-rose-200/80 text-rose-950',
          iconBg: 'bg-rose-100 text-rose-600',
          badge: 'bg-rose-100 text-rose-700',
          Icon: AlertTriangle,
        };
      case 'warning':
        return {
          card: 'bg-amber-50/60 border-amber-200/80 text-amber-950',
          iconBg: 'bg-amber-100 text-amber-600',
          badge: 'bg-amber-100 text-amber-700',
          Icon: AlertTriangle,
        };
      case 'success':
        return {
          card: 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950',
          iconBg: 'bg-emerald-100 text-emerald-600',
          badge: 'bg-emerald-100 text-emerald-700',
          Icon: CheckCircle2,
        };
      case 'neutral':
      case 'info':
      default:
        return {
          card: 'bg-indigo-50/50 border-indigo-100 text-indigo-950',
          iconBg: 'bg-indigo-100 text-indigo-600',
          badge: 'bg-indigo-100 text-indigo-700',
          Icon: Sparkles,
        };
    }
  };

  if (!displayInsights || displayInsights.length === 0) {
    return (
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/70 text-center text-xs text-slate-500">
        <Sparkles className="w-5 h-5 mx-auto text-slate-400 mb-1.5" />
        <p>Keep logging your daily expenses to unlock rule-based financial insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayInsights.map((insight) => {
        const { card, iconBg, badge, Icon } = getStyleForType(insight.type);
        return (
          <div
            key={insight.id}
            className={`p-4 rounded-2xl border shadow-xs transition-all hover:shadow-sm flex items-start gap-3.5 ${card}`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold uppercase tracking-wider">{insight.title}</h4>
                {insight.tag && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge}`}>
                    {insight.tag}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                {insight.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
