import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold">{data.name}</span>
        </div>
        <div className="font-bold text-sm text-indigo-300">
          {formatCurrency(data.value)}
        </div>
        <div className="text-slate-400 text-[11px] mt-0.5">
          {data.percentage}% of total spending ({data.count} items)
        </div>
      </div>
    );
  }
  return null;
};

export const CategoryChart = ({ categories = [], totalAmount = 0 }) => {
  if (!categories || categories.length === 0 || totalAmount === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
        <p>No category spending recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-6">
      {/* Donut Chart */}
      <div className="w-full lg:w-1/2 h-64 sm:h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {categories.map((entry) => (
                <Cell key={`cell-${entry.id}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Total Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Total Spent
          </span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900">
            {formatCurrency(totalAmount, { compact: true })}
          </span>
        </div>
      </div>

      {/* Legend & Breakdown List */}
      <div className="w-full lg:w-1/2 space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-3 h-3 rounded-md flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-semibold text-slate-800 truncate">{cat.name}</span>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
              <span className="text-slate-400 ml-1.5 font-medium">({cat.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
