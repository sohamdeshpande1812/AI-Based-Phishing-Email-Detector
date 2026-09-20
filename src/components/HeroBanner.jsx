import React from 'react';
import { Zap, BrainCircuit, Layers } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="pt-6 pb-2 text-center max-w-4xl mx-auto px-4 sm:px-6 transition-colors duration-150">
      
      {/* Corpus Defense Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100/90 text-blue-900 border border-blue-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 text-xs font-semibold mb-3 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Zero-Day Corpus Defense · 60,000 Verified Samples</span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
        Zero-Day Phishing Email Threat Analyzer
      </h1>

      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Inspect incoming emails for multi-vector threat indicators including deceptive URLs, urgent coercion, credential harvesting, and identity spoofing using state-of-the-art ML models.
      </p>

      {/* Model Highlights with Distinct Brand Accent Tints */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 text-xs font-medium">
        <span className="px-3 py-1.5 rounded-lg bg-amber-100/80 text-amber-950 border border-amber-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 flex items-center space-x-1.5 shadow-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Random Forest (0.13ms)</span>
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-100/80 text-emerald-950 border border-emerald-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 flex items-center space-x-1.5 shadow-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Bi-LSTM Recurrent (1.91ms)</span>
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-blue-100/80 text-blue-950 border border-blue-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 flex items-center space-x-1.5 shadow-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>BERT Transformer (99.9% Acc)</span>
        </span>
      </div>
    </div>
  );
}
