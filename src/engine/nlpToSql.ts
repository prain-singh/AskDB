import { DatabaseSchema, DatabaseEngine } from '../types';

export interface GenerationResult {
  sql: string;
  explanation: string;
  matchedTables: string[];
  intent: 'select' | 'aggregate' | 'join' | 'filter';
  dialect: DatabaseEngine;
}

// Synonyms map for relational tables
const TABLE_SYNONYMS: Record<string, string[]> = {
  employees: ['employee', 'employees', 'worker', 'workers', 'staff', 'personnel', 'team member', 'people', 'hire', 'hires', 'engineer', 'developer', 'salaries', 'salary'],
  departments: ['department', 'departments', 'dept', 'depts', 'division', 'divisions', 'teams', 'unit', 'units', 'budget', 'budgets'],
  customers: ['customer', 'customers', 'client', 'clients', 'buyer', 'buyers', 'patron', 'consumer', 'consumers', 'account', 'accounts'],
  orders: ['order', 'orders', 'purchase', 'purchases', 'transaction', 'transactions', 'sale', 'sales', 'checkout'],
  products: ['product', 'products', 'item', 'items', 'license', 'licenses', 'hardware', 'goods', 'merchandise', 'catalog', 'inventory'],
  users: ['user', 'users', 'member', 'members', 'account', 'accounts', 'profile', 'profiles'],
  plans: ['plan', 'plans', 'tier', 'tiers', 'pricing', 'package', 'packages'],
  subscriptions: ['subscription', 'subscriptions', 'sub', 'subs', 'recurring', 'mrr'],
  invoices: ['invoice', 'invoices', 'bill', 'bills', 'payment', 'payments', 'charge', 'charges'],
  audit_logs: ['log', 'logs', 'audit', 'audits', 'history', 'events']
};

// Known entity values in sample data
const KNOWN_CITIES = [
  { name: 'Chennai', aliases: ['chennai', 'madras'] },
  { name: 'London', aliases: ['london'] },
  { name: 'New York', aliases: ['new york', 'nyc', 'manhattan'] },
  { name: 'San Francisco', aliases: ['san francisco', 'sf', 'bay area'] },
  { name: 'Berlin', aliases: ['berlin'] },
  { name: 'Madrid', aliases: ['madrid'] },
  { name: 'Stockholm', aliases: ['stockholm'] },
  { name: 'Dublin', aliases: ['dublin'] },
  { name: 'Paris', aliases: ['paris'] },
  { name: 'Tokyo', aliases: ['tokyo'] },
  { name: 'Mumbai', aliases: ['mumbai', 'bombay'] }
];

const KNOWN_STATUSES = [
  'ACTIVE', 'COMPLETED', 'SHIPPED', 'PROCESSING', 'CANCELLED', 'PAID', 'OPEN', 'FAILED', 'ON_LEAVE', 'TERMINATED'
];

const KNOWN_DEPARTMENTS = [
  { id: 1, name: 'Engineering', aliases: ['engineering', 'engineering team', 'dev', 'tech'] },
  { id: 2, name: 'Data & Analytics', aliases: ['data', 'analytics', 'data science', 'bi'] },
  { id: 3, name: 'Marketing', aliases: ['marketing'] },
  { id: 4, name: 'Global Sales', aliases: ['sales', 'global sales'] },
  { id: 5, name: 'Human Resources', aliases: ['hr', 'human resources', 'people'] },
  { id: 6, name: 'Finance & Legal', aliases: ['finance', 'legal', 'accounting'] }
];

