import React, { useState } from 'react';
import { X, Table, Search, Download, Database } from 'lucide-react';
import { TableDefinition } from '../../types';

interface SchemaTableModalProps {
  table: TableDefinition | null;
  onClose: () => void;
  onQueryThisTable: (tableName: string) => void;
}

export const SchemaTableModal: React.FC<SchemaTableModalProps> = ({
  table,
  onClose,
  onQueryThisTable
}) => {
  if (!table) return null;

  const [filterText, setFilterText] = useState('');

  const filteredData = table.data.filter(row => {
    if (!filterText) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Table className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">{table.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {table.rowCount} records
                </span>
              </div>
              <p className="text-xs text-slate-400">{table.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onQueryThisTable(table.name);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors"
            >
              Query Table in Studio
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter preview rows..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{filteredData.length}</strong> of {table.data.length} rows
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/80 sticky top-0 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                <tr>
                  {table.columns.map((col) => (
                    <th key={col.name} className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={col.isPrimary ? 'text-amber-400 font-bold' : col.isForeign ? 'text-indigo-400 font-bold' : 'text-slate-200'}>
                          {col.name}
                        </span>
                        <span className="text-[9px] text-slate-500 lowercase">({col.type})</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/50 font-mono">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    {table.columns.map((col) => {
                      const val = row[col.name];
                      return (
                        <td key={col.name} className="px-4 py-2.5 whitespace-nowrap text-slate-300">
                          {val === null || val === undefined ? (
                            <span className="italic text-slate-600 font-sans">NULL</span>
                          ) : typeof val === 'number' ? (
                            <span className="text-emerald-400 font-medium">{val.toLocaleString()}</span>
                          ) : (
                            <span>{String(val)}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
