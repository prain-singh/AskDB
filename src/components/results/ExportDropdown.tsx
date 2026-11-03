import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, Copy, Check, ChevronDown } from 'lucide-react';
import { QueryResult } from '../../types';

interface ExportDropdownProps {
  result: QueryResult;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const exportCsv = () => {
    if (!result.rows.length) return;
    const headers = result.columns.join(',');
    const rows = result.rows.map(row => 
      result.columns.map(col => {
        let val = row[col];
        if (val === null || val === undefined) return '';
        val = String(val).replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          val = `"${val}"`;
        }
        return val;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `askdb_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const exportJson = () => {
    if (!result.rows.length) return;
    const jsonStr = JSON.stringify(result.rows, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `askdb_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const copyMarkdown = () => {
    if (!result.rows.length) return;
    const headerRow = `| ${result.columns.join(' | ')} |`;
    const separatorRow = `| ${result.columns.map(() => '---').join(' | ')} |`;
    const dataRows = result.rows.map(r => 
      `| ${result.columns.map(c => r[c] ?? 'NULL').join(' | ')} |`
    ).join('\n');
    const md = `${headerRow}\n${separatorRow}\n${dataRows}`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => {
      setCopiedMd(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
      >
        <Download className="h-3.5 w-3.5 text-slate-400" />
        <span>Export (15.3)</span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-30 py-1.5 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Export Format
          </div>

          <button
            onClick={exportCsv}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white text-left transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Export to CSV</span>
          </button>

          <button
            onClick={exportJson}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white text-left transition-colors"
          >
            <FileJson className="h-4 w-4 text-amber-400" />
            <span>Export to JSON</span>
          </button>

          <button
            onClick={copyMarkdown}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white text-left transition-colors"
          >
            {copiedMd ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-brand-400" />}
            <span>{copiedMd ? 'Copied Markdown!' : 'Copy as Markdown'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
