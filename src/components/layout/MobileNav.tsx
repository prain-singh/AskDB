import React from 'react';
import { Terminal, GitFork, CheckCircle2, BookOpen, History } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'studio' | 'erd' | 'docs' | 'tests' | 'history';
  setActiveTab: (tab: 'studio' | 'erd' | 'docs' | 'tests' | 'history') => void;
  historyCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  historyCount
}) => {
  interface TabItem {
    id: 'studio' | 'erd' | 'docs' | 'tests' | 'history';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const tabs: TabItem[] = [
    { id: 'studio', label: 'Studio', icon: Terminal },
    { id: 'erd', label: 'Schema ERD', icon: GitFork },
    { id: 'tests', label: 'Test Suite', icon: CheckCircle2 },
    { id: 'docs', label: 'Docs', icon: BookOpen },
    { id: 'history', label: 'History', icon: History, badge: historyCount }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all relative ${
              isActive
                ? 'text-brand-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-brand-400 scale-110' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="absolute top-0 right-2 rounded-full bg-brand-500 px-1 text-[9px] font-bold text-white leading-none py-0.5">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
