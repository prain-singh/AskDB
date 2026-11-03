import React, { useState } from 'react';
import { 
  History, 
  Star, 
  Trash2, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  Database
} from 'lucide-react';
import { QueryHistoryItem } from '../../types';

interface QueryHistoryDrawerProps {
  history: QueryHistoryItem[];
  onSelectQuery: (item: QueryHistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const QueryHistoryDrawer: React.FC<QueryHistoryDrawerProps> = ({
  history,
  onSelectQuery,
  onToggleFavorite,
  onClearHistory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavs, setFilterFavs] = useState(false);

  const filtered = history.filter(item => {
    if (filterFavs && !item.isFavorite) return false;
    if (!searchTerm) return true;
    return (
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sql.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.databaseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 sm:p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand-400" />
            <h1 className="text-lg font-bold text-white">
              Query History & Saved Queries
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
              Section 15.3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse, favorite, and restore previous natural language queries and generated SQL statements
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search query history..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setFilterFavs(!filterFavs)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            filterFavs
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${filterFavs ? 'fill-current' : ''}`} />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* Query Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500">
          <History className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No Query History</p>
          <p className="text-xs text-slate-500 mt-1">
            Questions you submit and execute in Query Studio will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-slate-800 bg-slate-900/90 p-4 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    item.engine === 'MySQL'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {item.engine}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {item.databaseName}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      item.isFavorite
                        ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                        : 'border-slate-800 text-slate-500 hover:text-white'
                    }`}
                    title="Bookmark query"
                  >
                    <Star className={`h-3.5 w-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSelectQuery(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600 hover:text-white text-xs font-semibold transition-all"
                  >
                    <span>Load in Studio</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-sm font-semibold text-white mb-2">
                "{item.question}"
              </h3>

              {/* SQL snippet */}
              <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-xs text-emerald-400/90 overflow-x-auto border border-slate-800/80">
                {item.sql}
              </div>

              {/* Metrics */}
              {item.rowCount !== undefined && (
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-mono">
                  <span>Returned: <strong className="text-slate-300">{item.rowCount} rows</strong></span>
                  {item.executionTimeMs && (
                    <span>Latency: <strong className="text-slate-300">{item.executionTimeMs}ms</strong></span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