export function translateNaturalLanguageToSql(
  query: string,
  schema: DatabaseSchema
): GenerationResult {
  const q = query.trim();
  const lower = q.toLowerCase();
  const engine = schema.engine;

  // -------------------------------------------------------------
  // 1. Check for Negation / Outer Join ("no orders", "without orders", etc.)
  // -------------------------------------------------------------
  if (
    (lower.includes('customer') || lower.includes('client')) &&
    (lower.match(/\b(no|without|zero|never)\s+(orders?|purchases?)\b/) || lower.includes('not ordered') || lower.includes('no order'))
  ) {
    return {
      sql: 'SELECT c.customer_id, c.customer_name, c.contact_email, c.city, c.segment FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;',
      explanation: 'Uses a LEFT JOIN between customers and orders to return customers whose order ID is NULL (never placed an order).',
      matchedTables: ['customers', 'orders'],
      intent: 'join',
      dialect: engine
    };
  }

  // -------------------------------------------------------------
  // 2. High-Priority Relational JOINS
  // -------------------------------------------------------------
  // Employees + Departments
  if (
    (lower.includes('employee') || lower.includes('staff') || lower.includes('worker')) &&
    (lower.includes('department') || lower.includes('dept'))
  ) {
    // Aggregation: Count employees per department
    if (lower.includes('count') || lower.includes('number of') || lower.includes('each department') || lower.includes('per department') || lower.includes('in department')) {
      return {
        sql: 'SELECT d.department_name, COUNT(e.employee_id) AS employee_count, AVG(e.salary) AS avg_salary FROM employees e JOIN departments d ON e.department_id = d.department_id GROUP BY d.department_name ORDER BY employee_count DESC;',
        explanation: 'Joins employees with departments, grouping by department name to calculate employee counts and average salaries.',
        matchedTables: ['employees', 'departments'],
        intent: 'aggregate',
        dialect: engine
      };
    }

    // Direct Join: Employee names with department names
    return {
      sql: 'SELECT e.first_name, e.last_name, e.job_title, d.department_name, e.salary, d.location FROM employees e JOIN departments d ON e.department_id = d.department_id ORDER BY d.department_name ASC;',
      explanation: 'Performs an INNER JOIN between employees and departments on department_id to show employee roles alongside department names.',
      matchedTables: ['employees', 'departments'],
      intent: 'join',
      dialect: engine
    };
  }

  // Customers + Orders
  if (
    (lower.includes('customer') || lower.includes('client')) &&
    (lower.includes('order') || lower.includes('spent') || lower.includes('revenue') || lower.includes('volume') || lower.includes('total amount'))
  ) {
    return {
      sql: 'SELECT c.customer_name, c.city, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS total_spent FROM customers c JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_name, c.city ORDER BY total_spent DESC;',
      explanation: 'Joins customers and orders, grouping by customer to aggregate total order transaction counts and gross spend.',
      matchedTables: ['customers', 'orders'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  // Subscriptions + Plans + Users (SaaS)
  if (lower.includes('mrr') || (lower.includes('subscription') && (lower.includes('plan') || lower.includes('tier')))) {
    return {
      sql: "SELECT p.plan_name, COUNT(s.subscription_id) AS active_subscriptions, SUM(s.mrr) AS total_mrr FROM subscriptions s JOIN plans p ON s.plan_id = p.plan_id WHERE s.billing_status = 'ACTIVE' GROUP BY p.plan_name ORDER BY total_mrr DESC;",
      explanation: 'Calculates active subscription counts and total MRR per subscription tier in FinTrack SaaS.',
      matchedTables: ['subscriptions', 'plans'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  if (lower.includes('subscription') && lower.includes('user')) {
    return {
      sql: "SELECT s.subscription_id, u.full_name, u.email, p.plan_name, s.mrr, s.billing_status FROM subscriptions s JOIN users u ON s.user_id = u.user_id JOIN plans p ON s.plan_id = p.plan_id ORDER BY s.mrr DESC;",
      explanation: 'Joins subscriptions with user profiles and plan tiers.',
      matchedTables: ['subscriptions', 'users', 'plans'],
      intent: 'join',
      dialect: engine
    };
  }

  // -------------------------------------------------------------
  // 3. Resolve Primary Target Table
  // -------------------------------------------------------------
  let targetTable = resolveTargetTable(lower, schema);

  // -------------------------------------------------------------
  // 4. City-based Filters (e.g. "Find customer from Chennai", "Employees in London")
  // -------------------------------------------------------------
  const matchedCity = KNOWN_CITIES.find(c => 
    c.aliases.some(alias => new RegExp(`\\b${alias}\\b`, 'i').test(lower))
  );

  if (matchedCity) {
    const cityName = matchedCity.name;

    // Check if table has a city column
    if (targetTable.name === 'customers') {
      return {
        sql: `SELECT customer_id, customer_name, contact_email, city, country, segment FROM customers WHERE city = '${cityName}';`,
        explanation: `Filters customer records for accounts headquartered in ${cityName}.`,
        matchedTables: ['customers'],
        intent: 'filter',
        dialect: engine
      };
    }

    if (targetTable.name === 'employees') {
      return {
        sql: `SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees WHERE city = '${cityName}';`,
        explanation: `Retrieves employee personnel located at the ${cityName} office hub.`,
        matchedTables: ['employees'],
        intent: 'filter',
        dialect: engine
      };
    }

    if (targetTable.name === 'orders') {
      return {
        sql: `SELECT order_id, customer_id, order_date, status, total_amount, payment_method, shipping_city FROM orders WHERE shipping_city = '${cityName}' ORDER BY order_date DESC;`,
        explanation: `Filters orders shipping to ${cityName}.`,
        matchedTables: ['orders'],
        intent: 'filter',
        dialect: engine
      };
    }
  }

  // -------------------------------------------------------------
  // 5. Department filter (e.g. "Employees in Engineering")
  // -------------------------------------------------------------
  if (targetTable.name === 'employees') {
    const matchedDept = KNOWN_DEPARTMENTS.find(d => 
      d.aliases.some(alias => new RegExp(`\\b${alias}\\b`, 'i').test(lower))
    );
    if (matchedDept && !lower.includes('count')) {
      return {
        sql: `SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees WHERE department_id = ${matchedDept.id} ORDER BY salary DESC;`,
        explanation: `Retrieves employees working in the ${matchedDept.name} department.`,
        matchedTables: ['employees'],
        intent: 'filter',
        dialect: engine
      };
    }
  }

  // -------------------------------------------------------------
  // 6. Numeric Comparisons (Salary, Budget, Price, Amount)
  // -------------------------------------------------------------
  // e.g. "earning above 50000", "salary > 50000", "more than 80000", "under 60000"
  const numMatch = lower.match(/\b(above|greater than|over|more than|>|at least)\s*(\$?\d[\d,]*)/i);
  const numLessMatch = lower.match(/\b(below|less than|under|<|at most)\s*(\$?\d[\d,]*)/i);

  if (numMatch) {
    const threshold = numMatch[2].replace(/[$,]/g, '');
    if (targetTable.name === 'employees') {
      return {
        sql: `SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees WHERE salary > ${threshold} ORDER BY salary DESC;`,
        explanation: `Filters all employees with an annual salary greater than $${Number(threshold).toLocaleString()} in descending order.`,
        matchedTables: ['employees'],
        intent: 'filter',
        dialect: engine
      };
    }
    if (targetTable.name === 'departments') {
      return {
        sql: `SELECT department_id, department_name, location, budget FROM departments WHERE budget > ${threshold} ORDER BY budget DESC;`,
        explanation: `Filters departments with annual budgets exceeding $${Number(threshold).toLocaleString()}.`,
        matchedTables: ['departments'],
        intent: 'filter',
        dialect: engine
      };
    }
    if (targetTable.name === 'orders') {
      return {
        sql: `SELECT order_id, customer_id, order_date, status, total_amount, shipping_city FROM orders WHERE total_amount > ${threshold} ORDER BY total_amount DESC;`,
        explanation: `Filters high-value orders over $${Number(threshold).toLocaleString()}.`,
        matchedTables: ['orders'],
        intent: 'filter',
        dialect: engine
      };
    }
    if (targetTable.name === 'products') {
      return {
        sql: `SELECT product_id, product_name, category, unit_price, stock_quantity FROM products WHERE unit_price > ${threshold} ORDER BY unit_price DESC;`,
        explanation: `Filters products with unit price over $${Number(threshold).toLocaleString()}.`,
        matchedTables: ['products'],
        intent: 'filter',
        dialect: engine
      };
    }
  }

  if (numLessMatch) {
    const threshold = numLessMatch[2].replace(/[$,]/g, '');
    if (targetTable.name === 'employees') {
      return {
        sql: `SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees WHERE salary < ${threshold} ORDER BY salary ASC;`,
        explanation: `Filters employees with an annual salary under $${Number(threshold).toLocaleString()}.`,
        matchedTables: ['employees'],
        intent: 'filter',
        dialect: engine
      };
    }
  }

  // -------------------------------------------------------------
  // 7. Highest / Top Earner / Sorting Queries
  // -------------------------------------------------------------
  // e.g. "Find the five highest-paid employees", "top 5 paid employees", "highest salary"
  if (
    (lower.includes('highest') || lower.includes('top') || lower.includes('best paid') || lower.includes('most paid')) &&
    (lower.includes('paid') || lower.includes('salary') || lower.includes('earner') || targetTable.name === 'employees')
  ) {
    const limitMatch = lower.match(/\b(five|5|10|ten|3|three|\d+)\b/);
    const limitVal = limitMatch ? parseNumberWord(limitMatch[1]) : 5;
    return {
      sql: `SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees ORDER BY salary DESC LIMIT ${limitVal};`,
      explanation: `Orders records by salary descending and caps results to the top ${limitVal} earners.`,
      matchedTables: ['employees'],
      intent: 'select',
      dialect: engine
    };
  }

  if (lower.match(/\b(sort|order)\s+(all\s+)?employees\s+by\s+salary\b/)) {
    return {
      sql: 'SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees ORDER BY salary DESC;',
      explanation: 'Retrieves all employees sorted by salary in descending order.',
      matchedTables: ['employees'],
      intent: 'select',
      dialect: engine
    };
  }

  // -------------------------------------------------------------
  // 8. Aggregates: Average, Total, Count
  // -------------------------------------------------------------
  if (lower.includes('average salary') || lower.includes('avg salary') || lower.includes('mean salary')) {
    return {
      sql: 'SELECT ROUND(AVG(salary), 2) AS average_salary, MIN(salary) AS min_salary, MAX(salary) AS max_salary, COUNT(*) AS total_employees FROM employees;',
      explanation: 'Computes overall average, minimum, maximum salary, and employee count across active personnel.',
      matchedTables: ['employees'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  if (lower.includes('average budget') || lower.includes('avg budget')) {
    return {
      sql: 'SELECT ROUND(AVG(budget), 2) AS average_budget, MIN(budget) AS min_budget, MAX(budget) AS max_budget, COUNT(*) AS total_departments FROM departments;',
      explanation: 'Calculates average, minimum, and maximum department budget allocation.',
      matchedTables: ['departments'],
      intent: 'aggregate',
      dialect: engine
    };
  }

  if (lower.includes('how many') || lower.includes('count of') || lower.includes('total count')) {
    const tName = targetTable.name;
    return {
      sql: `SELECT COUNT(*) AS total_${tName} FROM ${tName};`,
      explanation: `Calculates aggregate row count from table '${tName}'.`,
      matchedTables: [tName],
      intent: 'aggregate',
      dialect: engine
    };
  }

  // -------------------------------------------------------------
  // 9. Status Filters (e.g. "Active users", "Completed orders", "Paid invoices")
  // -------------------------------------------------------------
  if (lower.includes('active user') || (lower.includes('active') && targetTable.name === 'users')) {
    const boolVal = engine === 'PostgreSQL' ? 'true' : '1';
    return {
      sql: `SELECT user_id, email, full_name, role, country FROM users WHERE is_active = ${boolVal};`,
      explanation: `Filters users whose account status is currently active (${engine} boolean syntax).`,
      matchedTables: ['users'],
      intent: 'filter',
      dialect: engine
    };
  }

  if (lower.includes('active') && targetTable.name === 'employees') {
    return {
      sql: "SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees WHERE status = 'ACTIVE';",
      explanation: 'Filters active employee personnel.',
      matchedTables: ['employees'],
      intent: 'filter',
      dialect: engine
    };
  }

  if (lower.includes('completed') && targetTable.name === 'orders') {
    return {
      sql: "SELECT order_id, customer_id, order_date, status, total_amount, shipping_city FROM orders WHERE status = 'COMPLETED' ORDER BY order_date DESC;",
      explanation: 'Filters successfully completed customer orders.',
      matchedTables: ['orders'],
      intent: 'filter',
      dialect: engine
    };
  }

  if (lower.includes('paid') && targetTable.name === 'invoices') {
    return {
      sql: "SELECT invoice_id, subscription_id, amount, currency, status, invoice_date, payment_gateway FROM invoices WHERE status = 'PAID' ORDER BY invoice_date DESC;",
      explanation: 'Retrieves settled customer invoices.',
      matchedTables: ['invoices'],
      intent: 'filter',
      dialect: engine
    };
  }

  // -------------------------------------------------------------
  // 10. General Dynamic SQL Synthesis for Target Table
  // -------------------------------------------------------------
  const tName = targetTable.name;
  const tableCols = targetTable.columns.map(c => c.name);

  // Detect explicit limit
  const limitMatch = lower.match(/\b(limit|top|first)\s+(\d+)\b/);
  const limitClause = limitMatch ? ` LIMIT ${limitMatch[2]}` : '';

  // Detect sorting column
  let orderClause = '';
  const isDesc = lower.includes('desc') || lower.includes('highest') || lower.includes('recent') || lower.includes('newest') || lower.includes('most');
  const sortColCandidate = tableCols.find(c => lower.includes(c.toLowerCase()));
  if (sortColCandidate) {
    orderClause = ` ORDER BY ${sortColCandidate} ${isDesc ? 'DESC' : 'ASC'}`;
  } else if (tableCols.includes('salary')) {
    orderClause = isDesc ? ' ORDER BY salary DESC' : '';
  } else if (tableCols.includes('order_date')) {
    orderClause = ' ORDER BY order_date DESC';
  } else if (tableCols.includes('created_at')) {
    orderClause = ' ORDER BY created_at DESC';
  }

  const generatedSql = `SELECT * FROM ${tName}${orderClause}${limitClause};`;

  return {
    sql: generatedSql,
    explanation: `Retrieves records from the '${tName}' table grounded in active schema metadata.`,
    matchedTables: [tName],
    intent: 'select',
    dialect: engine
  };
}

/**
 * Resolves the most appropriate table definition from schema using synonyms,
 * singular/plural forms, column matches, and data indicators.
 */
function resolveTargetTable(lower: string, schema: DatabaseSchema) {
  let bestTable = schema.tables[0];
  let maxScore = -1;

  for (const table of schema.tables) {
    let score = 0;
    const tName = table.name.toLowerCase();
    const singularName = tName.replace(/s$/, '').replace(/e$/, '');

    // 1. Exact or plural match
    if (new RegExp(`\\b${tName}\\b`, 'i').test(lower)) {
      score += 20;
    } else if (new RegExp(`\\b${singularName}\\b`, 'i').test(lower)) {
      score += 18;
    }

    // 2. Synonyms match
    const syns = TABLE_SYNONYMS[tName] || [];
    for (const syn of syns) {
      if (new RegExp(`\\b${syn}\\b`, 'i').test(lower)) {
        score += 15;
        break;
      }
    }

    // 3. Columns mentioned
    for (const col of table.columns) {
      const cName = col.name.toLowerCase();
      if (cName !== 'id' && new RegExp(`\\b${cName}\\b`, 'i').test(lower)) {
        score += 6;
      }
    }

    // 4. Sample data matches (e.g. if city name is mentioned and this table has 'city' column)
    if (table.columns.some(c => c.name.toLowerCase().includes('city'))) {
      if (KNOWN_CITIES.some(city => city.aliases.some(a => lower.includes(a)))) {
        score += 8;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestTable = table;
    }
  }

  return bestTable;
}

function parseNumberWord(word: string): number {
  const map: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10
  };
  if (map[word.toLowerCase()]) return map[word.toLowerCase()];
  const parsed = parseInt(word, 10);
  return isNaN(parsed) ? 5 : parsed;
}
