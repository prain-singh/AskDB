import { DatabaseEngine } from '../types';

export function quoteIdentifier(name: string, engine: DatabaseEngine): string {
  if (engine === 'MySQL') {
    return `\`${name}\``;
  }
  // PostgreSQL uses double quotes
  return `"${name}"`;
}

export function formatSqlForDialect(sql: string, engine: DatabaseEngine): string {
  if (engine === 'MySQL') {
    // In MySQL, use backticks or bare words
    return sql;
  }
  // PostgreSQL conversions:
  // MySQL DATE_FORMAT -> TO_CHAR
  let pgSql = sql.replace(/DATE_FORMAT\(([^,]+),\s*'([^']+)'\)/gi, 'TO_CHAR($1, \'$2\')');
  return pgSql;
}
