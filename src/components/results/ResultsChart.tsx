import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Layers, Hash } from 'lucide-react';
import { QueryResult } from '../../types';

interface ResultsChartProps {
  result: QueryResult;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ result }) => {
  if (!result.rows.length) return null;

  // Find numerical columns and label column
  const cols = result.columns;
  const numCols = cols.filter(c => 
    result.rows.some(r => typeof r[c] === 'number')
  );

  const labelCol = cols.find(c => !numCols.includes(c)) || cols[0];
  const [selectedNumCol, setSelectedNumCol] = useState<string>(numCols[0] || cols[0]);

  if (numCols.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
        No numeric columns detected in this result set to generate analytical charts.
      </div>
    );
  }

  // Calculate stats
  const values = result.rows.map(r => Number(r[selectedNumCol]) || 0);
  const maxVal = Math.max(...values, 1);
  const totalVal = values.reduce((a, b) => a + b, 0);
  const avgVal = totalVal / (values.length || 1);

  return (
    <div className="p-4 sm:p-6 bg-slate-950/70 rounded-xl border border-slate-800 space-y-6">
      {/* Chart Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Interactive Visual Data Charts (Section 15.3)
          </h4>
        </div>

        {/* Measure Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Metric Column:</span>
          <select
            value={selectedNumCol}
            onChange={(e) => setSelectedNumCol(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
          >
            {numCols.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] text-slate-500 font-mono uppercase">Total Sum</div>
          <div className="text-lg font-bold text-brand-300 font-mono mt-0.5">
            {totalVal > 1000 ? totalVal.toLocaleString() : totalVal.toFixed(2)}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] text-slate-500 font-mono uppercase">Average Mean</div>
          <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">
            {avgVal.toFixed(1)}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] text-slate-500 font-mono uppercase">Peak Value</div>
          <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">
            {maxVal.toLocaleString()}
          </div>
        </div>

        <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60">
          <div className="text-[10px] text-slate-500 font-mono uppercase">Data Points</div>
          <div className="text-lg font-bold text-sky-300 font-mono mt-0.5">
            {result.rows.length} rows
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart Visualization */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>{labelCol.toUpperCase()}</span>
          <span>{selectedNumCol.toUpperCase()}</span>
        </div>

        <div className="space-y-2.5">
          {result.rows.map((row, idx) => {
            const label = String(row[labelCol] || `Item #${idx + 1}`);
            const val = Number(row[selectedNumCol]) || 0;
            const pct = Math.min(Math.round((val / maxVal) * 100), 100);

            return (
              <div key={idx} className="group flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 truncate max-w-[200px] sm:max-w-xs group-hover:text-white transition-colors">
                    {label}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {val.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
