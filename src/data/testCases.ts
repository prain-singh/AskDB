import { TestCaseItem } from '../types';

export const SAMPLE_TEST_CASES: TestCaseItem[] = [
  {
    id: 'TC-01',
    name: 'Valid Connection Authentication',
    description: 'Verify successful connection test with valid database host, credentials and port.',
    scenario: 'Provide host mysql-cluster-prod.askdb.internal, port 3306, user askdb_ro_agent, valid password.',
    expectedResult: 'Connection succeeds, latency is measured, status changes to connected.',
    category: 'Connection',
    status: 'passing'
  },
  {
    id: 'TC-02',
    name: 'Invalid Password Handling',
    description: 'Verify that invalid credentials fail safely without leaking internal secrets.',
    scenario: 'Enter wrong password for database connection test.',
    expectedResult: 'Connection fails with safe, user-friendly message "Authentication failed: Access denied".',
    category: 'Connection',
    status: 'passing'
  },
  {
    id: 'TC-03',
    name: 'Schema Metadata Extraction',
    description: 'Verify schema retrieval returns tables, columns, data types, and primary/foreign keys.',
    scenario: 'Inspect active schema for techcorp_db database.',
    expectedResult: 'Schema explorer loads tables: employees, departments, customers, orders, products with full column metadata.',
    category: 'Schema',
    status: 'passing'
  },
  {
    id: 'TC-04',
    name: 'Schema-Grounded SQL Generation',
    description: 'Verify question "Show all employees" maps to actual schema table names and columns.',
    scenario: 'Input: "Show all employees"',
    expectedResult: 'Generates SELECT * FROM employees; grounded in active schema.',
    category: 'Generation',
    status: 'passing'
  },
  {
    id: 'TC-05',
    name: 'Sorting and Row Limiting Translation',
    description: 'Verify natural language request for top 5 salaries translates to ORDER BY and LIMIT clauses.',
    scenario: 'Input: "Find the five highest-paid employees"',
    expectedResult: 'SELECT * FROM employees ORDER BY salary DESC LIMIT 5;',
    category: 'Generation',
    status: 'passing'
  },
  {
    id: 'TC-06',
    name: 'Unknown Column Reference Detection',
    description: 'Verify validation catches references to invalid columns not present in active schema.',
    scenario: 'Submit query referencing non-existent column "bonus_tier" on employees table.',
    expectedResult: 'Validation flag raised: "Unknown column \'bonus_tier\' in table \'employees\'".',
    category: 'Validation',
    status: 'passing'
  },
  {
    id: 'TC-07',
    name: 'Live Query Execution & Result Display',
    description: 'Verify approved query executes and populates structured results grid with metrics.',
    scenario: 'Execute SELECT * FROM employees ORDER BY salary DESC LIMIT 5;',
    expectedResult: 'Returns 5 rows, renders table headers, latency (< 25ms), and row count badge.',
    category: 'Execution',
    status: 'passing'
  },
  {
    id: 'TC-08',
    name: 'Empty Result Set Presentation',
    description: 'Verify clear empty-result state when query yields zero matching records.',
    scenario: 'Execute SELECT * FROM customers WHERE city = \'Atlantis\';',
    expectedResult: 'Explicit "No matching records found" empty state rendered instead of crash or false error.',
    category: 'Execution',
    status: 'passing'
  },
  {
    id: 'TC-09',
    name: 'Database Disconnection Graceful Recovery',
    description: 'Verify network or server outage during execution returns understandable diagnostics.',
    scenario: 'Execute query when connection status is simulated as disconnected/timeout.',
    expectedResult: 'Reports "Database timeout or unreachable" without application crash.',
    category: 'Execution',
    status: 'passing'
  },
  {
    id: 'TC-10',
    name: 'Destructive Statement Safety Policy Block',
    description: 'Verify safety policy rejects DROP, TRUNCATE, and unauthorized modifications.',
    scenario: 'Attempt to execute "DROP TABLE employees;" or "TRUNCATE orders;".',
    expectedResult: 'Safety Policy Rejection: Destructive DDL/DML prohibited under read-only policy.',
    category: 'Security',
    status: 'passing'
  }
];
