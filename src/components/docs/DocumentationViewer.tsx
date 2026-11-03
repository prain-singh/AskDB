import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  ShieldCheck, 
  Users, 
  Database, 
  CheckCircle2, 
  Terminal,
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ASKDB_DOCUMENTATION, GLOSSARY_ITEMS } from '../../data/documentation';

export const DocumentationViewer: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = ASKDB_DOCUMENTATION.filter(sec => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.content.toLowerCase().includes(q) ||
      sec.subsections?.some(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
    );
  });

  const activeSection = ASKDB_DOCUMENTATION.find(s => s.id === activeSectionId) || ASKDB_DOCUMENTATION[0];

  return (
    <div className="flex h-full flex-col lg:flex-row bg-slate-950 overflow-hidden">
      {/* Docs Sidebar / Table of Contents */}
      <div className="w-full lg:w-72 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col shrink-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-brand-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Project Documentation (v1.0)
          </h2>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Nav list */}
        <nav className="flex-1 space-y-1">
          {filteredSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                activeSectionId === sec.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-[11px] opacity-75">{sec.number}.</span>
                <span className="truncate">{sec.title}</span>
              </div>
              <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
            </button>
          ))}

          <button
            onClick={() => setActiveSectionId('glossary')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
              activeSectionId === 'glossary'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-[11px] opacity-75">App.</span>
              <span className="truncate">Appendix B. Glossary</span>
            </div>
            <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
          </button>
        </nav>
      </div>

      {/* Docs Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-400 font-bold">
                  PROJECT SPECIFICATION
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  ASKDB — Natural Language to SQL Platform
                </h1>
              </div>
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30">
                Next.js & React.js
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Target Databases</span>
                <strong className="text-slate-200">MySQL & PostgreSQL</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Query Language</span>
                <strong className="text-slate-200">ANSI & Dialect SQL</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Project Date</span>
                <strong className="text-slate-200">September 2024</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Doc Version</span>
                <strong className="text-emerald-400 font-mono">1.0 Release</strong>
              </div>
            </div>
          </div>

          {/* Section Body */}
          {activeSectionId === 'glossary' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-400" />
                Appendix B. Glossary
              </h2>
              <p className="text-xs text-slate-400">
                Core terminology and domain concepts utilized across ASKDB.
              </p>

              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 border-b border-slate-800 font-mono text-slate-400">
                    <tr>
                      <th className="px-4 py-3 w-40">Term</th>
                      <th className="px-4 py-3">Definition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                    {GLOSSARY_ITEMS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-mono font-bold text-brand-300 whitespace-nowrap">
                          {item.term}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {item.def}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-brand-400">
                    SECTION {activeSection.number}
                  </span>
                  {activeSection.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {activeSection.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white">
                  {activeSection.title}
                </h2>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80">
                {activeSection.content}
              </div>

              {activeSection.subsections && activeSection.subsections.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Detailed Subsections
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSection.subsections.map((sub, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1.5"
                      >
                        <h4 className="text-xs font-bold text-brand-300 font-mono">
                          {sub.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
