import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Zap, 
  ChevronDown, 
  BarChart3, 
  Cpu, 
  Layers, 
  BrainCircuit, 
  Database, 
  Mail, 
  Sun, 
  Moon 
} from 'lucide-react';

export default function Navbar({ 
  currentTab,
  onSelectTab,
  backendConfig,
  activeModel,
  onSelectModel,
  onOpenSettings,
  onReset,
  theme = 'dark',
  onToggleTheme
}) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const modelMetadata = {
    auto: { name: 'Auto (Best Ready)', icon: Cpu, latency: 'Dynamic' },
    rf: { name: 'Random Forest', icon: Zap, latency: '0.13 ms' },
    bilstm: { name: 'Bi-LSTM', icon: Layers, latency: '1.91 ms' },
    bert: { name: 'BERT Transformer', icon: BrainCircuit, latency: '86.2 ms' }
  };

  const currentModelMeta = modelMetadata[activeModel] || modelMetadata.auto;
  const ModelIcon = currentModelMeta.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 shadow-xs backdrop-blur-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => { onSelectTab('scanner'); onReset(); }}
          className="flex items-center space-x-3 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                PhishShield <span className="text-blue-600 dark:text-blue-400 font-normal">Enterprise</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded">
                Zero-Day
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
              Multi-Model AI Security Gateway
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-200 dark:bg-slate-900/80 p-1 rounded-lg border border-slate-300 dark:border-slate-800 transition-colors">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'scanner'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/90 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Scanner</span>
          </button>

          <button
            onClick={() => onSelectTab('benchmarks')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'benchmarks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/90 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Model Benchmark</span>
          </button>

          <button
            onClick={() => onSelectTab('corpus')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentTab === 'corpus'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-950 hover:bg-white/90 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Corpus Analytics</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Active Model Selector */}
          <div className="relative">
            <button 
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-lg transition-colors shadow-xs"
            >
              <ModelIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{currentModelMeta.name}</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 hidden lg:inline">({currentModelMeta.latency})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            
            {modelDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setModelDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Active Inference Engine
                  </div>
                  <div className="py-1 space-y-1">
                    {[
                      { id: 'auto', name: 'Auto (Best Ready)', icon: Cpu, latency: 'Dynamic selection', desc: 'Highest available accuracy' },
                      { id: 'rf', name: 'Random Forest', icon: Zap, latency: '0.13 ms · 100% Acc', desc: 'Fastest throughput for gateway' },
                      { id: 'bilstm', name: 'Bi-LSTM', icon: Layers, latency: '1.91 ms · 100% Acc', desc: 'Sequential word & syntax modeling' },
                      { id: 'bert', name: 'BERT Transformer', icon: BrainCircuit, latency: '86.2 ms · 99.9% Acc', desc: 'Deep contextual self-attention' }
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeModel === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectModel(item.id);
                            setModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start space-x-2.5 transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                          <div className="flex-1 truncate">
                            <div className="font-semibold text-slate-900 dark:text-slate-200 flex items-center justify-between">
                              <span>{item.name}</span>
                              {isSelected && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Selected</span>}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{item.latency}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Engine Status / Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-700 transition-colors shadow-xs"
            title="Backend Server Configuration"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">
              {backendConfig.mode === 'custom' ? 'Custom API' : 'FastAPI (Live)'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          </button>

          {/* Light / Dark Mode Theme Slider Switch */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-slate-300 dark:border-slate-800">
            <button
              type="button"
              onClick={onToggleTheme}
              className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border border-slate-300 dark:border-slate-700 bg-slate-300/80 dark:bg-slate-800 p-0.5 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
              role="switch"
              aria-checked={theme === 'light'}
              title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              <span className="sr-only">Toggle Theme</span>
              
              {/* Background indicator icons */}
              <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-500 opacity-50'}`} />
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-600 opacity-50'}`} />
              </span>

              {/* Sliding knob */}
              <span
                className={`pointer-events-none relative flex h-5.5 w-5.5 items-center justify-center rounded-full bg-white dark:bg-slate-950 shadow-md transition-transform duration-200 ease-in-out ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-blue-400" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-500" />
                )}
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Navigation Tabs */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-white dark:bg-slate-950/95 space-x-2 transition-colors">
        <button
          onClick={() => onSelectTab('scanner')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition-colors ${
            currentTab === 'scanner' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-900'
          }`}
        >
          Scanner
        </button>
        <button
          onClick={() => onSelectTab('benchmarks')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition-colors ${
            currentTab === 'benchmarks' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-900'
          }`}
        >
          Benchmarks
        </button>
        <button
          onClick={() => onSelectTab('corpus')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center transition-colors ${
            currentTab === 'corpus' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-900'
          }`}
        >
          Corpus
        </button>
      </div>
    </header>
  );
}
