import React, { useState } from 'react';
import { 
  Database, 
  Table, 
  Key, 
  Link2, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Eye, 
  GitFork, 
  PlayCircle,
  Hash,
  Type,
  Calendar,
  Layers
} from 'lucide-react';
import { DatabaseSchema, TableDefinition } from '../../types';

interface SchemaExplorerProps {
  schema: DatabaseSchema;
  onSelectTableForData: (table: TableDefinition) => void;
  onQueryTable: (tableName: string) => void;
  onOpenERD: () => void;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({
  schema,
  onSelectTableForData,
  onQueryTable,
  onOpenERD
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [schema.tables[0]?.name || '']: true
  });

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const filteredTables = schema.tables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.columns.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getColIcon = (type: string) => {
    const upper = type.toUpperCase();
    if (upper.includes('INT') || upper.includes('NUMERIC') || upper.includes('DECIMAL') || upper.includes('FLOAT')) {
      return <Hash className="h-3 w-3 text-emerald-400" />;
    }
    if (upper.includes('DATE') || upper.includes('TIME')) {
      return <Calendar className="h-3 w-3 text-amber-400" />;
    }
    return <Type className="h-3 w-3 text-sky-400" />;
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 border-r border-slate-800 select-none">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-brand-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Schema Explorer (FR-04)
            </h2>
          </div>
          <button
            onClick={onOpenERD}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/20 transition-all"
            title="Open Interactive Entity Relationship Diagram"
          >
            <GitFork className="h-3 w-3" />
            <span>ERD Graph</span>
          </button>
        </div>

        {/* Database stats */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 font-mono">
          <span className="truncate">{schema.database}</span>
          <span className="text-slate-500">{schema.tables.length} Tables</span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tables & columns..."
            className="w-full rounded-lg border border-slate-800 bg-slate-950/80 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tables list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/40">
        {filteredTables.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            No tables or columns match "{searchTerm}"
          </div>
        ) : (
          filteredTables.map((table) => {
            const isExpanded = !!expandedTables[table.name];
            return (
              <div key={table.name} className="pt-1.5 first:pt-0">
                {/* Table Header Row */}
                <div 
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    isExpanded ? 'bg-slate-800/70 text-white' : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                  onClick={() => toggleTable(table.name)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    )}
                    <Table className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                    <span className="font-mono text-xs font-semibold truncate">{table.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {table.rowCount} rows
                    </span>

                    {/* Quick preview icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTableForData(table);
                      }}
                      className="p-1 text-slate-400 hover:text-brand-300 hover:bg-slate-700/60 rounded"
                      title={`Preview data for ${table.name}`}
                    >
                      <Eye className="h-3 w-3" />
                    </button>

                    {/* Quick query icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQueryTable(table.name);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/60 rounded"
                      title={`Generate SELECT * FROM ${table.name}`}
                    >
                      <PlayCircle className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Columns List */}
                {isExpanded && (
                  <div className="ml-4 pl-3 border-l border-slate-800 my-1 space-y-1">
                    <p className="text-[10px] text-slate-500 italic px-1 pt-0.5">
                      {table.description}
                    </p>
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between py-1 px-1.5 rounded text-xs hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 font-mono"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {col.isPrimary ? (
                            <span title="Primary Key (PK)"><Key className="h-3 w-3 text-amber-400 shrink-0" /></span>
                          ) : col.isForeign ? (
                            <span title={`Foreign Key referencing ${col.foreignRef?.table}.${col.foreignRef?.column}`}><Link2 className="h-3 w-3 text-indigo-400 shrink-0" /></span>
                          ) : (
                            getColIcon(col.type)
                          )}
                          <span className={`truncate ${col.isPrimary ? 'text-amber-200 font-semibold' : ''}`}>
                            {col.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 text-[10px]">
                          <span className="text-slate-500">{col.type}</span>
                          {col.foreignRef && (
                            <span 
                              className="text-[9px] text-indigo-300/80 bg-indigo-950/60 px-1 py-0.2 rounded border border-indigo-800/40 cursor-help"
                              title={`FK -> ${col.foreignRef.table}.${col.foreignRef.column}`}
                            >
                              FK
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
