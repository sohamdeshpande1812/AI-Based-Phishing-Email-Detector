import React from 'react';
import { 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink,
  Filter
} from 'lucide-react';

export default function CorpusAnalyticsView() {
  const corpusStats = {
    totalEmails: "60,000",
    phishingCount: "30,192",
    phishingPct: "50.32%",
    legitimateCount: "29,808",
    legitimatePct: "49.68%",
    trainSplit: "42,000 (70%)",
    valSplit: "9,000 (15%)",
    testSplit: "9,000 (15%)",
    splitMethod: "Stratified Random Sampling (Zero Leakage, Seed 42)"
  };

  const threatCategories = [
    {
      title: "Credential Harvesting",
      share: "34%",
      examples: "Password expirations, SSO portal re-authentication, multi-factor resets",
      risk: "Critical"
    },
    {
      title: "Urgency & Account Suspension",
      share: "28%",
      examples: "Immediate account lockouts, 24-hour compliance deadlines, law enforcement warnings",
      risk: "High"
    },
    {
      title: "Financial & Wire Fraud (BEC)",
      share: "21%",
      examples: "Vendor invoice updates, urgent executive wire transfers, tax filing forms (W-2)",
      risk: "Critical"
    },
    {
      title: "Malicious Attachment & Delivery",
      share: "17%",
      examples: "Failed package delivery notifications, unrequested purchase receipts, encrypted PDFs",
      risk: "High"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 transition-colors duration-150">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              Corpus Intelligence
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Kaggle Zero-Day Phishing Emails Corpus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1.5">
            Dataset Architecture & Zero-Day Methodology
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Statistical breakdown of the verified 60,000 email dataset used to train and validate our three detection architectures.
          </p>
        </div>

        <a
          href="https://www.kaggle.com/datasets/mutahirshaukat/zero-day-phishing-emails-corpus/data"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm self-start md:self-auto"
        >
          <span>Kaggle Dataset Source</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Corpus Volume</span>
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {corpusStats.totalEmails}
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Full-text email messages with subjects and bodies
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Phishing Class</span>
            <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-rose-600 dark:text-rose-400 tracking-tight">
            {corpusStats.phishingCount}
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {corpusStats.phishingPct} of total corpus distribution
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Legitimate Class</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {corpusStats.legitimateCount}
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {corpusStats.legitimatePct} balanced benign control baseline
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-sm shadow-slate-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Holdout Test Set</span>
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-indigo-600 dark:text-indigo-300 tracking-tight">
            9,000
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Strict unseen zero-day evaluation partition
          </p>
        </div>
      </div>

      {/* Split & Data Integrity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-4 shadow-xl shadow-slate-300/30 dark:shadow-none">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Partitioning & Validation Methodology
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            To prevent optimistic evaluation bias and synthetic data leakage, the corpus underwent strict stratified partitioning.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                <span>Training Set (70%)</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">42,000 samples</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                <span>Validation Set (15%)</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">9,000 samples</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">
                <span>Unseen Test Holdout (15%)</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">9,000 samples</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-lg bg-slate-100/90 dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-200">Data Hygiene Guarantee:</div>
            <div>• Stratified by label to preserve equal 50.3% / 49.7% balance.</div>
            <div>• TF-IDF vectorizer and token vocabularies fit exclusively on training partition.</div>
            <div>• Zero test samples exposed during feature engineering or hyperparameter tuning.</div>
          </div>
        </div>

        {/* Threat Tactics Breakdown */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-4 shadow-xl shadow-slate-300/30 dark:shadow-none">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Observed Threat Vectors in Corpus
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Distribution of social engineering strategies and payload mechanisms identified across the phishing samples:
          </p>

          <div className="space-y-3 pt-1">
            {threatCategories.map((cat, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-lg bg-slate-100/80 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-800/80 flex items-start justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{cat.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      cat.risk === 'Critical' 
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    }`}>
                      {cat.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {cat.examples}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 shrink-0">
                  {cat.share}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
