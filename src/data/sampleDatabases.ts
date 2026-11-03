import { DatabaseSchema } from '../types';

export const SAMPLE_DATABASES: DatabaseSchema[] = [
  {
    id: 'db-techcorp',
    name: 'TechCorp Enterprise HR & Sales',
    engine: 'MySQL',
    version: '8.0.35-community',
    host: 'mysql-cluster-prod.askdb.internal',
    port: 3306,
    database: 'techcorp_db',
    user: 'askdb_ro_agent',
    ssl: true,
    isDemo: true,
    tables: [
      {
        name: 'employees',
        description: 'Contains employee personnel, role, compensation, and department assignments',
        rowCount: 12,
        columns: [
          { name: 'employee_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, description: 'Unique identifier for employee' },
          { name: 'first_name', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: false, description: 'Given name' },
          { name: 'last_name', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: false, description: 'Family name' },
          { name: 'email', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: 'Work email' },
          { name: 'department_id', type: 'INT', isPrimary: false, isForeign: true, foreignRef: { table: 'departments', column: 'department_id' }, isNullable: false, description: 'References departments.department_id' },
          { name: 'job_title', type: 'VARCHAR(80)', isPrimary: false, isForeign: false, isNullable: false, description: 'Current designation' },
          { name: 'salary', type: 'DECIMAL(10,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Annual salary in USD' },
          { name: 'hire_date', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: 'Employment start date' },
          { name: 'city', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, isNullable: false, description: 'Primary office location city' },
          { name: 'status', type: 'VARCHAR(20)', isPrimary: false, isForeign: false, isNullable: false, description: 'ACTIVE, ON_LEAVE, or TERMINATED' }
        ],
        data: [
          { employee_id: 101, first_name: 'Priya', last_name: 'Sundaram', email: 'priya.s@techcorp.io', department_id: 1, job_title: 'VP of Engineering', salary: 148000, hire_date: '2021-03-15', city: 'Chennai', status: 'ACTIVE' },
          { employee_id: 102, first_name: 'Marcus', last_name: 'Vance', email: 'marcus.v@techcorp.io', department_id: 1, job_title: 'Principal Architect', salary: 135000, hire_date: '2020-07-01', city: 'San Francisco', status: 'ACTIVE' },
          { employee_id: 103, first_name: 'Aisha', last_name: 'Khan', email: 'aisha.k@techcorp.io', department_id: 2, job_title: 'Lead Data Scientist', salary: 122000, hire_date: '2022-01-10', city: 'London', status: 'ACTIVE' },
          { employee_id: 104, first_name: 'David', last_name: 'Chen', email: 'david.c@techcorp.io', department_id: 3, job_title: 'Senior Marketing Director', salary: 115000, hire_date: '2021-11-20', city: 'New York', status: 'ACTIVE' },
          { employee_id: 105, first_name: 'Ananya', last_name: 'Rao', email: 'ananya.r@techcorp.io', department_id: 1, job_title: 'Senior Fullstack Engineer', salary: 98000, hire_date: '2022-06-01', city: 'Chennai', status: 'ACTIVE' },
          { employee_id: 106, first_name: 'Elena', last_name: 'Rostova', email: 'elena.r@techcorp.io', department_id: 4, job_title: 'Enterprise Account Executive', salary: 92000, hire_date: '2023-02-14', city: 'Berlin', status: 'ACTIVE' },
          { employee_id: 107, first_name: 'Liam', last_name: 'O\'Connor', email: 'liam.o@techcorp.io', department_id: 1, job_title: 'DevOps & Cloud Engineer', salary: 89000, hire_date: '2022-09-01', city: 'Dublin', status: 'ACTIVE' },
          { employee_id: 108, first_name: 'Rajesh', last_name: 'Kumar', email: 'rajesh.k@techcorp.io', department_id: 5, job_title: 'Head of People & HR', salary: 86000, hire_date: '2020-04-18', city: 'Chennai', status: 'ACTIVE' },
          { employee_id: 109, first_name: 'Sophie', last_name: 'Dubois', email: 'sophie.d@techcorp.io', department_id: 2, job_title: 'BI Analyst', salary: 76000, hire_date: '2023-05-12', city: 'Paris', status: 'ACTIVE' },
          { employee_id: 110, first_name: 'Carlos', last_name: 'Mendez', email: 'carlos.m@techcorp.io', department_id: 4, job_title: 'Sales Operations Specialist', salary: 64000, hire_date: '2023-08-20', city: 'Madrid', status: 'ACTIVE' },
          { employee_id: 111, first_name: 'Karthik', last_name: 'Swaminathan', email: 'karthik.s@techcorp.io', department_id: 6, job_title: 'Financial Controller', salary: 95000, hire_date: '2021-08-01', city: 'Chennai', status: 'ACTIVE' },
          { employee_id: 112, first_name: 'Chloe', last_name: 'Bennett', email: 'chloe.b@techcorp.io', department_id: 3, job_title: 'Content & SEO Strategist', salary: 58000, hire_date: '2024-01-15', city: 'London', status: 'ACTIVE' }
        ]
      },
      {
        name: 'departments',
        description: 'Organizational divisions with allocated budgets and leadership',
        rowCount: 6,
        columns: [
          { name: 'department_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, description: 'Primary key for department' },
          { name: 'department_name', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, isNullable: false, description: 'Department title' },
          { name: 'manager_id', type: 'INT', isPrimary: false, isForeign: false, isNullable: true, description: 'Employee ID of department head' },
          { name: 'location', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, isNullable: false, description: 'Headquarters or hub' },
          { name: 'budget', type: 'DECIMAL(12,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Annual operating budget' }
        ],
        data: [
          { department_id: 1, department_name: 'Engineering', manager_id: 101, location: 'Building A, Chennai', budget: 1850000 },
          { department_id: 2, department_name: 'Data & Analytics', manager_id: 103, location: 'Hub North, London', budget: 740000 },
          { department_id: 3, department_name: 'Marketing', manager_id: 104, location: 'Midtown, New York', budget: 920000 },
          { department_id: 4, department_name: 'Global Sales', manager_id: 106, location: 'Potsdamer Platz, Berlin', budget: 1100000 },
          { department_id: 5, department_name: 'Human Resources', manager_id: 108, location: 'Tower 4, Chennai', budget: 420000 },
          { department_id: 6, department_name: 'Finance & Legal', manager_id: 111, location: 'Tower 4, Chennai', budget: 510000 }
        ]
      },
      {
        name: 'customers',
        description: 'Client companies and retail accounts ordering products or services',
        rowCount: 8,
        columns: [
          { name: 'customer_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, description: 'Customer identifier' },
          { name: 'customer_name', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: 'Corporate entity or individual' },
          { name: 'contact_email', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: 'Billing contact' },
          { name: 'phone', type: 'VARCHAR(25)', isPrimary: false, isForeign: false, isNullable: true, description: 'Contact phone' },
          { name: 'city', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, isNullable: false, description: 'Headquartered city' },
          { name: 'country', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, isNullable: false, description: 'Country' },
          { name: 'segment', type: 'VARCHAR(30)', isPrimary: false, isForeign: false, isNullable: false, description: 'Enterprise, Mid-Market, SMB' },
          { name: 'registered_at', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: 'Onboarding date' }
        ],
        data: [
          { customer_id: 201, customer_name: 'OmniGlobal Logistics', contact_email: 'procure@omniglobal.com', phone: '+91-44-2819-0021', city: 'Chennai', country: 'India', segment: 'Enterprise', registered_at: '2022-04-10' },
          { customer_id: 202, customer_name: 'Apex Financial Systems', contact_email: 'tech@apexfin.co.uk', phone: '+44-20-7946-0912', city: 'London', country: 'United Kingdom', segment: 'Enterprise', registered_at: '2021-09-18' },
          { customer_id: 203, customer_name: 'Coromandel BioTech', contact_email: 'ops@coromandelbio.in', phone: '+91-44-4211-7890', city: 'Chennai', country: 'India', segment: 'Mid-Market', registered_at: '2023-01-22' },
          { customer_id: 204, customer_name: 'Nordic Cloud Labs', contact_email: 'billing@nordiccloud.se', phone: '+46-8-123-4567', city: 'Stockholm', country: 'Sweden', segment: 'SMB', registered_at: '2023-06-30' },
          { customer_id: 205, customer_name: 'Zenith Retail Brands', contact_email: 'finance@zenithstores.us', phone: '+1-415-555-0182', city: 'San Francisco', country: 'United States', segment: 'Enterprise', registered_at: '2022-11-05' },
          { customer_id: 206, customer_name: 'Bayfront Media Group', contact_email: 'accounts@bayfront.com', phone: '+1-212-555-0199', city: 'New York', country: 'United States', segment: 'Mid-Market', registered_at: '2023-09-14' },
          { customer_id: 207, customer_name: 'Tidel Park Software Consortium', contact_email: 'admin@tidelconsort.org', phone: '+91-44-2254-1100', city: 'Chennai', country: 'India', segment: 'Enterprise', registered_at: '2024-02-01' },
          { customer_id: 208, customer_name: 'Solaria Energy Solutions', contact_email: 'orders@solariaenergy.es', phone: '+34-91-555-8821', city: 'Madrid', country: 'Spain', segment: 'SMB', registered_at: '2024-03-12' }
        ]
      },
      {
        name: 'orders',
        description: 'Customer purchase transactions and total financial volume',
        rowCount: 10,
        columns: [
          { name: 'order_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, description: 'Order tracking ID' },
          { name: 'customer_id', type: 'INT', isPrimary: false, isForeign: true, foreignRef: { table: 'customers', column: 'customer_id' }, isNullable: false, description: 'References customers.customer_id' },
          { name: 'order_date', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: 'Transaction timestamp' },
          { name: 'status', type: 'VARCHAR(25)', isPrimary: false, isForeign: false, isNullable: false, description: 'COMPLETED, PROCESSING, SHIPPED, CANCELLED' },
          { name: 'total_amount', type: 'DECIMAL(10,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Final order total in USD' },
          { name: 'payment_method', type: 'VARCHAR(30)', isPrimary: false, isForeign: false, isNullable: false, description: 'WIRE_TRANSFER, CREDIT_CARD, ACH' },
          { name: 'shipping_city', type: 'VARCHAR(60)', isPrimary: false, isForeign: false, isNullable: false, description: 'Fulfillment destination' }
        ],
        data: [
          { order_id: 5001, customer_id: 201, order_date: '2024-01-18', status: 'COMPLETED', total_amount: 14500.00, payment_method: 'WIRE_TRANSFER', shipping_city: 'Chennai' },
          { order_id: 5002, customer_id: 202, order_date: '2024-01-25', status: 'COMPLETED', total_amount: 32000.00, payment_method: 'WIRE_TRANSFER', shipping_city: 'London' },
          { order_id: 5003, customer_id: 201, order_date: '2024-02-04', status: 'COMPLETED', total_amount: 8750.00, payment_method: 'ACH', shipping_city: 'Chennai' },
          { order_id: 5004, customer_id: 203, order_date: '2024-02-14', status: 'SHIPPED', total_amount: 6200.00, payment_method: 'CREDIT_CARD', shipping_city: 'Chennai' },
          { order_id: 5005, customer_id: 205, order_date: '2024-02-28', status: 'COMPLETED', total_amount: 48900.00, payment_method: 'WIRE_TRANSFER', shipping_city: 'San Francisco' },
          { order_id: 5006, customer_id: 202, order_date: '2024-03-02', status: 'COMPLETED', total_amount: 18400.00, payment_method: 'WIRE_TRANSFER', shipping_city: 'London' },
          { order_id: 5007, customer_id: 206, order_date: '2024-03-11', status: 'PROCESSING', total_amount: 4300.00, payment_method: 'CREDIT_CARD', shipping_city: 'New York' },
          { order_id: 5008, customer_id: 205, order_date: '2024-03-19', status: 'SHIPPED', total_amount: 22100.00, payment_method: 'WIRE_TRANSFER', shipping_city: 'San Francisco' },
          { order_id: 5009, customer_id: 204, order_date: '2024-03-24', status: 'COMPLETED', total_amount: 3100.00, payment_method: 'CREDIT_CARD', shipping_city: 'Stockholm' },
          { order_id: 5010, customer_id: 201, order_date: '2024-04-02', status: 'PROCESSING', total_amount: 11200.00, payment_method: 'ACH', shipping_city: 'Chennai' }
          // Notice: Customer 207 (Tidel Park) and Customer 208 (Solaria) have NO orders! Perfect for testing LEFT JOIN outer queries.
        ]
      },
      {
        name: 'products',
        description: 'Catalog of enterprise platform licenses, edge devices, and services',
        rowCount: 6,
        columns: [
          { name: 'product_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, description: 'Product item identifier' },
          { name: 'product_name', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: 'Product commercial name' },
          { name: 'category', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: false, description: 'Category division' },
          { name: 'unit_price', type: 'DECIMAL(8,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Base price per unit' },
          { name: 'stock_quantity', type: 'INT', isPrimary: false, isForeign: false, isNullable: false, description: 'Current available inventory' },
          { name: 'supplier', type: 'VARCHAR(80)', isPrimary: false, isForeign: false, isNullable: false, description: 'Manufacturing or vendor partner' }
        ],
        data: [
          { product_id: 901, product_name: 'ASKDB Enterprise Cluster License (1 Yr)', category: 'Software', unit_price: 12000.00, stock_quantity: 999, supplier: 'ASKDB Core Inc' },
          { product_id: 902, product_name: 'Edge AI Inference Gateway v3', category: 'Hardware', unit_price: 2450.00, stock_quantity: 48, supplier: 'SiliconEdge Labs' },
          { product_id: 903, product_name: 'Data Connector & ETL Suite', category: 'Software', unit_price: 4500.00, stock_quantity: 999, supplier: 'ASKDB Core Inc' },
          { product_id: 904, product_name: 'High-Density NVMe Storage Rack (128TB)', category: 'Hardware', unit_price: 14800.00, stock_quantity: 14, supplier: 'DataVault Systems' },
          { product_id: 905, product_name: '24/7 Mission-Critical SLA Support', category: 'Services', unit_price: 8000.00, stock_quantity: 999, supplier: 'ASKDB Core Inc' },
          { product_id: 906, product_name: 'Secured Hardware Security Module (HSM)', category: 'Hardware', unit_price: 3600.00, stock_quantity: 26, supplier: 'CryptoShield Corp' }
        ]
      }
    ]
  },
  {
    id: 'db-fintrack',
    name: 'FinTrack SaaS & Subscription Platform',
    engine: 'PostgreSQL',
    version: 'PostgreSQL 16.2 on x86_64-pc-linux-gnu',
    host: 'pg-production-eu.fintrack.internal',
    port: 5432,
    database: 'fintrack_analytics',
    user: 'saas_analyst',
    ssl: true,
    isDemo: true,
    tables: [
      {
        name: 'users',
        description: 'Registered platform users and organization account owners',
        rowCount: 8,
        columns: [
          { name: 'user_id', type: 'BIGINT', isPrimary: true, isForeign: false, isNullable: false, description: 'Unique user identity' },
          { name: 'email', type: 'VARCHAR(120)', isPrimary: false, isForeign: false, isNullable: false, description: 'Primary login identifier' },
          { name: 'full_name', type: 'VARCHAR(90)', isPrimary: false, isForeign: false, isNullable: false, description: 'Legal name' },
          { name: 'plan_id', type: 'INT', isPrimary: false, isForeign: true, foreignRef: { table: 'plans', column: 'plan_id' }, isNullable: false, description: 'References plans.plan_id' },
          { name: 'role', type: 'VARCHAR(30)', isPrimary: false, isForeign: false, isNullable: false, description: 'ADMIN, OWNER, MEMBER, VIEWER' },
          { name: 'created_at', type: 'TIMESTAMPTZ', isPrimary: false, isForeign: false, isNullable: false, description: 'User account signup date' },
          { name: 'is_active', type: 'BOOLEAN', isPrimary: false, isForeign: false, isNullable: false, description: 'Account status flag' },
          { name: 'country', type: 'VARCHAR(4)', isPrimary: false, isForeign: false, isNullable: false, description: 'ISO 2-letter country code' }
        ],
        data: [
          { user_id: 1001, email: 'alex@novapay.io', full_name: 'Alexander Wright', plan_id: 3, role: 'OWNER', created_at: '2023-01-15T09:30:00Z', is_active: true, country: 'US' },
          { user_id: 1002, email: 'haruto@tokyofintech.jp', full_name: 'Haruto Sato', plan_id: 3, role: 'ADMIN', created_at: '2023-03-20T14:15:00Z', is_active: true, country: 'JP' },
          { user_id: 1003, email: 'clara@berlinledger.de', full_name: 'Clara Schmidt', plan_id: 2, role: 'OWNER', created_at: '2023-05-11T11:00:00Z', is_active: true, country: 'DE' },
          { user_id: 1004, email: 'mateo@santanderventure.es', full_name: 'Mateo Morales', plan_id: 2, role: 'MEMBER', created_at: '2023-08-04T16:45:00Z', is_active: true, country: 'ES' },
          { user_id: 1005, email: 'deepak@mumbaitrade.in', full_name: 'Deepak Verma', plan_id: 1, role: 'OWNER', created_at: '2023-10-18T08:20:00Z', is_active: true, country: 'IN' },
          { user_id: 1006, email: 'lucia@romeconsult.it', full_name: 'Lucia Ferrari', plan_id: 1, role: 'VIEWER', created_at: '2024-01-05T12:00:00Z', is_active: false, country: 'IT' },
          { user_id: 1007, email: 'oliver@sydneymetrix.au', full_name: 'Oliver Hughes', plan_id: 3, role: 'OWNER', created_at: '2024-02-14T03:10:00Z', is_active: true, country: 'AU' },
          { user_id: 1008, email: 'zara@nordicpay.no', full_name: 'Zara Lind', plan_id: 2, role: 'OWNER', created_at: '2024-03-01T10:25:00Z', is_active: true, country: 'NO' }
        ]
      },
      {
        name: 'plans',
        description: 'SaaS subscription tiers, monthly rates, seat capacities and features',
        rowCount: 3,
        columns: [
          { name: 'plan_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, description: 'Plan key' },
          { name: 'plan_name', type: 'VARCHAR(40)', isPrimary: false, isForeign: false, isNullable: false, description: 'Display name' },
          { name: 'monthly_price', type: 'NUMERIC(8,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Price in USD per month' },
          { name: 'annual_discount', type: 'NUMERIC(4,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Discount percentage' },
          { name: 'max_seats', type: 'INT', isPrimary: false, isForeign: false, isNullable: false, description: 'Allowed team members' },
          { name: 'tier', type: 'VARCHAR(20)', isPrimary: false, isForeign: false, isNullable: false, description: 'STARTER, PROFESSIONAL, ENTERPRISE' }
        ],
        data: [
          { plan_id: 1, plan_name: 'Starter Tier', monthly_price: 49.00, annual_discount: 15.00, max_seats: 3, tier: 'STARTER' },
          { plan_id: 2, plan_name: 'Professional Scale', monthly_price: 199.00, annual_discount: 20.00, max_seats: 15, tier: 'PROFESSIONAL' },
          { plan_id: 3, plan_name: 'Enterprise Dedicated', monthly_price: 899.00, annual_discount: 25.00, max_seats: 100, tier: 'ENTERPRISE' }
        ]
      },
      {
        name: 'subscriptions',
        description: 'Active, paused and churned recurring revenue subscriptions',
        rowCount: 8,
        columns: [
          { name: 'subscription_id', type: 'VARCHAR(36)', isPrimary: true, isForeign: false, isNullable: false, description: 'UUID' },
          { name: 'user_id', type: 'BIGINT', isPrimary: false, isForeign: true, foreignRef: { table: 'users', column: 'user_id' }, isNullable: false, description: 'References users.user_id' },
          { name: 'plan_id', type: 'INT', isPrimary: false, isForeign: true, foreignRef: { table: 'plans', column: 'plan_id' }, isNullable: false, description: 'References plans.plan_id' },
          { name: 'start_date', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: 'Initial activation' },
          { name: 'renewal_date', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: 'Next scheduled charge' },
          { name: 'billing_status', type: 'VARCHAR(20)', isPrimary: false, isForeign: false, isNullable: false, description: 'ACTIVE, PAST_DUE, CANCELLED' },
          { name: 'mrr', type: 'NUMERIC(10,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Monthly recurring revenue contribution' }
        ],
        data: [
          { subscription_id: 'sub_01H1', user_id: 1001, plan_id: 3, start_date: '2023-01-15', renewal_date: '2025-01-15', billing_status: 'ACTIVE', mrr: 899.00 },
          { subscription_id: 'sub_02H2', user_id: 1002, plan_id: 3, start_date: '2023-03-20', renewal_date: '2025-03-20', billing_status: 'ACTIVE', mrr: 899.00 },
          { subscription_id: 'sub_03H3', user_id: 1003, plan_id: 2, start_date: '2023-05-11', renewal_date: '2024-11-11', billing_status: 'ACTIVE', mrr: 199.00 },
          { subscription_id: 'sub_04H4', user_id: 1004, plan_id: 2, start_date: '2023-08-04', renewal_date: '2024-12-04', billing_status: 'ACTIVE', mrr: 199.00 },
          { subscription_id: 'sub_05H5', user_id: 1005, plan_id: 1, start_date: '2023-10-18', renewal_date: '2024-10-18', billing_status: 'ACTIVE', mrr: 49.00 },
          { subscription_id: 'sub_06H6', user_id: 1006, plan_id: 1, start_date: '2024-01-05', renewal_date: '2024-02-05', billing_status: 'CANCELLED', mrr: 0.00 },
          { subscription_id: 'sub_07H7', user_id: 1007, plan_id: 3, start_date: '2024-02-14', renewal_date: '2025-02-14', billing_status: 'ACTIVE', mrr: 899.00 },
          { subscription_id: 'sub_08H8', user_id: 1008, plan_id: 2, start_date: '2024-03-01', renewal_date: '2024-12-01', billing_status: 'ACTIVE', mrr: 199.00 }
        ]
      },
      {
        name: 'invoices',
        description: 'Payment settlement records and gateway processing codes',
        rowCount: 7,
        columns: [
          { name: 'invoice_id', type: 'VARCHAR(24)', isPrimary: true, isForeign: false, isNullable: false, description: 'Invoice number' },
          { name: 'subscription_id', type: 'VARCHAR(36)', isPrimary: false, isForeign: true, foreignRef: { table: 'subscriptions', column: 'subscription_id' }, isNullable: false, description: 'Associated subscription' },
          { name: 'amount', type: 'NUMERIC(10,2)', isPrimary: false, isForeign: false, isNullable: false, description: 'Settled amount' },
          { name: 'currency', type: 'VARCHAR(3)', isPrimary: false, isForeign: false, isNullable: false, description: 'ISO currency' },
          { name: 'status', type: 'VARCHAR(20)', isPrimary: false, isForeign: false, isNullable: false, description: 'PAID, OPEN, FAILED' },
          { name: 'invoice_date', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: 'Issue date' },
          { name: 'payment_gateway', type: 'VARCHAR(30)', isPrimary: false, isForeign: false, isNullable: false, description: 'STRIPE, ADYEN, RAZORPAY' }
        ],
        data: [
          { invoice_id: 'INV-2024-001', subscription_id: 'sub_01H1', amount: 899.00, currency: 'USD', status: 'PAID', invoice_date: '2024-01-15', payment_gateway: 'STRIPE' },
          { invoice_id: 'INV-2024-002', subscription_id: 'sub_02H2', amount: 899.00, currency: 'USD', status: 'PAID', invoice_date: '2024-01-20', payment_gateway: 'ADYEN' },
          { invoice_id: 'INV-2024-003', subscription_id: 'sub_03H3', amount: 199.00, currency: 'USD', status: 'PAID', invoice_date: '2024-02-11', payment_gateway: 'STRIPE' },
          { invoice_id: 'INV-2024-004', subscription_id: 'sub_05H5', amount: 49.00, currency: 'USD', status: 'PAID', invoice_date: '2024-02-18', payment_gateway: 'RAZORPAY' },
          { invoice_id: 'INV-2024-005', subscription_id: 'sub_07H7', amount: 899.00, currency: 'USD', status: 'PAID', invoice_date: '2024-02-14', payment_gateway: 'STRIPE' },
          { invoice_id: 'INV-2024-006', subscription_id: 'sub_08H8', amount: 199.00, currency: 'USD', status: 'PAID', invoice_date: '2024-03-01', payment_gateway: 'STRIPE' },
          { invoice_id: 'INV-2024-007', subscription_id: 'sub_04H4', amount: 199.00, currency: 'USD', status: 'OPEN', invoice_date: '2024-03-04', payment_gateway: 'ADYEN' }
        ]
      }
    ]
  }
];

export const INITIAL_PROMPT_SUGGESTIONS = [
  {
    title: 'Show all employees',
    category: 'Basic Retrieval',
    prompt: 'Show all employees',
    desc: 'Selects all columns from the employees table'
  },
  {
    title: 'Top 5 highest-paid employees',
    category: 'Sorting & Limiting',
    prompt: 'Find the five highest-paid employees',
    desc: 'Orders employees by salary descending and limits to 5'
  },
  {
    title: 'Count employees in each department',
    category: 'Aggregation & Grouping',
    prompt: 'Count employees in each department',
    desc: 'Aggregates employee counts grouped by department_id'
  },
  {
    title: 'Employees earning above 50,000',
    category: 'Filtering',
    prompt: 'Find employees earning above 50000',
    desc: 'Filters employees with salary threshold condition'
  },
  {
    title: 'Show employees with department names',
    category: 'Relational Join',
    prompt: 'Show employee names with department names',
    desc: 'Performs an INNER JOIN between employees and departments'
  },
  {
    title: 'Show customers from Chennai',
    category: 'String Filtering',
    prompt: 'Show customers from Chennai',
    desc: 'Selects customers where city equals Chennai'
  },
  {
    title: 'Customers with no orders',
    category: 'Outer Join',
    prompt: 'Find customers with no orders',
    desc: 'LEFT JOIN customers to orders checking WHERE order_id IS NULL'
  },
  {
    title: 'Calculate average salary',
    category: 'Aggregate Functions',
    prompt: 'Calculate average salary',
    desc: 'Computes AVG(salary) across all active employees'
  },
  {
    title: 'Total order volume per customer',
    category: 'Multi-table Aggregation',
    prompt: 'Show total order amount for each customer',
    desc: 'Joins customers and orders, grouping by customer name with SUM(total_amount)'
  }
];
