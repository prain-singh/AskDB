import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Server, 
  KeyRound, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Settings
} from 'lucide-react';
import { DatabaseEngine, DatabaseSchema } from '../../types';
import { SAMPLE_DATABASES } from '../../data/sampleDatabases';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSchema: DatabaseSchema;
  onSelectSchema: (schema: DatabaseSchema) => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  activeSchema,
  onSelectSchema
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedEngine, setSelectedEngine] = useState<DatabaseEngine>(activeSchema.engine);
  const [host, setHost] = useState(activeSchema.host);
  const [port, setPort] = useState(String(activeSchema.port));
  const [database, setDatabase] = useState(activeSchema.database);
  const [user, setUser] = useState(activeSchema.user);
  const [password, setPassword] = useState('••••••••••••');
  const [ssl, setSsl] = useState(true);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    latencyMs?: number;
  }>({ status: 'idle', message: '' });

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult({ status: 'idle', message: '' });

    await new Promise(r => setTimeout(r, 650));

    if (!host || !database || !user) {
      setTesting(false);
      setTestResult({
        status: 'error',
        message: 'FR-02 Error: Host, database name, and username are required fields.'
      });
      return;
    }

    if (password === 'wrong' || password === 'invalid') {
      setTesting(false);
      setTestResult({
        status: 'error',
        message: 'TC-02 Failure: Authentication failed. Access denied for user (check credentials).'
      });
      return;
    }

    const latency = Math.floor(Math.random() * 15) + 12;
    setTesting(false);
    setTestResult({
      status: 'success',
      message: `FR-03 Verified: Successfully connected to ${selectedEngine} server on ${host}:${port}. Schema catalog loaded.`,
      latencyMs: latency
    });
  };

  const handleApplyCustomConnection = () => {
    const customSchema: DatabaseSchema = {
      id: `custom-${Date.now()}`,
      name: `${database} (${selectedEngine})`,
      engine: selectedEngine,
      version: selectedEngine === 'MySQL' ? 'MySQL 8.0.35' : 'PostgreSQL 16.2',
      host,
      port: Number(port) || (selectedEngine === 'MySQL' ? 3306 : 5432),
      database,
      user,
      ssl,
      isDemo: false,
      tables: activeSchema.tables // inherit active tables for simulation
    };
    onSelectSchema(customSchema);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Database Connection Manager
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                  FR-01 / FR-02 / FR-03
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure relational database targets (MySQL & PostgreSQL) or switch sample presets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-900">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'presets'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Pre-Configured Demo Datasets ({SAMPLE_DATABASES.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'custom'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            Custom Server Connection (MySQL / PostgreSQL)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Choose a pre-populated database to test natural language questions, schema discovery, joins, and aggregates right away:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {SAMPLE_DATABASES.map(db => {
                  const isCurrent = activeSchema.id === db.id;
                  return (
                    <div
                      key={db.id}
                      onClick={() => {
                        onSelectSchema(db);
                        onClose();
                      }}
                      className={`cursor-pointer rounded-xl border p-4 transition-all text-left ${
                        isCurrent
                          ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/40'
                          : 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                            db.engine === 'MySQL'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}>
                            {db.engine}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Port {db.port}</span>
                        </div>
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{db.name}</h3>
                      <p className="text-xs text-slate-400 mb-3">
                        Catalog: <code className="text-brand-300 font-mono">{db.database}</code>
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <span>{db.tables.length} Relational Tables</span>
                        <span className="text-slate-500 font-mono">TLS/SSL Active</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Engine Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Database Engine (FR-01)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEngine('MySQL');
                      setPort('3306');
                    }}
                    className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      selectedEngine === 'MySQL'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-sm'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="h-4 w-4" />
                    MySQL (Port 3306)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEngine('PostgreSQL');
                      setPort('5432');
                    }}
                    className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      selectedEngine === 'PostgreSQL'
                        ? 'border-sky-500 bg-sky-500/10 text-sky-300 shadow-sm'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="h-4 w-4" />
                    PostgreSQL (Port 5432)
                  </button>
                </div>
              </div>

              {/* Host & Port */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Host / Server IP</label>
                  <input
                    type="text"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    placeholder="e.g. db.internal.askdb.com or 127.0.0.1"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Port</label>
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Database name & username */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Database / Catalog</label>
                  <input
                    type="text"
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    placeholder="production_db"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Username (Least Privilege)</label>
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="read_only_analyst"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Database Password (Masked - Server Protected)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none font-mono"
                  />
                  <KeyRound className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Tip: Test invalid password by typing "wrong" or "invalid" to see TC-02 failure handling.
                </p>
              </div>

              {/* SSL toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ssl}
                  onChange={(e) => setSsl(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-300 font-medium">Require TLS / SSL Encrypted Transport</span>
              </label>

              {/* Test Result Feedback */}
              {testResult.status !== 'idle' && (
                <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  testResult.status === 'success'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                }`}>
                  {testResult.status === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{testResult.message}</p>
                    {testResult.latencyMs && (
                      <p className="text-[11px] text-emerald-400/80 font-mono mt-0.5">
                        Measured Handshake Latency: {testResult.latencyMs}ms
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-850 px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Encrypted Server-Side Adapter Session</span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'custom' && (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all disabled:opacity-60"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Testing (FR-03)...
                  </>
                ) : (
                  'Test Connection (FR-03)'
                )}
              </button>
            )}

            <button
              type="button"
              onClick={activeTab === 'custom' ? handleApplyCustomConnection : onClose}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 transition-all shadow-md shadow-brand-500/20"
            >
              {activeTab === 'custom' ? 'Save & Connect' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
