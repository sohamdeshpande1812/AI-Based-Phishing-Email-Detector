import React, { useState, useMemo } from 'react';
import { 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink,
  Filter,
  Search,
  Sparkles,
  PieChart,
  Tag,
  Flame,
  Lock,
  Globe,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';

export default function CorpusAnalyticsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all'); // 'all' | 'phishing' | 'legitimate' | 'critical'
  const [selectedRow, setSelectedRow] = useState(null);

  const corpusStats = {
    totalEmails: "60,000",
    phishingCount: "30,192",
    phishingPct: 50.32,
    legitimateCount: "29,808",
    legitimatePct: 49.68,
    trainSplit: "42,000 (70%)",
    valSplit: "9,000 (15%)",
    testSplit: "9,000 (15%)",
    splitMethod: "Stratified Random Sampling (Zero Leakage, Seed 42)"
  };

  const threatVectors = [
    {
      title: "Credential Harvesting & SSO Phish",
      share: 34,
      risk: "High Risk",
      icon: Lock,
      color: "text-rose-500",
      barColor: "bg-rose-500",
      details: "Password expirations, fake Okta/Microsoft portals, multi-factor credential captures."
    },
    {
      title: "Urgency, Panic & Lockout Coercion",
      share: 28,
      risk: "High Risk",
      icon: Flame,
      color: "text-amber-500",
      barColor: "bg-amber-500",
      details: "24-hour termination deadlines, frozen bank balance warnings, security breach panic."
    },
    {
      title: "Business Email Compromise (BEC) & Invoicing",
      share: 21,
      risk: "High Risk",
      icon: DollarSign,
      color: "text-rose-500",
      barColor: "bg-rose-500",
      details: "CEO direct deposit overrides, fake supplier wire instructions, W-2 tax harvesting."
    },
    {
      title: "Brand Impersonation & Malicious URLs",
      share: 17,
      risk: "Suspicious",
      icon: Globe,
      color: "text-blue-500",
      barColor: "bg-blue-500",
      details: "PayPal, Amazon, FedEx shipping alerts with typosquatted lookalike domains (.xyz, .top)."
    }
  ];

  const highRiskTokens = [
    { token: "verify credentials", count: 14820, weight: "critical" },
    { token: "account suspended", count: 12940, weight: "critical" },
    { token: "within 24 hours", count: 11450, weight: "high" },
    { token: "unauthorized transaction", count: 9810, weight: "high" },
    { token: "direct deposit", count: 8640, weight: "high" },
    { token: "password expires", count: 8120, weight: "high" },
    { token: "confirm your identity", count: 7890, weight: "high" },
    { token: "wire transfer", count: 6540, weight: "medium" },
    { token: "billing update", count: 6120, weight: "medium" },
    { token: "login portal", count: 5930, weight: "medium" },
    { token: "sso authentication", count: 5410, weight: "medium" },
    { token: "immediate action", count: 5120, weight: "medium" }
  ];

  // Curated labeled corpus dataset samples for interactive exploration
  const corpusDataset = [
    {
      id: "CORPUS-8921",
      sender: "security-alert@service-paypal-verify.com",
      subject: "URGENT: Your account has been suspended due to suspicious activity",
      label: "Phishing",
      riskBadge: "High Risk",
      vector: "Credential Theft",
      tokens: ["within 24 hours", "account suspended", "verify credentials"],
      date: "2026-10-14"
    },
    {
      id: "CORPUS-8922",
      sender: "hr-payroll-notice@internal-company-portal.net",
      subject: "MANDATORY: Update Your Direct Deposit & Tax Withholding Information Immediately",
      label: "Phishing",
      riskBadge: "High Risk",
      vector: "BEC / Financial",
      tokens: ["direct deposit", "w-2 form", "experience delays"],
      date: "2026-10-15"
    },
    {
      id: "CORPUS-8923",
      sender: "admin-notification@micosoft-online-support.com",
      subject: "Action Required: Your Microsoft 365 password expires in 2 hours",
      label: "Phishing",
      riskBadge: "High Risk",
      vector: "Credential Theft",
      tokens: ["password expires", "within 2 hours", "validate now"],
      date: "2026-10-15"
    },
    {
      id: "CORPUS-8924",
      sender: "invoicing@apex-global-dispatch.top",
      subject: "Overdue Remittance Notice: Invoice #INV-88219 (Payment Due)",
      label: "Suspicious",
      riskBadge: "Suspicious",
      vector: "Brand Spoofing",
      tokens: ["overdue remittance", "wire transfer", "late administrative"],
      date: "2026-10-16"
    },
    {
      id: "CORPUS-8925",
      sender: "alex.rivera@techcorp.com",
      subject: "Sprint Planning & Architecture Review - Thursday 2:00 PM EST",
      label: "Legitimate",
      riskBadge: "Benign",
      vector: "Standard Corporate",
      tokens: ["sprint planning", "google meet", "architecture review"],
      date: "2026-10-16"
    },
    {
      id: "CORPUS-8926",
      sender: "notifications@github.com",
      subject: "[GitHub] Dependabot alert resolved: CVE-2026-1128 in mini-project repository",
      label: "Legitimate",
      riskBadge: "Benign",
      vector: "Automated Service",
      tokens: ["dependabot", "cve vulnerability", "closed and merged"],
      date: "2026-10-17"
    },
    {
      id: "CORPUS-8927",
      sender: "billing@stripe.com",
      subject: "Your monthly invoice summary for September 2026",
      label: "Legitimate",
      riskBadge: "Benign",
      vector: "Payment Gateway",
      tokens: ["invoice summary", "stripe billing", "receipt available"],
      date: "2026-10-17"
    },
    {
      id: "CORPUS-8928",
      sender: "account-update@wellsfargo-secure-auth.xyz",
      subject: "Security Notification: Temporary debit card lock due to unusual POS activity",
      label: "Phishing",
      riskBadge: "High Risk",
      vector: "Credential Theft",
      tokens: ["temporary lock", "unusual pos", "confirm pin"],
      date: "2026-10-18"
    }
  ];

  // Filtered dataset rows based on search and classification filter
  const filteredRows = useMemo(() => {
    return corpusDataset.filter(row => {
      const matchesSearch = 
        row.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.vector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.tokens.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (filterClass === 'phishing') return row.label === 'Phishing';
      if (filterClass === 'legitimate') return row.label === 'Legitimate';
      if (filterClass === 'critical') return row.riskBadge === 'High Risk';
      return true;
    });
  }, [searchQuery, filterClass]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Corpus Intelligence & Zero-Day Distribution
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Dataset: 60,000 Verified Labeled Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
            Dataset Architecture & Zero-Day Threat Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Detailed telemetry on class balancing, adversarial attack vectors, and high-frequency linguistic indicators utilized for training our ML models.
          </p>
        </div>

        <a
          href="https://www.kaggle.com/datasets/mutahirshaukat/zero-day-phishing-emails-corpus/data"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs self-start md:self-auto shrink-0"
        >
          <span>Kaggle Zero-Day Source</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* ==================================================================== */}
      {/* 1. DATASET OVERVIEW KPI CARDS (4 Cards + Distribution Bar)          */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Volume */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl space-y-1 cyber-bento-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Total Corpus Volume</span>
            <Database className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
            {corpusStats.totalEmails}
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Verified raw email envelopes and full payloads
          </p>
        </div>

        {/* Phishing Distribution */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl space-y-1 cyber-bento-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Phishing Samples</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-rose-500">
            {corpusStats.phishingCount}
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {corpusStats.phishingPct}% adversarial attack distribution
          </p>
        </div>

        {/* Legitimate Distribution */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl space-y-1 cyber-bento-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Legitimate Control</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-500">
            {corpusStats.legitimateCount}
          </div>
          <p className="text-xs text-slate-500 font-sans">
            {corpusStats.legitimatePct}% balanced benign control baseline
          </p>
        </div>

        {/* Unseen Holdout */}
        <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl space-y-1 cyber-bento-card">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Zero-Day Holdout</span>
            <Filter className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-500">
            9,000
          </div>
          <p className="text-xs text-slate-500 font-sans">
            15% strictly unseen test split (seed 42)
          </p>
        </div>

      </div>

      {/* Sleek Class Balance Progress Bar */}
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center space-x-1.5 text-rose-500 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Phishing Class ({corpusStats.phishingPct}%)</span>
          </span>
          <span className="text-slate-500 font-semibold">Perfect 50/50 Class Parity Balance</span>
          <span className="flex items-center space-x-1.5 text-emerald-500 font-bold">
            <span>Legitimate Clean ({corpusStats.legitimatePct}%)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-3 overflow-hidden flex p-0.5">
          <div className="bg-rose-500 h-full rounded-l-full transition-all duration-500" style={{ width: `${corpusStats.phishingPct}%` }} />
          <div className="bg-emerald-500 h-full rounded-r-full transition-all duration-500" style={{ width: `${corpusStats.legitimatePct}%` }} />
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. TOP THREAT VECTORS & HIGH-RISK KEYWORD CLOUD                     */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Threat Vector Breakdown (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-blue-500" />
              <span>Primary Attack Vector Taxonomy</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">Corpus Analysis</span>
          </div>

          <div className="space-y-3">
            {threatVectors.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${v.color}`} />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{v.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                        v.risk === 'High Risk' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}>
                        {v.risk}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{v.share}%</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {v.details}
                  </p>

                  <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${v.barColor} rounded-full`} style={{ width: `${v.share * 2.5}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Risk Keyword Cloud & Frequency N-Grams (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-500" />
              <span>Adversarial N-Gram Cloud</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">TF-IDF Weights</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Statistically significant tokens weighted highest by TF-IDF & Bi-LSTM attention mechanisms:
          </p>

          {/* Interactive Cloud of Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {highRiskTokens.map((item, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center space-x-1.5 shadow-xs transition-transform hover:scale-105 ${
                  item.weight === 'critical'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                    : item.weight === 'high'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25'
                }`}
              >
                <span>{item.token}</span>
                <span className="text-[10px] opacity-70 font-sans">({(item.count / 1000).toFixed(1)}k)</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">Feature Engineering Notes:</span>
            <p>• Unigrams and bigrams extracted with sublinear term-frequency scaling.</p>
            <p>• Min-df = 3, Max-df = 0.90 to eliminate ubiquitous stopwords while preserving rare spear-phish lures.</p>
          </div>
        </div>

      </div>

      {/* ==================================================================== */}
      {/* 3. INTERACTIVE DATASET EXPLORER (Searchable & Filterable Table)     */}
      {/* ==================================================================== */}
      <div className="rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-200">
        
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/60">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              <span>Interactive Labeled Corpus Explorer</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect ground-truth labeled email samples, detected tokens, and risk categorizations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sender, token, subject..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#090D16] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Classification Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-200/80 dark:bg-[#090D16] p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono shrink-0">
              <button
                onClick={() => setFilterClass('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterClass === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterClass('phishing')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterClass === 'phishing' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Phish
              </button>
              <button
                onClick={() => setFilterClass('legitimate')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  filterClass === 'legitimate' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Clean
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-slate-950/40 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Sample ID</th>
                <th className="py-3 px-4">Sender Envelope</th>
                <th className="py-3 px-4">Subject & Context</th>
                <th className="py-3 px-4">Attack Vector</th>
                <th className="py-3 px-4">Flagged N-Grams</th>
                <th className="py-3 px-4 text-right">Ground Truth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-sans">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedRow(row)}
                  className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {row.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {row.sender}
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-100 font-medium max-w-sm truncate">
                    {row.subject}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {row.vector}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {row.tokens.slice(0, 2).map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                      row.label === 'Phishing'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                        : row.label === 'Suspicious'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                    }`}>
                      {row.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs font-mono">
            No corpus records found matching "{searchQuery}". Try a different keyword or reset filters.
          </div>
        )}

      </div>

      {/* Row Inspection Detail Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs font-mono font-bold text-blue-500">{selectedRow.id} · Details</span>
              <button
                onClick={() => setSelectedRow(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-500">Sender:</span>
                <div className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">{selectedRow.sender}</div>
              </div>
              <div>
                <span className="text-slate-500">Subject:</span>
                <div className="text-slate-800 dark:text-slate-200 font-bold mt-0.5">{selectedRow.subject}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500">Vector Category:</span>
                  <div className="text-slate-800 dark:text-slate-200 font-bold">{selectedRow.vector}</div>
                </div>
                <div>
                  <span className="text-slate-500">Ground Truth Label:</span>
                  <div className="text-rose-500 font-bold">{selectedRow.label}</div>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-slate-500">Detected High-Risk N-Gram Tokens:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedRow.tokens.map((t, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 text-rose-500 font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedRow(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
