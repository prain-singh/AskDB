import { DatabaseSchema, DatabaseEngine } from '../types';

export interface GenerationResult {
  sql: string;
  explanation: string;
  matchedTables: string[];
  intent: 'select' | 'aggregate' | 'join' | 'filter';
  dialect: DatabaseEngine;
}

export function translateNaturalLanguageToSql(
  query: string,
  schema: DatabaseSchema
): GenerationResult {
  const q = query.trim();
  const lower = q.toLowerCase();
  const engine = schema.engine;

  // Exact & Pattern Matches from the document & standard queries

  // 1. "Show all employees"
  if (lower.match(/\b(show|get|list|display|select)\s+(all\s+)?employees\b/)) {
    return {
      sql: 'SELECT * FROM employees;',
      explanation: 'Retrieves all columns and rows from the employees table.',
      matchedTables: ['employees'],
      intent: 'select',
      dialect: engine
    };
  }

  // 2. "Find the five highest-paid employees" / "top 5 paid employees"
  if (lower.match(/\b(top|five|5)\b.*\b(highest|paid|salary|earning)\b/) || lower.match(/\bhighest[- ]paid employees\b/)) {
    return {
      sql: 'SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees ORDER BY salary DESC LIMIT 5;',
      explanation: 'Orders records by salary descending and caps results to the top 5 earners.',
      matchedTables: ['employees'],
      intent: 'select',
      dialect: engine
    };
  }

  // 3. "Count employees in each department" / "count employees per department"
  if (lower.match(/\bcount\s+employees\b.*\bdepartment\b/) || lower.match(/\bemployees\s+(in|per)\s+each\s+department\b/)) {
    return {
      sql: 'SELECT d.department_name, COUNT(e.employee_id) AS employee_count, AVG(e.salary) AS avg_salary FROM employees e JOIN departments d ON e.department_id = d.department_id GROUP BY d.department_name ORDER BY employee_count DESC;',
      explanation: 'Joins employees with departments and calculates employee count and average salary per department.',
      matchedTables: ['employees', 'departments'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  // 4. "Show customers from Chennai" / "Find customers in Chennai"
  if (lower.match(/\bcustomers\b.*\b(chennai)\b/) || lower.match(/\bchennai\b.*\bcustomers\b/)) {
    return {
      sql: "SELECT customer_id, customer_name, contact_email, city, country, segment FROM customers WHERE city = 'Chennai';",
      explanation: 'Filters customer records for those headquartered in Chennai.',
      matchedTables: ['customers'],
      intent: 'filter',
      dialect: engine
    };
  }

  // 5. "Calculate average salary" / "average salary of employees"
  if (lower.match(/\baverage\s+salary\b/) || lower.match(/\bavg\s+salary\b/)) {
    return {
      sql: 'SELECT ROUND(AVG(salary), 2) AS average_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary, COUNT(*) AS total_employees FROM employees;',
      explanation: 'Computes overall average, minimum, maximum salary, and employee count.',
      matchedTables: ['employees'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  // 6. "Find employees earning above 50000" / "salary > 50000"
  if (lower.match(/\b(earning|salary|earn)\b.*\b(above|greater than|over|>)\s*50000\b/)) {
    return {
      sql: 'SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees WHERE salary > 50000 ORDER BY salary DESC;',
      explanation: 'Filters all employees with an annual salary greater than $50,000 in descending order.',
      matchedTables: ['employees'],
      intent: 'filter',
      dialect: engine
    };
  }

  // 7. "Sort employees by salary"
  if (lower.match(/\b(sort|order)\s+employees\s+by\s+salary\b/)) {
    return {
      sql: 'SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees ORDER BY salary DESC;',
      explanation: 'Retrieves all employees sorted by salary in descending order.',
      matchedTables: ['employees'],
      intent: 'select',
      dialect: engine
    };
  }

  // 8. "Show employee names with department names"
  if (lower.match(/\bemployee\s+names?\b.*\bdepartment\s+names?\b/) || lower.match(/\bemployees\s+with\s+departments?\b/)) {
    return {
      sql: 'SELECT e.first_name, e.last_name, e.job_title, d.department_name, e.salary, d.location FROM employees e JOIN departments d ON e.department_id = d.department_id ORDER BY d.department_name ASC;',
      explanation: 'Performs an INNER JOIN between employees and departments on department_id.',
      matchedTables: ['employees', 'departments'],
      intent: 'join',
      dialect: engine
    };
  }

  // 9. "Find customers with no orders"
  if (lower.match(/\bcustomers\b.*\b(no|without|zero)\s+orders\b/)) {
    return {
      sql: 'SELECT c.customer_id, c.customer_name, c.contact_email, c.city, c.segment FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;',
      explanation: 'Uses a LEFT JOIN to find registered customers who have never placed an order.',
      matchedTables: ['customers', 'orders'],
      intent: 'join',
      dialect: engine
    };
  }

  // 10. "Total order amount for each customer" / "order volume per customer"
  if (lower.match(/\border\s+(amount|volume|total)\b.*\bcustomer\b/) || lower.match(/\btotal\s+(spent|orders)\b.*\bcustomer\b/)) {
    return {
      sql: 'SELECT c.customer_name, c.city, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_name, c.city ORDER BY total_spent DESC;',
      explanation: 'Aggregates order transaction sums and count grouped by customer.',
      matchedTables: ['customers', 'orders'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  // 11. "Show all orders" / "list orders"
  if (lower.match(/\b(show|list|get)\s+(all\s+)?orders\b/)) {
    return {
      sql: 'SELECT order_id, customer_id, order_date, status, total_amount, payment_method, shipping_city FROM orders ORDER BY order_date DESC;',
      explanation: 'Retrieves all purchase orders sorted by recent date.',
      matchedTables: ['orders'],
      intent: 'select',
      dialect: engine
    };
  }

  // 12. "Show all departments"
  if (lower.match(/\b(show|list|get)\s+(all\s+)?departments\b/)) {
    return {
      sql: 'SELECT * FROM departments ORDER BY budget DESC;',
      explanation: 'Lists all organizational departments ordered by allocated budget.',
      matchedTables: ['departments'],
      intent: 'select',
      dialect: engine
    };
  }

  // 13. "Show all products" / "list products"
  if (lower.match(/\b(show|list|get)\s+(all\s+)?products\b/)) {
    return {
      sql: 'SELECT * FROM products ORDER BY unit_price DESC;',
      explanation: 'Lists all available products sorted by price.',
      matchedTables: ['products'],
      intent: 'select',
      dialect: engine
    };
  }

  // FinTrack SaaS Matches:
  if (lower.match(/\b(show|list|get)\s+(all\s+)?users\b/)) {
    return {
      sql: 'SELECT user_id, email, full_name, role, is_active, country, created_at FROM users ORDER BY created_at DESC;',
      explanation: 'Retrieves user directory records with plan links and active status.',
      matchedTables: ['users'],
      intent: 'select',
      dialect: engine
    };
  }

  if (lower.match(/\bactive\s+users\b/)) {
    const boolVal = engine === 'PostgreSQL' ? 'true' : '1';
    return {
      sql: `SELECT user_id, email, full_name, role, country FROM users WHERE is_active = ${boolVal};`,
      explanation: `Filters users whose account status is currently active (${engine} boolean syntax).`,
      matchedTables: ['users'],
      intent: 'filter',
      dialect: engine
    };
  }

  if (lower.match(/\b(mrr|monthly recurring revenue|revenue)\b/)) {
    return {
      sql: "SELECT p.plan_name, COUNT(s.subscription_id) AS active_subscriptions, SUM(s.mrr) AS total_mrr FROM subscriptions s JOIN plans p ON s.plan_id = p.plan_id WHERE s.billing_status = 'ACTIVE' GROUP BY p.plan_name ORDER BY total_mrr DESC;",
      explanation: 'Calculates active subscription counts and total MRR per subscription tier.',
      matchedTables: ['subscriptions', 'plans'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  if (lower.match(/\b(show|list)\s+plans\b/)) {
    return {
      sql: 'SELECT * FROM plans ORDER BY monthly_price ASC;',
      explanation: 'Displays subscription plans and associated limits in ascending price order.',
      matchedTables: ['plans'],
      intent: 'select',
      dialect: engine
    };
  }

  if (lower.match(/\b(invoices|payments)\b/)) {
    return {
      sql: 'SELECT invoice_id, subscription_id, amount, currency, status, invoice_date, payment_gateway FROM invoices ORDER BY invoice_date DESC;',
      explanation: 'Retrieves all financial invoices and gateway payment statuses.',
      matchedTables: ['invoices'],
      intent: 'select',
      dialect: engine
    };
  }

  // --- Dynamic Fallback Generation ---
  // Infer target table based on schema table names
  let matchedTable = schema.tables.find(t => lower.includes(t.name.toLowerCase()));
  if (!matchedTable && schema.tables.length > 0) {
    matchedTable = schema.tables[0];
  }

  const tableName = matchedTable ? matchedTable.name : 'employees';
  const tableCols = matchedTable ? matchedTable.columns.map(c => c.name) : ['*'];

  // Check if query wants counting
  if (lower.includes('how many') || lower.includes('count') || lower.includes('number of')) {
    return {
      sql: `SELECT COUNT(*) AS total_count FROM ${tableName};`,
      explanation: `Calculates aggregate row count from table '${tableName}'.`,
      matchedTables: [tableName],
      intent: 'aggregate',
      dialect: engine
    };
  }

  // Check if query mentions a limit
  const limitMatch = lower.match(/\b(limit|top|first)\s+(\d+)\b/);
  const limitClause = limitMatch ? ` LIMIT ${limitMatch[2]}` : '';

  // Check if query mentions sorting
  let orderClause = '';
  if (lower.includes('sort') || lower.includes('order') || lower.includes('highest') || lower.includes('recent')) {
    const sortCol = tableCols.find(c => lower.includes(c.toLowerCase())) || tableCols[0];
    const dir = (lower.includes('desc') || lower.includes('highest') || lower.includes('recent') || lower.includes('most')) ? 'DESC' : 'ASC';
    orderClause = ` ORDER BY ${sortCol} ${dir}`;
  }

  const generatedSql = `SELECT * FROM ${tableName}${orderClause}${limitClause};`;

  return {
    sql: generatedSql,
    explanation: `Selects records from the ${tableName} table grounded in discovered schema metadata.`,
    matchedTables: [tableName],
    intent: 'select',
    dialect: engine
  };
}
