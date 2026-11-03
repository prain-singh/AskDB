import React, { useState } from 'react';
import { 
  Table, 
  BarChart3, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  FileQuestion,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { QueryResult } from '../../types';
import { ExportDropdown } from './ExportDropdown';
import { ResultsChart } from './ResultsChart';

interface ResultsTableProps {
  result: QueryResult | null;
  error: string | null;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ result, error }) => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-rose-200 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="h-6 w-6 text-rose-400 shrink-0" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Execution / Validation Error (FR-12 & Section 10.5)
          </h3>
        </div>
        <p className="font-mono text-xs text-rose-300 bg-rose-950/70 p-3 rounded-xl border border-rose-800/60 leading-relaxed">
          {error}
        </p>
        <p className="text-xs text-rose-400/80 mt-3">
          Check column names, syntax matching your database engine, or verify read-only permission policy.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-500">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 mx-auto mb-3 text-slate-600">
          <Table className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-400">No Query Results Yet</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Generate and execute a query above to view the structured records, metrics, and data charts.
        </p>
      </div>
    );
  }

  // TC-08: Empty result handling
  if (result.rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-xl space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 mx-auto text-amber-400 border border-amber-500/20">
          <FileQuestion className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Zero Matching Records (TC-08)</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            The query executed successfully and was accepted by {result.engine}, but returned 0 rows matching your WHERE criteria.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <span>Execution: <strong className="text-emerald-400">{result.executionTimeMs}ms</strong></span>
          <span>•</span>
          <span>Columns: {result.columns.join(', ')}</span>
        </div>
      </div>
    );
  }

  // Filter rows by search term
  const filteredRows = result.rows.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    if (!sortCol) return 0;
    const valA = a[sortCol];
    const valB = b[sortCol];
    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDir === 'asc' ? valA - valB : valB - valA;
    }
    return sortDir === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (colName: string) => {
    if (sortCol === colName) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortCol(null);
        setSortDir('asc');
      }
    } else {
      setSortCol(colName);
      setSortDir('asc');
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
      {/* Result Metrics Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-850 gap-3">
        {/* Left metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Query Results (Screen 4 / FR-11)
            </h3>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              {result.totalRows} rows returned
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3 text-slate-500" />
              {result.executionTimeMs}ms
            </span>
          </div>
        </div>

        {/* View Toggle (Table / Chart) & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'chart'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Chart (15.3)</span>
            </button>
          </div>

          <ExportDropdown result={result} />
        </div>
      </div>

      {viewMode === 'chart' ? (
        <ResultsChart result={result} />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900 p-3 gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter returned rows..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline">
                Showing {Math.min(filteredRows.length, (currentPage - 1) * pageSize + 1)}–
                {Math.min(filteredRows.length, currentPage * pageSize)} of {filteredRows.length}
              </span>

              {/* Page size select */}
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white focus:outline-none font-mono"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950/90 sticky top-0 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider select-none z-10">
                <tr>
                  <th className="px-3 py-2.5 w-10 text-center text-slate-600">#</th>
                  {result.columns.map((col) => {
                    const isSorted = sortCol === col;
                    return (
                      <th
                        key={col}
                        onClick={() => toggleSort(col)}
                        className="px-4 py-2.5 whitespace-nowrap cursor-pointer hover:bg-slate-800/60 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col}</span>
                          {isSorted ? (
                            sortDir === 'asc' ? (
                              <ArrowUp className="h-3 w-3 text-brand-400" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-brand-400" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-600 opacity-60" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                {paginatedRows.map((row, rIdx) => {
                  const globalIdx = (currentPage - 1) * pageSize + rIdx + 1;
                  return (
                    <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-3 py-2 text-center text-slate-600 text-[10px]">
                        {globalIdx}
                      </td>
                      {result.columns.map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className="px-4 py-2 whitespace-nowrap text-slate-300">
                            {val === null || val === undefined ? (
                              <span className="italic text-slate-600 font-sans px-1.5 py-0.5 rounded bg-slate-800/50 text-[10px]">
                                null
                              </span>
                            ) : typeof val === 'number' ? (
                              <span className="text-emerald-400 font-medium">
                                {val.toLocaleString()}
                              </span>
                            ) : (
                              <span>{String(val)}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2 text-xs">
              <span className="text-slate-400">
                Page <strong className="text-white">{currentPage}</strong> of {totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
