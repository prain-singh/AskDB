import React, { useState, useEffect } from 'react';
import { 
  DatabaseSchema, 
  TableDefinition, 
  ValidationResult, 
  QueryResult, 
  QueryHistoryItem, 
  QueryGenerationStep 
} from './types';
import { SAMPLE_DATABASES } from './data/sampleDatabases';
import { translateNaturalLanguageToSql } from './engine/nlpToSql';
import { validateSql } from './engine/sqlValidator';
import { executeSql } from './engine/sqlExecutor';

// Components
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { StatusBar } from './components/layout/StatusBar';
import { ConnectionModal } from './components/connection/ConnectionModal';
import { SchemaExplorer } from './components/schema/SchemaExplorer';
import { SchemaTableModal } from './components/schema/SchemaTableModal';
import { SchemaERDView } from './components/schema/SchemaERDView';
import { QueryInput } from './components/studio/QueryInput';
import { PipelineVisualizer } from './components/studio/PipelineVisualizer';
import { SqlEditor } from './components/studio/SqlEditor';
import { ValidationBadge } from './components/studio/ValidationBadge';
import { SqlExplainer } from './components/studio/SqlExplainer';
import { ResultsTable } from './components/results/ResultsTable';
import { QueryHistoryDrawer } from './components/history/QueryHistoryDrawer';
import { TestCasesModal } from './components/testsuite/TestCasesModal';
import { DocumentationViewer } from './components/docs/DocumentationViewer';

const DEFAULT_PIPELINE_STEPS: QueryGenerationStep[] = [
  { id: 'intent', title: 'Intent & Entity Extraction', status: 'completed', details: 'Mapped to query intent' },
  { id: 'schema', title: 'Schema Grounding', status: 'completed', details: 'Referenced employees table' },
  { id: 'synthesis', title: 'Dialect Synthesis', status: 'completed', details: 'Targeting MySQL engine' },
  { id: 'validation', title: 'Policy & Syntax Check', status: 'completed', details: 'Read-only query approved' }
];

