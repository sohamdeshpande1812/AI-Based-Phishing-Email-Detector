import React, { useState } from 'react';
import { X, Server, Check, AlertCircle, Code } from 'lucide-react';
import { testBackendConnection } from '../services/apiService';

export default function BackendConfigModal({
  isOpen,
  onClose,
  backendConfig,
  onSave
}) {
  const [mode, setMode] = useState(backendConfig.mode || 'custom');
  const [url, setUrl] = useState(backendConfig.url || '/api/analyze');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'snippet'

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testBackendConnection(url);
    setTestResult(res);
    setTesting(false);
  };

  const handleSave = () => {
    onSave(mode, url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 transition-colors duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden transition-colors duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Inference Gateway & API Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure FastAPI backend microservice or client-side fallback
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 space-x-3 bg-slate-50/50 dark:bg-slate-950/30">
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Engine Configuration
          </button>
          <button
            onClick={() => setActiveTab('snippet')}
            className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1 ${
              activeTab === 'snippet'
                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>FastAPI Server Schema</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'settings' ? (
            <>
              {/* Engine Mode Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Select Active Detection Engine
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Built-in Engine Card */}
                  <div
                    onClick={() => setMode('builtin')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      mode === 'builtin'
                        ? 'bg-blue-50 border-blue-500 text-slate-900 dark:bg-blue-600/10 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                        Built-in Fallback Engine
                      </span>
                      {mode === 'builtin' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Instant client-side multi-vector NLP, urgency & domain heuristic engine.
                    </p>
                  </div>

                  {/* Custom Backend Card */}
                  <div
                    onClick={() => setMode('custom')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      mode === 'custom'
                        ? 'bg-blue-50 border-blue-500 text-slate-900 dark:bg-blue-600/10 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                        FastAPI ML Microservice (Recommended)
                      </span>
                      {mode === 'custom' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Connects directly to PyTorch & Scikit-Learn trained models (RF, Bi-LSTM, BERT).
                    </p>
                  </div>

                </div>
              </div>

              {/* Custom API URL Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  API Endpoint URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="http://localhost:8001/api/analyze"
                    className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-200 font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleTest}
                    disabled={testing || !url}
                    className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {/* Connection Test Result */}
                {testResult && (
                  <div className={`p-3 rounded-lg border text-xs flex items-start space-x-2 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/60 dark:text-emerald-300'
                      : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800/60 dark:text-rose-300'
                  }`}>
                    {testResult.success ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold">{testResult.message}</div>
                      {testResult.details && (
                        <div className="text-[11px] font-mono mt-0.5 opacity-80">
                          {testResult.details}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The FastAPI microservice provides high-performance endpoints:
              </p>
              <pre className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-blue-700 dark:text-blue-300 overflow-x-auto max-h-72">
{`# Backend Endpoints
GET  /api/health     # Health check & model status
GET  /api/models     # Model list & metadata
GET  /api/benchmark  # Evaluation metrics (RF, Bi-LSTM, BERT)
POST /api/analyze    # Full inference pipeline

# Sample Request:
POST /api/analyze
{
  "senderName": "Security Admin",
  "senderEmail": "admin@service-auth.com",
  "subject": "Immediate Action Required: Password Expired",
  "body": "Please click the link below to verify your account...",
  "model": "bert"  # Options: "auto", "rf", "bilstm", "bert"
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-colors"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
}
