import React, { useState } from 'react';
import { Database, GitFork, Key, Link2, Table, Info, ArrowRight } from 'lucide-react';
import { DatabaseSchema, TableDefinition } from '../../types';

interface SchemaERDViewProps {
  schema: DatabaseSchema;
  onSelectTableForData: (table: TableDefinition) => void;
  onQueryTable: (tableName: string) => void;
}

export const SchemaERDView: React.FC<SchemaERDViewProps> = ({
  schema,
  onSelectTableForData,
  onQueryTable
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Extract relationships
  const relationships: {
    sourceTable: string;
    sourceCol: string;
    targetTable: string;
    targetCol: string;
  }[] = [];

  schema.tables.forEach(table => {
    table.columns.forEach(col => {
      if (col.isForeign && col.foreignRef) {
        relationships.push({
          sourceTable: table.name,
          sourceCol: col.name,
          targetTable: col.foreignRef.table,
          targetCol: col.foreignRef.column
        });
      }
    });
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 sm:p-6 overflow-y-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="h-5 w-5 text-brand-400" />
            <h1 className="text-lg font-bold text-white">
              Entity Relationship Diagram (ERD)
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
              Section 15.3 Schema Graph
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual relationship graph mapping foreign key constraints and primary keys in <strong className="text-slate-200">{schema.name}</strong>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-amber-400" />
            <span>Primary Key (PK)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Foreign Key (FK)</span>
          </div>
          <div className="flex items-center gap-1.5 text-brand-400 font-semibold">
            <span>{relationships.length} Relationships</span>
          </div>
        </div>
      </div>

      {/* Relationships Summary Pill Strip */}
      <div className="mb-6 flex flex-wrap gap-2">
        {relationships.map((rel, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 shadow-sm"
          >
            <span className="font-semibold text-white">{rel.sourceTable}.{rel.sourceCol}</span>
            <ArrowRight className="h-3 w-3 text-brand-400" />
            <span className="text-brand-300 font-semibold">{rel.targetTable}.{rel.targetCol}</span>
          </div>
        ))}
      </div>

      {/* ERD Table Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schema.tables.map((table) => {
          const isHighlighted = selectedTable === table.name;
          const relatedRels = relationships.filter(
            r => r.sourceTable === table.name || r.targetTable === table.name
          );

          return (
            <div
              key={table.name}
              onClick={() => setSelectedTable(isHighlighted ? null : table.name)}
              className={`rounded-xl border transition-all shadow-lg overflow-hidden cursor-pointer ${
                isHighlighted
                  ? 'border-brand-500 bg-slate-900 ring-2 ring-brand-500/50 shadow-brand-500/10'
                  : 'border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-850 border-b border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <Table className="h-4 w-4 text-brand-400 shrink-0" />
                  <h3 className="font-mono font-bold text-white text-sm truncate">{table.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {table.rowCount} rows
                  </span>
                </div>
              </div>

              {/* Table Description */}
              <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 text-[11px] text-slate-400">
                {table.description}
              </div>

              {/* Columns Table */}
              <div className="divide-y divide-slate-800/50 text-xs font-mono">
                {table.columns.map((col) => (
                  <div
                    key={col.name}
                    className={`flex items-center justify-between px-4 py-2 hover:bg-slate-800/40 transition-colors ${
                      col.isPrimary ? 'bg-amber-500/5' : col.isForeign ? 'bg-indigo-500/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {col.isPrimary ? (
                        <Key className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      ) : col.isForeign ? (
                        <Link2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-600 shrink-0 ml-1"></span>
                      )}
                      <span className={`truncate ${col.isPrimary ? 'text-amber-300 font-semibold' : col.isForeign ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {col.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[11px]">
                      <span className="text-slate-500">{col.type}</span>
                      {col.foreignRef && (
                        <span className="text-[10px] text-indigo-300 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-700/50">
                          &rarr; {col.foreignRef.table}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTableForData(table);
                  }}
                  className="text-slate-400 hover:text-brand-300 font-medium"
                >
                  Preview Data &rarr;
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQueryTable(table.name);
                  }}
                  className="text-brand-400 hover:text-brand-300 font-semibold"
                >
                  Query Table
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
