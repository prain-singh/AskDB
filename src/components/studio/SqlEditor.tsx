import React, { useState } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  Edit3, 
  Eye, 
  RotateCcw, 
  Code2, 
  Sparkles,
  Info,
  Terminal,
  Loader2
} from 'lucide-react';
import { DatabaseEngine } from '../../types';

interface SqlEditorProps {
  sql: string;
  setSql: (sql: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  isValid: boolean;
  engine: DatabaseEngine;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  sql,
  setSql,
  onExecute,
  isExecuting,
  isValid,
  engine
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    // Basic SQL formatter
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'GROUP BY', 'ORDER BY', 'LIMIT', 'OFFSET'];
    let formatted = sql;
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(reg, `\n${kw}`);
    });
    setSql(formatted.trim());
  };

  const lines = (sql || '').split('\n');

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-850 gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-brand-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            SQL Preview & Editor (Screen 3 / FR-08)
          </h3>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Dialect: {engine}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isEditing
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle Edit SQL Mode"
          >
            {isEditing ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            <span>{isEditing ? 'Preview Mode' : 'Edit SQL'}</span>
          </button>

          <button
            type="button"
            onClick={handleFormat}
            disabled={!sql}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Auto-format SQL"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Format</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!sql}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Copy SQL to Clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Execute Query Button */}
          <button
            type="button"
            onClick={onExecute}
            disabled={!sql || isExecuting || !isValid}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
            title="Execute approved statement against connected database (FR-10)"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Execute (FR-10)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative min-h-[140px] max-h-[280px] overflow-auto bg-slate-950 p-4 font-mono text-xs sm:text-sm">
        {isEditing ? (
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={Math.max(lines.length + 1, 4)}
            className="w-full bg-transparent font-mono text-emerald-400 focus:outline-none resize-none leading-relaxed"
            placeholder="Type or tweak your SQL query..."
          />
        ) : (
          <div className="flex">
            {/* Line numbers */}
            <div className="select-none pr-4 text-right text-slate-600 font-mono text-xs leading-relaxed">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code presentation */}
            <div className="flex-1 font-mono leading-relaxed whitespace-pre-wrap break-all text-slate-100">
              {sql ? (
                <span>
                  {lines.map((line, lIdx) => (
                    <div key={lIdx}>
                      {highlightSqlLine(line)}
                    </div>
                  ))}
                </span>
              ) : (
                <span className="text-slate-600 italic font-sans">
                  -- Submit a natural language question above to preview generated SQL.
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function highlightSqlLine(line: string) {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'GROUP BY', 'ORDER BY', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'IS', 'NULL', 'NOT', 'TRUE', 'FALSE', 'DROP', 'TRUNCATE', 'DELETE'];
  
  // Basic token highlight
  const words = line.split(/(\s+|,|\(|\)|;)/);
  return words.map((token, idx) => {
    const upper = token.toUpperCase();
    if (keywords.includes(upper)) {
      return (
        <span key={idx} className="text-indigo-400 font-bold">
          {token}
        </span>
      );
    }
    if (token.startsWith("'") || token.endsWith("'")) {
      return (
        <span key={idx} className="text-amber-300">
          {token}
        </span>
      );
    }
    if (token.startsWith("`") || token.startsWith('"')) {
      return (
        <span key={idx} className="text-sky-300">
          {token}
        </span>
      );
    }
    if (!isNaN(Number(token)) && token.trim() !== '') {
      return (
        <span key={idx} className="text-emerald-400">
          {token}
        </span>
      );
    }
    return <span key={idx}>{token}</span>;
  });
}
