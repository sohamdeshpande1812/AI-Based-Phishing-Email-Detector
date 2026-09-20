import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/60 mt-16 py-6 px-4 sm:px-6 lg:px-8 text-slate-500 text-xs transition-colors duration-150">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-blue-50 border border-blue-200 dark:bg-blue-600/10 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-slate-700 dark:text-slate-300">PhishShield Enterprise</span>
          <span>·</span>
          <span>Zero-Day Email Threat Intelligence Platform</span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Encrypted Envelope Analysis</span>
          </span>
          <span>·</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">
            Random Forest | Bi-LSTM | BERT
          </span>
        </div>

      </div>
    </footer>
  );
}
