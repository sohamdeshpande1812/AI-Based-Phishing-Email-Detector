import React from 'react';
import { ShieldCheck, Lock, Activity, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#090D16]/80 backdrop-blur-md mt-16 py-6 px-4 sm:px-6 lg:px-8 text-slate-500 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">PhishShield Enterprise</span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span className="text-slate-600 dark:text-slate-400">Zero-Day Email Threat Intelligence Platform</span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-mono">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span>Encrypted Envelope Analysis</span>
          </span>
          <span className="text-slate-400 dark:text-slate-600">·</span>
          <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
            RF · Bi-LSTM · BERT Transformer
          </span>
        </div>

      </div>
    </footer>
  );
}
