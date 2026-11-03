import React from 'react';
import { Database, ShieldCheck, Activity, Clock, Terminal } from 'lucide-react';
import { DatabaseSchema } from '../../types';

interface StatusBarProps {
  activeSchema: DatabaseSchema;
  lastExecutionMs?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeSchema,
  lastExecutionMs
}) => {
  return (
    <footer className="hidden lg:flex h-7 w-full items-center justify-between border-t border-slate-800 bg-slate-950 px-4 text-[11px] text-slate-400 select-none">
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">{activeSchema.engine}</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-slate-400">{activeSchema.host}:{activeSchema.port}</span>
        </div>

        <span className="text-slate-700">|</span>

        {/* Database catalog */}
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3 text-brand-400" />
          <span className="text-slate-300 font-mono">{activeSchema.database}</span>
        </div>

        <span className="text-slate-700">|</span>

        {/* Security Policy */}
        <div className="flex items-center gap-1 text-emerald-400 font-medium">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Policy: Read-Only (Safe Exploration)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastExecutionMs !== undefined && (
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>Last query: <strong className="text-brand-300 font-mono">{lastExecutionMs}ms</strong></span>
          </div>
        )}

        <span className="text-slate-700">|</span>

        <div className="flex items-center gap-1">
          <span className="text-slate-500">Shortcuts:</span>
          <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-700">Enter</kbd>
          <span className="text-slate-500">to execute</span>
        </div>
      </div>
    </footer>
  );
};
