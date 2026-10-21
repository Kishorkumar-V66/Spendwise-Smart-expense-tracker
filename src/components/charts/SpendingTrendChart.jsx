import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTrendTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-semibold text-slate-300">{data.date}</p>
        <div className="mt-1 flex items-center justify-between gap-4">
          <span className="text-slate-400">Daily Spend:</span>
          <span className="font-bold text-indigo-300">{formatCurrency(data.amount)}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-4">
          <span className="text-slate-400">Cumulative:</span>
          <span className="font-bold text-emerald-400">{formatCurrency(data.cumulative)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const SpendingTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
        <p>No trend data available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => formatCurrency(value, { compact: true })}
          />
          <Tooltip content={<CustomTrendTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#4F46E5"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#spendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
