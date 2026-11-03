export type DatabaseEngine = 'MySQL' | 'PostgreSQL';

export interface ColumnDefinition {
  name: string;
  type: string;
  isPrimary: boolean;
  isForeign: boolean;
  foreignRef?: {
    table: string;
    column: string;
  };
  isNullable: boolean;
  description?: string;
}

export interface TableDefinition {
  name: string;
  description: string;
  rowCount: number;
  columns: ColumnDefinition[];
  data: Record<string, any>[];
}

export interface DatabaseSchema {
  id: string;
  name: string;
  engine: DatabaseEngine;
  version: string;
  host: string;
  port: number;
  database: string;
  user: string;
  tables: TableDefinition[];
  ssl: boolean;
  isDemo?: boolean;
}

export interface QueryGenerationStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  details?: string;
  timestamp?: number;
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  code?: string;
  line?: number;
}

export interface ValidationResult {
  isValid: boolean;
  hasWarnings: boolean;
  issues: ValidationIssue[];
  isDestructive: boolean;
  allowedPolicy: boolean;
  syntaxPassed: boolean;
  schemaReferencesValid: boolean;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  totalRows: number;
  executionTimeMs: number;
  affectedRows?: number;
  rawSql: string;
  generatedAt: string;
  databaseName: string;
  engine: DatabaseEngine;
}

export interface QueryHistoryItem {
  id: string;
  question: string;
  sql: string;
  engine: DatabaseEngine;
  databaseName: string;
  timestamp: string;
  status: 'success' | 'failed' | 'validated';
  rowCount?: number;
  executionTimeMs?: number;
  isFavorite?: boolean;
}

export interface TestCaseItem {
  id: string;
  name: string;
  description: string;
  scenario: string;
  expectedResult: string;
  category: 'Connection' | 'Schema' | 'Generation' | 'Validation' | 'Execution' | 'Security';
  sampleInput?: any;
  status: 'untested' | 'passing' | 'failing';
  lastRunDetails?: string;
}
