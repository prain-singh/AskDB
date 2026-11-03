import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Info } from 'lucide-react';
import { ValidationResult } from '../../types';

interface ValidationBadgeProps {
  validation: ValidationResult | null;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ validation }) => {
  if (!validation) return null;

  const { isValid, hasWarnings, issues, isDestructive, syntaxPassed, schemaReferencesValid, allowedPolicy } = validation;

  return (
    <div className={`rounded-xl border p-3.5 transition-all text-xs ${
      !isValid
        ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
        : hasWarnings
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
        : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {!isValid ? (
            <XCircle className="h-4 w-4 text-rose-400" />
          ) : hasWarnings ? (
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
          <span className="font-bold text-xs uppercase tracking-wide">
            {!isValid
              ? 'Validation Failed (FR-09)'
              : hasWarnings
              ? 'Validation Passed with Advisories'
              : 'Validation Passed — Approved for Execution'}
          </span>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className={`px-2 py-0.5 rounded border ${
            syntaxPassed
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}>
            Syntax: {syntaxPassed ? 'OK' : 'ERR'}
          </span>

          <span className={`px-2 py-0.5 rounded border ${
            schemaReferencesValid
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}>
            Schema: {schemaReferencesValid ? 'Valid' : 'Ref Error'}
          </span>

          <span className={`px-2 py-0.5 rounded border ${
            allowedPolicy
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}>
            Policy: {allowedPolicy ? 'Safe (Read-Only)' : 'Blocked (Destructive)'}
          </span>
        </div>
      </div>

      {/* Issues list */}
      {issues.length > 0 && (
        <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-700/40 text-xs">
          {issues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {issue.type === 'error' ? (
                <span className="text-rose-400 font-bold shrink-0">•</span>
              ) : issue.type === 'warning' ? (
                <span className="text-amber-400 font-bold shrink-0">•</span>
              ) : (
                <Info className="h-3 w-3 text-sky-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{issue.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
