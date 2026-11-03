import { DatabaseSchema, ValidationResult, ValidationIssue } from '../types';

export function validateSql(sql: string, schema: DatabaseSchema): ValidationResult {
  const issues: ValidationIssue[] = [];
  const cleanSql = sql.trim();
  const upper = cleanSql.toUpperCase();

  if (!cleanSql) {
    return {
      isValid: false,
      hasWarnings: false,
      issues: [{ type: 'error', message: 'SQL query cannot be empty.' }],
      isDestructive: false,
      allowedPolicy: false,
      syntaxPassed: false,
      schemaReferencesValid: false
    };
  }

  // 1. Destructive Operations & Safety Policy Check
  const destructiveKeywords = ['DROP ', 'TRUNCATE ', 'ALTER TABLE', 'GRANT ', 'REVOKE '];
  let isDestructive = false;

  for (const kw of destructiveKeywords) {
    if (upper.includes(kw)) {
      isDestructive = true;
      issues.push({
        type: 'error',
        message: `Safety Policy Violation: Destructive operation '${kw.trim()}' is prohibited by the read-only policy.`,
        code: 'POLICY_DESTRUCTIVE_PROHIBITED'
      });
    }
  }

  // Check unrestricted DELETE
  if (upper.includes('DELETE FROM') && !upper.includes('WHERE')) {
    isDestructive = true;
    issues.push({
      type: 'error',
      message: 'Safety Policy Violation: Unrestricted DELETE without a WHERE clause is blocked.',
      code: 'POLICY_UNRESTRICTED_DELETE'
    });
  }

  // 2. Syntax Check (Parentheses & Quotes balance)
  let syntaxPassed = true;
  let openParen = 0;
  for (let i = 0; i < cleanSql.length; i++) {
    if (cleanSql[i] === '(') openParen++;
    if (cleanSql[i] === ')') openParen--;
    if (openParen < 0) {
      syntaxPassed = false;
      issues.push({
        type: 'error',
        message: 'Syntax Error: Unexpected closing parenthesis ")".',
        line: 1
      });
      break;
    }
  }
  if (openParen > 0) {
    syntaxPassed = false;
    issues.push({
      type: 'error',
      message: 'Syntax Error: Unclosed parenthesis "(".',
      line: 1
    });
  }

  // Check quotes balance
  const singleQuotes = (cleanSql.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    syntaxPassed = false;
    issues.push({
      type: 'error',
      message: 'Syntax Error: Unclosed single quote in string literal.',
      line: 1
    });
  }

  // Basic check for SQL command start
  if (!cleanSql.match(/^(SELECT|SHOW|DESCRIBE|EXPLAIN|WITH|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE)/i)) {
    syntaxPassed = false;
    issues.push({
      type: 'error',
      message: 'Syntax Error: Query must begin with a recognized SQL statement (e.g. SELECT).',
      line: 1
    });
  }

  // 3. Schema References Check
  let schemaReferencesValid = true;
  const availableTableNames = schema.tables.map(t => t.name.toLowerCase());
  const allAvailableColumns = new Set<string>();
  const tableColumnMap = new Map<string, Set<string>>();

  schema.tables.forEach(t => {
    const colSet = new Set(t.columns.map(c => c.name.toLowerCase()));
    tableColumnMap.set(t.name.toLowerCase(), colSet);
    t.columns.forEach(c => allAvailableColumns.add(c.name.toLowerCase()));
  });

  // Extract table names from FROM and JOIN
  const fromJoinMatches = cleanSql.matchAll(/\b(FROM|JOIN)\s+([a-zA-Z0-9_]+)/gi);
  const referencedTables: string[] = [];

  for (const match of fromJoinMatches) {
    const rawTable = match[2].toLowerCase();
    referencedTables.push(rawTable);
    if (!availableTableNames.includes(rawTable)) {
      schemaReferencesValid = false;
      issues.push({
        type: 'error',
        message: `Schema Reference Error: Table '${rawTable}' does not exist in database '${schema.name}'.`,
        code: 'UNKNOWN_TABLE'
      });
    }
  }

  // Check for unknown columns in WHERE or ORDER BY clauses (e.g. TC-06 test case)
  const whereMatch = cleanSql.match(/\bWHERE\s+([a-zA-Z0-9_.]+)/i);
  if (whereMatch) {
    const colCandidate = whereMatch[1].split('.').pop()?.toLowerCase();
    if (colCandidate && !['1', 'true', 'false'].includes(colCandidate) && !allAvailableColumns.has(colCandidate)) {
      schemaReferencesValid = false;
      issues.push({
        type: 'error',
        message: `Schema Reference Error: Unknown column '${colCandidate}' referenced in WHERE clause.`,
        code: 'UNKNOWN_COLUMN'
      });
    }
  }

  const orderByMatch = cleanSql.match(/\bORDER BY\s+([a-zA-Z0-9_.]+)/i);
  if (orderByMatch) {
    const colCandidate = orderByMatch[1].split('.').pop()?.toLowerCase();
    if (colCandidate && !allAvailableColumns.has(colCandidate)) {
      schemaReferencesValid = false;
      issues.push({
        type: 'error',
        message: `Schema Reference Error: Unknown column '${colCandidate}' referenced in ORDER BY clause.`,
        code: 'UNKNOWN_COLUMN'
      });
    }
  }

  // 4. Dialect Specific Warnings
  if (schema.engine === 'MySQL' && cleanSql.includes('"')) {
    issues.push({
      type: 'warning',
      message: 'Dialect Note: Double quotes are interpreted as ANSI strings or identifiers in MySQL depending on ANSI_QUOTES mode. Prefer backticks or standard string literals.',
      code: 'DIALECT_QUOTING'
    });
  }

  if (schema.engine === 'PostgreSQL' && cleanSql.includes('`')) {
    issues.push({
      type: 'warning',
      message: 'Dialect Note: Backtick quotes are not valid in standard PostgreSQL. Use double quotes for identifiers.',
      code: 'DIALECT_QUOTING'
    });
  }

  // Check if query is read-only
  const isSelectOnly = /^\s*(SELECT|WITH|SHOW|DESCRIBE|EXPLAIN)\b/i.test(cleanSql);
  if (!isSelectOnly && !isDestructive) {
    issues.push({
      type: 'warning',
      message: 'Caution: Non-SELECT operation detected. Write operations require database admin privileges.',
      code: 'NON_SELECT_OPERATION'
    });
  }

  const hasErrors = issues.some(i => i.type === 'error');
  const hasWarnings = issues.some(i => i.type === 'warning');

  return {
    isValid: !hasErrors,
    hasWarnings,
    issues,
    isDestructive,
    allowedPolicy: !isDestructive,
    syntaxPassed,
    schemaReferencesValid
  };
}
