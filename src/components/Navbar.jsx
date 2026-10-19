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
  Moon,
  Check
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
    auto: { shortName: 'Auto', name: 'Auto (Best Ready)', icon: Cpu, latency: 'Dynamic', badge: 'Auto' },
    rf: { shortName: 'Random Forest', name: 'Random Forest', icon: Zap, latency: '0.13 ms', badge: 'Fastest' },
    bilstm: { shortName: 'Bi-LSTM', name: 'Bi-LSTM Neural', icon: Layers, latency: '1.91 ms', badge: 'Sequential' },
    bert: { shortName: 'BERT', name: 'BERT Transformer', icon: BrainCircuit, latency: '86.2 ms', badge: '99.9% Acc' }
  };

  const currentModelMeta = modelMetadata[activeModel] || modelMetadata.auto;
  const ModelIcon = currentModelMeta.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#080D1A]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand Identity & Status */}
        <div className="flex items-center space-x-3 shrink-0">
          <div 
            onClick={() => { onSelectTab('scanner'); onReset(); }}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 border border-blue-400/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>

            <div className="flex items-center space-x-2 whitespace-nowrap">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                PhishShield
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                Enterprise
              </span>
            </div>
          </div>

          {/* Multi-Ring Pulsing Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-medium whitespace-nowrap shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.15)] group cursor-default">
            <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000"></span>
              <span className="animate-pulse absolute inline-flex h-4 w-4 rounded-full bg-emerald-500/20"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            </span>
            <span className="tracking-wide">Engine Active: Zero-Day Shield</span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-[#0E1526] p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => onSelectTab('scanner')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'scanner'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Scanner</span>
          </button>

          <button
            onClick={() => onSelectTab('benchmarks')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'benchmarks'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Model Benchmark</span>
          </button>

          <button
            onClick={() => onSelectTab('corpus')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === 'corpus'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Corpus Analytics</span>
          </button>
        </nav>

        {/* Right: Model Selector, Server Config & Theme Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Active Model Selector */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-[#0F172A] dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-xs whitespace-nowrap"
              title="Select Inference Model"
            >
              <ModelIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-semibold">{currentModelMeta.shortName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 hidden sm:inline">
                {currentModelMeta.latency}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
            
            {modelDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setModelDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span>Active Inference Model</span>
                    <span className="text-[10px] text-emerald-500 font-semibold">Ready</span>
                  </div>
                  <div className="py-1 space-y-1">
                    {[
                      { id: 'auto', name: 'Auto (Best Ready)', icon: Cpu, latency: 'Dynamic selection', desc: 'Auto-selects optimal accuracy & speed' },
                      { id: 'rf', name: 'Random Forest', icon: Zap, latency: '0.13 ms · 100% Acc', desc: 'Ultra-low latency gateway filter' },
                      { id: 'bilstm', name: 'Bi-LSTM Neural', icon: Layers, latency: '1.91 ms · 100% Acc', desc: 'Bidirectional word & syntax modeling' },
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
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-start space-x-3 transition-all ${
                            isSelected 
                              ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 shadow-xs' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-transparent'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 truncate">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                              <span>{item.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{item.latency}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Engine Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200/80 dark:bg-[#0F172A] dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300 transition-all shadow-xs shrink-0 whitespace-nowrap"
            title="Configure Backend API Server"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">
              {backendConfig.mode === 'custom' ? 'FastAPI' : 'Built-in'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 hover:bg-slate-200 dark:bg-[#0F172A] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all shadow-xs shrink-0"
            title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Subnav */}
      <div className="flex md:hidden border-t border-slate-200 dark:border-white/10 px-4 py-2 bg-white dark:bg-[#090D16] space-x-2 transition-colors">
        <button
          onClick={() => onSelectTab('scanner')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-colors ${
            currentTab === 'scanner' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#0F172A]'
          }`}
        >
          Workspace
        </button>
        <button
          onClick={() => onSelectTab('benchmarks')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-colors ${
            currentTab === 'benchmarks' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#0F172A]'
          }`}
        >
          Benchmarks
        </button>
        <button
          onClick={() => onSelectTab('corpus')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center transition-colors ${
            currentTab === 'corpus' 
              ? 'bg-blue-600 text-white shadow-xs' 
              : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#0F172A]'
          }`}
        >
          Corpus
        </button>
      </div>
    </header>
  );
}
