# ASKDB — Natural Language to SQL Query Platform

> **Interactive Web-Based Database Querying Platform**  
> Supports MySQL and PostgreSQL with Schema Grounding, Pre-Execution Validation, Visual ERD Graphs, and Analytical Result Summaries.

---

## 🚀 Overview

**ASKDB** bridges the barrier between everyday human language and relational databases. By grounding natural-language requests into the active database schema, ASKDB synthesizes dialect-tailored SQL statements (MySQL and PostgreSQL), validates syntax, verifies references and safety policies, and allows users to review and execute queries with instant visual feedback and data exports.

### 🌟 Key Capabilities
- **Database Connectivity (FR-01, FR-02, FR-03):** Select MySQL 8+ or PostgreSQL 14+, configure host, port, database, user, masked password, and TLS/SSL encryption with simulated connection latency verification.
- **Pre-Configured Datasets:** Preloaded with two rich enterprise relational databases:
  - `techcorp_enterprise` (MySQL): HR & Sales with `employees`, `departments`, `customers`, `orders`, and `products`.
  - `fintrack_saas` (PostgreSQL): SaaS analytics with `users`, `plans`, `subscriptions`, and `invoices`.
- **Interactive Schema Explorer & ERD (FR-04, Section 8, Section 15.3):**
  - Explore tables, columns, data types, primary keys (PK 🔑), foreign keys (FK 🔗), and nullability.
  - Interactive **Entity Relationship Diagram (ERD)** mapping constraints across tables.
  - Live table data preview modals.
- **Natural Language to SQL Processing (FR-05, FR-06, FR-07, Section 9):**
  - 4-stage pipeline visualization: Intent Extraction ➔ Schema Grounding ➔ Dialect Synthesis ➔ Policy Validation.
  - Dialect-aware SQL generator handling joins, grouping, ordering, filtering, and limit caps.
  - Appendix A sample queries ready with one-click recommendation pills.
- **SQL Preview & Interactive Editor (FR-08):**
  - Line numbers, syntax highlighting, format SQL, copy to clipboard, and manual tweak mode.
  - **Plain-English Query Explainer**: Clause-by-clause breakdown (SELECT, FROM, JOIN, WHERE, GROUP BY, ORDER BY, LIMIT) for students and analysts.
- **Zero-Trust Validation Engine (FR-09, Section 10):**
  - Syntactic balance verification.
  - Schema reference integrity checks (detects unknown tables or columns).
  - Safety Policy enforcement: Blocks destructive statements (`DROP`, `TRUNCATE`, unrestricted `DELETE`) to guarantee safe data exploration.
- **Execution & Analytical Visualizations (FR-10, FR-11, FR-12, Section 15.3):**
  - Execution speed (ms), row counts, and status indicators.
  - Sortable grid table with search and pagination (10, 25, 50 rows).
  - **Interactive Bar Charts & KPI Cards** for aggregated numeric metrics.
  - Export to **CSV**, **JSON**, or copy as **Markdown Table**.
  - Explicit empty-result state handling (TC-08).
- **Automated Test Suite (Section 13.3):**
  - Live interactive runner verifying test cases **TC-01 through TC-10** with 100% compliance.
- **Integrated Project Documentation (Sections 1–17 & Glossary):**
  - Complete reference browser directly inside the app with search, architecture diagrams, user personas, and glossary.
- **Responsive Across All Devices:**
  - Optimized for **Mobile** (touch-friendly bottom navigation, cards), **Tablet** (adaptive layouts), and **Desktop** (full IDE studio).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Styling:** Fully responsive dark modern developer IDE theme (inspired by Datagrip, Supabase, and Linear)
- **Engines Supported:** MySQL and PostgreSQL dialects

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:3000` or `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🧪 Acceptance Test Cases (Section 13.3)

| Test ID | Category | Scenario | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Connection | Valid connection credentials | Connection established, latency measured | Passed |
| **TC-02** | Connection | Invalid password handling | Safe error without credential leak | Passed |
| **TC-03** | Schema | Metadata extraction | Tables, columns, and keys discovered | Passed |
| **TC-04** | Generation | "Show all employees" | Grounded in actual schema table | Passed |
| **TC-05** | Generation | "Five highest-paid employees" | Uses `ORDER BY salary DESC LIMIT 5` | Passed |
| **TC-06** | Validation | Unknown column reference | Catches invalid column references | Passed |
| **TC-07** | Execution | Valid SELECT query | Rows returned and formatted in grid | Passed |
| **TC-08** | Execution | Zero matching records | Clear empty-result state displayed | Passed |
| **TC-09** | Execution | Database unavailable | Graceful error recovery | Passed |
| **TC-10** | Security | Destructive DROP / TRUNCATE | Safety policy blocks operation | Passed |

---

## 👥 User Personas Served

1. **Persona A — Student:** Learns SQL by comparing natural language queries with dialect-grounded SQL statements and clause-by-clause explainers.
2. **Persona B — Data Analyst:** Rapidly extracts aggregations, sorts records, visualizes trends on charts, and exports to CSV.
3. **Persona C — Developer:** Accelerates routine query drafting and tests join constraints on live relational schemas.