export const App: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'studio' | 'erd' | 'docs' | 'tests' | 'history'>('studio');
  
  // Database Connection
  const [activeSchema, setActiveSchema] = useState<DatabaseSchema>(SAMPLE_DATABASES[0]);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [selectedTableForModal, setSelectedTableForModal] = useState<TableDefinition | null>(null);

  // Query Studio State
  const [question, setQuestion] = useState('Find the five highest-paid employees');
  const [sql, setSql] = useState('SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees ORDER BY salary DESC LIMIT 5;');
  const [explanation, setExplanation] = useState('Orders records by salary descending and caps results to the top 5 earners.');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<QueryGenerationStep[]>(DEFAULT_PIPELINE_STEPS);

  // Collapsible Schema Sidebar on Desktop
  const [isSchemaSidebarOpen, setIsSchemaSidebarOpen] = useState(true);

  // Query History
  const [history, setHistory] = useState<QueryHistoryItem[]>([
    {
      id: 'hist-init-1',
      question: 'Find the five highest-paid employees',
      sql: 'SELECT employee_id, first_name, last_name, job_title, salary, city FROM employees ORDER BY salary DESC LIMIT 5;',
      engine: 'MySQL',
      databaseName: 'techcorp_db',
      timestamp: 'Today, 20:15',
      status: 'success',
      rowCount: 5,
      executionTimeMs: 16.4,
      isFavorite: true
    },
    {
      id: 'hist-init-2',
      question: 'Show customers from Chennai',
      sql: "SELECT customer_id, customer_name, contact_email, city, country, segment FROM customers WHERE city = 'Chennai';",
      engine: 'MySQL',
      databaseName: 'techcorp_db',
      timestamp: 'Today, 20:10',
      status: 'success',
      rowCount: 3,
      executionTimeMs: 14.2,
      isFavorite: false
    }
  ]);

  // Initial validate & execute on load
  useEffect(() => {
    const val = validateSql(sql, activeSchema);
    setValidation(val);
    handleExecute(sql);
  }, []);

  // Whenever user edits SQL in editor, revalidate
  const handleSqlChange = (newSql: string) => {
    setSql(newSql);
    const val = validateSql(newSql, activeSchema);
    setValidation(val);
  };

  // Switch database schema
  const handleSelectSchema = (newSchema: DatabaseSchema) => {
    setActiveSchema(newSchema);
    // Auto generate default for the new schema
    const defaultQuery = newSchema.engine === 'PostgreSQL' ? 'Show all users' : 'Show all employees';
    setQuestion(defaultQuery);
    const res = translateNaturalLanguageToSql(defaultQuery, newSchema);
    setSql(res.sql);
    setExplanation(res.explanation);
    const val = validateSql(res.sql, newSchema);
    setValidation(val);
    setQueryResult(null);
    setQueryError(null);
  };

  // Generate SQL from Natural Language
  const handleGenerate = async (overrideQuestion?: string) => {
    const queryText = overrideQuestion || question;
    if (!queryText.trim()) return;

    setIsGenerating(true);
    setQueryError(null);

    // Step 1: Intent
    setPipelineSteps([
      { id: 'intent', title: 'Intent & Entity Extraction', status: 'in_progress', details: `Analyzing "${queryText}"...` },
      { id: 'schema', title: 'Schema Grounding', status: 'pending', details: 'Awaiting intent' },
      { id: 'synthesis', title: 'Dialect Synthesis', status: 'pending', details: 'Awaiting schema context' },
      { id: 'validation', title: 'Policy & Syntax Check', status: 'pending', details: 'Awaiting generated query' }
    ]);

    await new Promise(r => setTimeout(r, 180));

    // Step 2: Schema Grounding
    setPipelineSteps(prev => [
      { ...prev[0], status: 'completed', details: 'Identified relational targets' },
      { id: 'schema', title: 'Schema Grounding', status: 'in_progress', details: `Matching catalog "${activeSchema.database}"` },
      prev[2],
      prev[3]
    ]);

    await new Promise(r => setTimeout(r, 200));

    // Step 3: Synthesis
    const translation = translateNaturalLanguageToSql(queryText, activeSchema);
    setPipelineSteps(prev => [
      prev[0],
      { ...prev[1], status: 'completed', details: `Tables: ${translation.matchedTables.join(', ')}` },
      { id: 'synthesis', title: 'Dialect Synthesis', status: 'in_progress', details: `Synthesizing ${activeSchema.engine} SQL` },
      prev[3]
    ]);

    await new Promise(r => setTimeout(r, 180));

    // Step 4: Validation
    const val = validateSql(translation.sql, activeSchema);
    setSql(translation.sql);
    setExplanation(translation.explanation);
    setValidation(val);

    setPipelineSteps(prev => [
      prev[0],
      prev[1],
      { ...prev[2], status: 'completed', details: 'Dialect statements produced' },
      { 
        id: 'validation', 
        title: 'Policy & Syntax Check', 
        status: val.isValid ? 'completed' : 'error', 
        details: val.isValid ? 'Statement verified & approved' : 'Validation flags raised' 
      }
    ]);

    setIsGenerating(false);

    // If valid, auto execute
    if (val.isValid) {
      handleExecute(translation.sql, queryText);
    }
  };

  // Execute Query
  const handleExecute = async (querySqlToRun?: string, promptText?: string) => {
    const targetSql = querySqlToRun || sql;
    if (!targetSql.trim()) return;

    setIsExecuting(true);
    setQueryError(null);

    try {
      const result = await executeSql(targetSql, activeSchema, true);
      setQueryResult(result);

      // Add to history
      const newHistoryItem: QueryHistoryItem = {
        id: `hist-${Date.now()}`,
        question: promptText || question,
        sql: targetSql,
        engine: activeSchema.engine,
        databaseName: activeSchema.database,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'success',
        rowCount: result.totalRows,
        executionTimeMs: result.executionTimeMs,
        isFavorite: false
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 40)]);
    } catch (err: any) {
      setQueryError(err.message || 'Execution failed on target database.');
      setQueryResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

  // Keyboard shortcut listener (Ctrl+Enter or Cmd+Enter to execute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (activeTab === 'studio' && validation?.isValid && !isExecuting) {
          e.preventDefault();
          handleExecute();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, validation, sql, isExecuting]);

  // Load from history
  const handleSelectHistoryItem = (item: QueryHistoryItem) => {
    setQuestion(item.question);
    setSql(item.sql);
    const val = validateSql(item.sql, activeSchema);
    setValidation(val);
    setActiveTab('studio');
    handleExecute(item.sql, item.question);
  };

  // Toggle favorite in history
  const handleToggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  // Query table directly from schema explorer
  const handleQueryTableDirect = (tableName: string) => {
    const tableQuery = `Show all ${tableName}`;
    setQuestion(tableQuery);
    setActiveTab('studio');
    handleGenerate(tableQuery);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeSchema={activeSchema}
        onOpenConnectionModal={() => setIsConnectionModalOpen(true)}
        historyCount={history.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 overflow-hidden relative pb-16 lg:pb-0">
        {activeTab === 'studio' && (
          <div className="flex h-full w-full overflow-hidden">
            {/* Desktop Collapsible Left Sidebar: Schema Explorer (FR-04) */}
            <div className={`hidden lg:block shrink-0 transition-all duration-300 ${
              isSchemaSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
            }`}>
              <SchemaExplorer
                schema={activeSchema}
                onSelectTableForData={(table) => setSelectedTableForModal(table)}
                onQueryTable={handleQueryTableDirect}
                onOpenERD={() => setActiveTab('erd')}
              />
            </div>

            {/* Center Content: Studio Workspace */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-6">
              {/* Question Input Card */}
              <QueryInput
                question={question}
                setQuestion={setQuestion}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                engine={activeSchema.engine}
              />

              {/* Processing Pipeline Step Visualizer */}
              <PipelineVisualizer
                steps={pipelineSteps}
                isGenerating={isGenerating}
              />

              {/* SQL Preview & Interactive Editor */}
              <SqlEditor
                sql={sql}
                setSql={handleSqlChange}
                onExecute={() => handleExecute()}
                isExecuting={isExecuting}
                isValid={validation?.isValid || false}
                engine={activeSchema.engine}
              />

              {/* Real-time Validation & Security Policy Badge */}
              <ValidationBadge validation={validation} />

              {/* Natural Language Query Explainer */}
              <SqlExplainer sql={sql} explanation={explanation} />

              {/* Query Execution Results Table & Chart */}
              <ResultsTable result={queryResult} error={queryError} />
            </div>
          </div>
        )}

        {/* ERD View */}
        {activeTab === 'erd' && (
          <SchemaERDView
            schema={activeSchema}
            onSelectTableForData={(table) => setSelectedTableForModal(table)}
            onQueryTable={handleQueryTableDirect}
          />
        )}

        {/* Test Suite View */}
        {activeTab === 'tests' && (
          <TestCasesModal activeSchema={activeSchema} />
        )}

        {/* Documentation Viewer */}
        {activeTab === 'docs' && (
          <DocumentationViewer />
        )}

        {/* History Drawer */}
        {activeTab === 'history' && (
          <QueryHistoryDrawer
            history={history}
            onSelectQuery={handleSelectHistoryItem}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={() => setHistory([])}
          />
        )}
      </main>

      {/* Bottom Status Bar (Desktop) */}
      <StatusBar
        activeSchema={activeSchema}
        lastExecutionMs={queryResult?.executionTimeMs}
      />

      {/* Mobile / Tablet Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      {/* Database Connection Manager Modal (FR-01, FR-02, FR-03) */}
      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        activeSchema={activeSchema}
        onSelectSchema={handleSelectSchema}
      />

      {/* Table Data Preview Modal */}
      <SchemaTableModal
        table={selectedTableForModal}
        onClose={() => setSelectedTableForModal(null)}
        onQueryThisTable={handleQueryTableDirect}
      />
    </div>
  );
};

export default App;
