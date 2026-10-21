import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-semibold text-slate-300">{data.fullLabel || label}</p>
        <p className="font-bold text-base text-indigo-400 mt-0.5">
          {formatCurrency(data.amount)}
        </p>
        <p className="text-slate-400 text-[11px] mt-0.5">
          {data.count} transaction{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

export const MonthlyChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
        <p>No monthly history available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => formatCurrency(value, { compact: true })}
          />
          <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
          <Bar
            dataKey="amount"
            fill="#4F46E5"
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
