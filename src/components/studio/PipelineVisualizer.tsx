import React from 'react';
import { BrainCircuit, Database, Code2, ShieldCheck, Check, Clock } from 'lucide-react';
import { QueryGenerationStep } from '../../types';

interface PipelineVisualizerProps {
  steps: QueryGenerationStep[];
  isGenerating: boolean;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  isGenerating
}) => {
  const icons = [BrainCircuit, Database, Code2, ShieldCheck];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <BrainCircuit className="h-3.5 w-3.5 text-brand-400" />
          NL-to-SQL Processing Pipeline (Section 7.3 & 9.2)
        </span>
        <span className="text-slate-500 text-[11px] font-mono">
          {isGenerating ? 'Synthesizing query...' : 'Pipeline Ready'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {steps.map((step, idx) => {
          const Icon = icons[idx] || Code2;
          const isDone = step.status === 'completed';
          const isCurrent = step.status === 'in_progress';
          const isErr = step.status === 'error';

          return (
            <div
              key={step.id}
              className={`rounded-lg border p-2.5 transition-all text-left ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300'
                  : isCurrent
                  ? 'border-brand-500 bg-brand-500/10 text-brand-300 animate-pulse'
                  : isErr
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Step 0{idx + 1}
                </span>
                {isDone ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Clock className="h-3.5 w-3.5 text-brand-400 animate-spin" />
                ) : (
                  <Icon className="h-3.5 w-3.5 text-slate-600" />
                )}
              </div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {step.title}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {step.details || 'Awaiting query...'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
