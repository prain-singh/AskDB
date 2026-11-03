import React from 'react';
import { BookOpen, HelpCircle, ArrowRight, Table, Filter, ListOrdered, Layers } from 'lucide-react';

interface SqlExplainerProps {
  sql: string;
  explanation: string;
}

export const SqlExplainer: React.FC<SqlExplainerProps> = ({ sql, explanation }) => {
  if (!sql) return null;

  // Breakdown clauses
  const clauses: { name: string; content: string; icon: any; desc: string }[] = [];

  const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM/is);
  if (selectMatch) {
    clauses.push({
      name: 'SELECT Clause',
      content: selectMatch[1].trim(),
      icon: Table,
      desc: 'Determines which columns, aggregates, or calculated expressions to retrieve from the database.'
    });
  }

  const fromMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+(\s+[a-zA-Z0-9_]+)?)/i);
  if (fromMatch) {
    clauses.push({
      name: 'FROM Clause',
      content: fromMatch[1].trim(),
      icon: Layers,
      desc: 'Specifies the primary database table supplying the rows.'
    });
  }

  const joinMatch = sql.match(/(INNER|LEFT|RIGHT)?\s*JOIN\s+.*?(?=WHERE|GROUP|ORDER|LIMIT|;|$)/is);
  if (joinMatch) {
    clauses.push({
      name: 'JOIN Clause',
      content: joinMatch[0].trim(),
      icon: ArrowRight,
      desc: 'Merges records from related relational tables based on matching foreign key constraints.'
    });
  }

  const whereMatch = sql.match(/WHERE\s+(.*?)(?=GROUP|ORDER|LIMIT|;|$)/is);
  if (whereMatch) {
    clauses.push({
      name: 'WHERE Clause',
      content: whereMatch[1].trim(),
      icon: Filter,
      desc: 'Restricts query results to only rows satisfying this boolean condition.'
    });
  }

  const groupMatch = sql.match(/GROUP BY\s+(.*?)(?=HAVING|ORDER|LIMIT|;|$)/is);
  if (groupMatch) {
    clauses.push({
      name: 'GROUP BY Clause',
      content: groupMatch[1].trim(),
      icon: Layers,
      desc: 'Collapses rows that have matching values into summary rows for aggregate calculation.'
    });
  }

  const orderMatch = sql.match(/ORDER BY\s+(.*?)(?=LIMIT|;|$)/is);
  if (orderMatch) {
    clauses.push({
      name: 'ORDER BY Clause',
      content: orderMatch[1].trim(),
      icon: ListOrdered,
      desc: 'Sorts the resulting rows ascending (ASC) or descending (DESC).'
    });
  }

  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    clauses.push({
      name: 'LIMIT Clause',
      content: `LIMIT ${limitMatch[1]}`,
      icon: HelpCircle,
      desc: `Caps output to a maximum of ${limitMatch[1]} records for optimal query latency.`
    });
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-brand-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Query Explanation & Clause Analysis
        </h4>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
        {explanation}
      </p>

      {clauses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
          {clauses.map((clause, idx) => {
            const Icon = clause.icon;
            return (
              <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-brand-300 mb-1">
                  <Icon className="h-3.5 w-3.5 text-brand-400" />
                  <span>{clause.name}</span>
                </div>
                <div className="font-mono text-[11px] text-amber-200/90 truncate bg-slate-900 px-2 py-1 rounded border border-slate-800 mb-1">
                  {clause.content}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {clause.desc}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
