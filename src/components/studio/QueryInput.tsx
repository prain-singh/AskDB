import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  CornerDownLeft, 
  Lightbulb, 
  RotateCcw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { DatabaseEngine } from '../../types';
import { INITIAL_PROMPT_SUGGESTIONS } from '../../data/sampleDatabases';

interface QueryInputProps {
  question: string;
  setQuestion: (q: string) => void;
  onGenerate: (overrideQuestion?: string) => void;
  isGenerating: boolean;
  engine: DatabaseEngine;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  question,
  setQuestion,
  onGenerate,
  isGenerating,
  engine
}) => {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isGenerating) {
        onGenerate();
      }
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    setQuestion(prompt);
    onGenerate(prompt);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-xl">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Natural Language Question (FR-05)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Target Dialect:</span>
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
            engine === 'MySQL'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
          }`}>
            {engine} SQL
          </span>
        </div>
      </div>

      {/* Input box */}
      <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 p-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Ask a question in plain English (e.g., 'Find the five highest-paid employees' or 'Show customers from Chennai')..."
          className="w-full resize-none bg-transparent px-2 py-1 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-slate-900 px-2 text-xs">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Press</span>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 border border-slate-700">Enter</kbd>
            <span>to generate SQL (FR-07)</span>
          </div>

          <div className="flex items-center gap-2">
            {question && (
              <button
                type="button"
                onClick={() => setQuestion('')}
                className="text-slate-500 hover:text-slate-300 p-1"
                title="Clear question"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onGenerate()}
              disabled={!question.trim() || isGenerating}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 px-3.5 py-1.5 font-semibold text-white hover:from-brand-500 hover:to-indigo-500 transition-all shadow-md shadow-brand-500/20 disabled:opacity-50 text-xs sm:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate SQL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-medium">Recommended Example Questions (Appendix A)</span>
          </div>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-[11px] text-slate-500 hover:text-slate-300"
          >
            {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
          </button>
        </div>

        {showSuggestions && (
          <div className="flex flex-wrap gap-2">
            {INITIAL_PROMPT_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item.prompt)}
                className="group flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 hover:border-brand-500/60 hover:bg-slate-800 hover:text-white transition-all text-left"
              >
                <span className="truncate max-w-[220px] sm:max-w-none">{item.prompt}</span>
                <ChevronRight className="h-3 w-3 text-slate-600 group-hover:text-brand-400 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
