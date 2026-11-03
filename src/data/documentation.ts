export interface DocSection {
  id: string;
  number: string;
  title: string;
  badge?: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

export const ASKDB_DOCUMENTATION: DocSection[] = [
  {
    id: 'intro',
    number: '1',
    title: 'Introduction',
    badge: 'Core Context',
    content: 'Relational databases store information in structured tables connected through keys and relationships. SQL is the standard language used to retrieve, insert, update and manage this information. Although SQL is powerful, users need to understand its syntax, table structures, joins, filtering rules and aggregate functions.\n\nASKDB is a web application intended to reduce this learning and interaction barrier. It allows a user to express a data requirement in natural language. The application uses the connected database schema as context to generate a corresponding SQL statement, validates the statement, and provides a way to execute it and inspect the returned records.',
    subsections: [
      {
        title: '1.1 Background',
        content: 'Relational databases store business-critical information. ASKDB bridges the gap between natural human thought and structured query execution.'
      },
      {
        title: '1.2 Purpose of This Document',
        content: 'This project document defines ASKDB\'s product requirements, expected user experience, functional modules, architecture, data flow, security considerations and testing approach.'
      },
      {
        title: '1.3 Intended Audience',
        content: 'Project developers, reviewers, students, and database administrators evaluating or extending the platform.'
      },
      {
        title: '1.4 Product Summary',
        content: 'Single interface between user and supported relational database: connect, inspect schema, ask question, generate SQL, validate, execute, and view results.'
      }
    ]
  },
  {
    id: 'objectives',
    number: '2',
    title: 'Problem Definition and Objectives',
    badge: 'Scope & Goals',
    content: 'Users without SQL knowledge struggle to retrieve information. Even experienced users waste time writing boilerplate queries, looking up column names, writing join conditions, and debugging syntax.',
    subsections: [
      {
        title: '2.1 Problem Statement',
        content: 'Database tools force users to switch back and forth between schema viewers and query scratchpads while memorizing dialect nuances.'
      },
      {
        title: '2.2 Proposed Solution',
        content: 'A schema-aware natural language interface converting natural questions into reviewable, executable SQL statements with zero credential leakage.'
      },
      {
        title: '2.3 Product Objectives',
        content: '• Express questions in plain English\n• Ground SQL in discovered database schema\n• Support MySQL and PostgreSQL dialects\n• Validate statements with actionable errors\n• Provide review before execution\n• Structured result tables & visualizations'
      },
      {
        title: '2.4 Design Principles',
        content: 'Schema-aware, Transparent, Safe by default, Understandable, and Extensible behind database adapters.'
      }
    ]
  },
  {
    id: 'scope',
    number: '3',
    title: 'Product Overview and Scope',
    badge: 'Boundaries',
    content: 'Covers database connections, schema discovery, natural language query synthesis, syntax & safety policy validation, and execution visualization.',
    subsections: [
      {
        title: '3.1 In-Scope Capabilities',
        content: '• Database Connection: MySQL 8+ & PostgreSQL 14+\n• Schema Discovery: Tables, columns, data types, PK/FK relationships\n• Natural Language Input: Plain language requests\n• SQL Generation: Dialect-tailored SQL synthesis\n• Validation: Structural and security policy checks\n• Execution: Non-blocking execution and result presentation'
      },
      {
        title: '3.2 Out-of-Scope for Initial Release',
        content: '• NoSQL or graph databases\n• Unrestricted destructive operations (DROP/TRUNCATE)\n• Voice input or multilingual speech recognition\n• Automated enterprise database migrations'
      }
    ]
  },
  {
    id: 'personas',
    number: '4',
    title: 'Stakeholders and User Personas',
    badge: 'Users',
    content: 'ASKDB serves three primary user personas with varying degrees of SQL expertise.',
    subsections: [
      {
        title: 'Persona A – Student',
        content: 'Learning database concepts. Wants to explore relational data without getting stuck on complex SQL syntax. Learns by seeing the generated SQL alongside their natural question.'
      },
      {
        title: 'Persona B – Data Analyst',
        content: 'Needs fast exploratory insights from operational datasets. Filters, groups, and calculates aggregates while maintaining the ability to fine-tune the generated SQL directly.'
      },
      {
        title: 'Persona C – Developer',
        content: 'Accelerates routine query creation and quickly verifies table relationships, joins, and foreign key mappings.'
      }
    ]
  },
  {
    id: 'requirements',
    number: '5',
    title: 'Requirements Specification',
    badge: 'FR-01 to FR-12',
    content: 'Full functional and non-functional requirements governing connection, schema analysis, query generation, and execution safety.',
    subsections: [
      {
        title: 'Functional Requirements Summary',
        content: '• FR-01: Database selection (MySQL / PostgreSQL)\n• FR-02: Connection configuration (Host, Port, DB, User, Pass)\n• FR-03: Connection verification\n• FR-04: Schema retrieval\n• FR-05: Question input\n• FR-06: Context preparation\n• FR-07: Dialect-aware SQL generation\n• FR-08: SQL preview and editing\n• FR-09: Pre-execution validation\n• FR-10: Controlled query execution\n• FR-11: Structured result display\n• FR-12: Plain-language error handling'
      },
      {
        title: 'Non-Functional Requirements',
        content: 'Performance (<5s generation, non-blocking UI), Security (least-privilege read-only default), Reliability, Usability on mobile/tablet/desktop, Scalability (pagination & row caps).'
      }
    ]
  },
  {
    id: 'architecture',
    number: '7',
    title: 'System Architecture and Design',
    badge: 'Architecture',
    content: 'Modular, layered architecture separating Presentation, Query Orchestration, Schema Processor, Validation & Policy, and Database Adapters.',
    subsections: [
      {
        title: 'High-Level Layers',
        content: '1. Presentation Layer: React & Next.js responsive UI\n2. Query Orchestration: Coordinates intent, context, and validation\n3. Schema Processor: Extracts compact table & relationship graph\n4. Validation & Policy: Verifies allowed operations & prevents destructive calls\n5. Database Adapters: MySQL & PostgreSQL dialect drivers\n6. Result Formatter: Formats rows, metrics, and chart aggregates'
      }
    ]
  },
  {
    id: 'engines',
    number: '8',
    title: 'Database Connectivity & Schema Understanding',
    badge: 'Dialects',
    content: 'Detailed dialect mapping between MySQL and PostgreSQL, including quoting conventions, identifier rules, catalog sources, and pagination.',
    subsections: [
      {
        title: 'Dialect Comparison',
        content: '• MySQL: Default port 3306, backtick quoting, LIMIT/OFFSET, INFORMATION_SCHEMA.\n• PostgreSQL: Default port 5432, double-quote quoting, LIMIT/OFFSET, pg_catalog & schemas, strict boolean types.'
      }
    ]
  },
  {
    id: 'validation',
    number: '10',
    title: 'Query Validation, Execution and Results',
    badge: 'Safety',
    content: 'Zero-trust query execution pipeline. Generated statements must pass dialect syntax check, schema reference validation, and destructive operation policy checks before being submitted.',
    subsections: [
      {
        title: 'Validation Stages',
        content: '1. Syntax verification\n2. Schema reference integrity (tables & columns exist)\n3. Safety policy allowlist (SELECT allowed, DROP/TRUNCATE blocked)\n4. Execution timeouts & maximum row caps'
      }
    ]
  },
  {
    id: 'teststrategy',
    number: '13',
    title: 'Testing Strategy & Verification',
    badge: 'QA Suite',
    content: 'Covers unit tests, dialect integration tests, security policy checks, and end-to-end acceptance scenarios (TC-01 through TC-10).',
    subsections: [
      {
        title: 'Acceptance Criteria',
        content: 'Verified query generation accuracy >= 85%, valid query execution rate >= 95%, dialect-grounded schema references, and resilient error reporting.'
      }
    ]
  }
];

export const GLOSSARY_ITEMS = [
  { term: 'ASKDB', def: 'The natural-language-to-SQL platform described in this system specification.' },
  { term: 'DBMS', def: 'Database Management System; software used to store, manage and query relational databases.' },
  { term: 'SQL', def: 'Structured Query Language used to interact with relational databases.' },
  { term: 'Schema', def: 'The structural definition of a database, including tables, columns, constraints and relationships.' },
  { term: 'Metadata', def: 'Information describing database objects, data types, indexes and keys.' },
  { term: 'Natural Language', def: 'Everyday human language (e.g. English) used to express a query or analytical intent.' },
  { term: 'SQL Dialect', def: 'A specific database engine’s implementation and syntax extensions of SQL (e.g. MySQL vs PostgreSQL).' },
  { term: 'Validation', def: 'Automated syntax, schema reference, and safety checks executed before running queries.' },
  { term: 'Primary Key (PK)', def: 'A column or set of columns that uniquely identifies a row in a database table.' },
  { term: 'Foreign Key (FK)', def: 'A constraint that links a column to a primary key in another table to establish relationships.' }
];
