import React from 'react';
import { 
  Database, 
  Terminal, 
  GitFork, 
  BookOpen, 
  CheckCircle2, 
  History, 
  Settings, 
  ShieldCheck,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { DatabaseSchema } from '../../types';

interface NavbarProps {
  activeTab: 'studio' | 'erd' | 'docs' | 'tests' | 'history';
  setActiveTab: (tab: 'studio' | 'erd' | 'docs' | 'tests' | 'history') => void;
  activeSchema: DatabaseSchema;
  onOpenConnectionModal: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSchema,
  onOpenConnectionModal,
  historyCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-brand-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/25">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-lg sm:text-xl">
                ASK<span className="text-brand-400">DB</span>
              </span>
              <span className="hidden xs:inline-flex items-center rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-400 border border-brand-500/20">
                v1.0 • NL-to-SQL
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium">
              Natural Language Relational Database Query Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Query Studio
          </button>

          <button
            onClick={() => setActiveTab('erd')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'erd'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <GitFork className="h-4 w-4" />
            Schema ERD
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tests'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Test Suite (TC 1-10)
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'docs'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </button>
        </nav>

        {/* Right Action: Connection Badge & Quick Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History Button */}
          <button
            onClick={() => setActiveTab('history')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-slate-800 border-brand-500 text-white'
                : 'border-slate-800 bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="View Query History"
          >
            <History className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Active Database Switcher Pill */}
          <button
            onClick={onOpenConnectionModal}
            className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-brand-500 hover:bg-slate-800 transition-all shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white truncate max-w-[120px] md:max-w-[160px]">
                  {activeSchema.name}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  activeSchema.engine === 'MySQL' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                }`}>
                  {activeSchema.engine}
                </span>
              </div>
            </div>
            <span className="sm:hidden font-mono text-[11px] font-bold text-brand-300">
              {activeSchema.engine}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
};
