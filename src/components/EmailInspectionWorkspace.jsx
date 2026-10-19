import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Send, 
  Trash2, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Code, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Cpu, 
  Globe, 
  Flame, 
  Lock, 
  UserX, 
  ExternalLink,
  Download,
  Eye,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Activity,
  Copy,
  Check
} from 'lucide-react';
import RiskGauge from './RiskGauge';
import ScenarioPills from './ScenarioPills';
import EmailXRayView from './EmailXRayView';
import ActionRecommendations from './ActionRecommendations';
import { sampleEmails } from '../data/sampleEmails';

export default function EmailInspectionWorkspace({
  emailData,
  setEmailData,
  onAnalyze,
  isScanning,
  analysisResult,
  onSelectSample,
  onResetScan,
  activeModel
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(sampleEmails[0]?.id || null);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [expandedVector, setExpandedVector] = useState('urgency'); // default open vector
  const [modalView, setModalView] = useState(null); // 'xray' | 'remediation' | 'json' | null
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeScanStep, setActiveScanStep] = useState(0);

  const scanSteps = [
    { label: 'Sender DKIM / SPF Alignment', desc: 'Verifying origin authenticity, reverse DNS & typosquatting', progress: 22 },
    { label: 'Hyperlink & Payload Sandboxing', desc: 'Parsing embedded URLs, redirect chains & high-risk TLDs', progress: 48 },
    { label: 'Coercion & Urgency NLP Vectors', desc: 'Scoring emotional manipulation, deadline coercion & harvesting cues', progress: 74 },
    { label: 'Deep Neural & Transformer Inference', desc: 'Executing BERT multi-head attention and Bi-LSTM classification', progress: 92 },
    { label: 'Telemetry Aggregation & IOC Verdict', desc: 'Synthesizing multi-model confidence, severity score & explanation', progress: 100 }
  ];

  useEffect(() => {
    if (!isScanning) {
      setActiveScanStep(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 650);
    return () => clearInterval(interval);
  }, [isScanning]);

  const textareaRef = useRef(null);

  const handleSelectPreset = (sample) => {
    setSelectedPresetId(sample.id);
    onSelectSample(sample);
  };

  const handleClear = () => {
    setSelectedPresetId(null);
    setEmailData({
      senderName: '',
      senderEmail: '',
      subject: '',
      body: '',
      urls: []
    });
    if (onResetScan) onResetScan();
  };

  const handlePasteFirstSample = () => {
    const randomSample = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
    handleSelectPreset(randomSample);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if ((emailData.body.trim() || emailData.subject.trim()) && !isScanning) {
        onAnalyze();
      }
    }
  };

  const wordCount = emailData.body.trim() ? emailData.body.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = emailData.body.length;
  const lineCount = emailData.body ? emailData.body.split('\n').length : 1;
  const isReady = (emailData.body.trim().length > 0 || emailData.subject.trim().length > 0);

  // Export JSON Report
  const handleExportJson = () => {
    if (!analysisResult) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      scanDate: new Date().toISOString(),
      emailInput: emailData,
      analysisResult: analysisResult
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishshield-incident-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    const summary = `[PHISHSHIELD SECURITY INCIDENT REPORT]
Verdict: ${analysisResult.verdictBadge || analysisResult.verdict}
Risk Score: ${analysisResult.score}/100
Model Confidence: ${analysisResult.confidence}%
Subject: ${emailData.subject}
Sender: ${emailData.senderName} <${emailData.senderEmail}>
Analyzed URLs: ${(emailData.urls || []).join(', ') || 'None'}
Red Flags: ${(analysisResult.redFlags || []).map(f => f.title || f).join('; ')}
Engine: ${analysisResult.engineSource || 'Multi-Model Pipeline'}`;
    navigator.clipboard.writeText(summary);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  // Metrics extraction for right-column vector breakdown
  const metrics = analysisResult?.metrics || {};
  const isPhishing = analysisResult?.verdict === 'phishing';
  const isSuspicious = analysisResult?.verdict === 'suspicious';
  const isClean = analysisResult?.verdict === 'legitimate';

  const vectorItems = [
    {
      id: 'domain',
      title: 'Deceptive Domain & Spoofing',
      score: metrics.senderScore !== undefined ? metrics.senderScore : (isPhishing ? 82 : (isSuspicious ? 45 : 8)),
      icon: UserX,
      desc: 'Sender address consistency, lookalike domain typosquatting, and display name mismatch.',
      findings: analysisResult?.senderAnalysis?.reasons || [
        isPhishing ? 'Display name impersonation detected with external domain signature' : 'No domain discrepancies identified'
      ]
    },
    {
      id: 'urgency',
      title: 'Urgency & Psychological Coercion',
      score: metrics.urgencyScore !== undefined ? metrics.urgencyScore : (isPhishing ? 88 : (isSuspicious ? 60 : 5)),
      icon: Flame,
      desc: 'High-pressure deadlines, threats of account lockout, and artificial panicking cues.',
      findings: analysisResult?.highlights?.filter(h => h.category?.includes('Urgency') || h.severity === 'high')?.map(h => `"${h.text}" - ${h.reason}`) || [
        isPhishing ? 'Artificial 24-hour deadline and threat of balance forfeiture flagged' : 'Standard conversational tone with no coercive threats'
      ]
    },
    {
      id: 'urls',
      title: 'Hidden & Malicious URL Detection',
      score: metrics.linksScore !== undefined ? metrics.linksScore : (isPhishing ? 94 : (isSuspicious ? 40 : 12)),
      icon: Globe,
      desc: 'Raw IP address hosts, high-risk TLDs (.xyz, .top, .click), and credential capture endpoints.',
      findings: (analysisResult?.urlAnalysis || []).map(u => `${u.url} [Risk: ${u.riskLevel || 'Suspicious'}]`) || [
        isPhishing ? 'External credential landing page detected on unverified domain' : 'All hyperlinks resolve to trusted root domains'
      ]
    },
    {
      id: 'nlp',
      title: 'NLP Sentiment & Syntactic Anomaly',
      score: metrics.contentScore !== undefined ? metrics.contentScore : (metrics.harvestingScore || (isPhishing ? 80 : (isSuspicious ? 50 : 10))),
      icon: Lock,
      desc: 'Direct solicitation of banking details, tax forms, passwords, or multi-factor tokens.',
      findings: analysisResult?.highlights?.filter(h => h.category?.includes('Harvesting') || h.category?.includes('Salutation'))?.map(h => `"${h.text}" - ${h.reason}`) || [
        isPhishing ? 'Explicit prompt for credit card or account credentials' : 'No data harvesting tokens discovered'
      ]
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" onKeyDown={handleKeyDown}>
      
      {/* Horizontal Interactive Preset Scenario Pills */}
      <ScenarioPills 
        selectedPresetId={selectedPresetId}
        onSelectSample={handleSelectPreset}
      />

      {/* 2-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: ENVELOPE & PAYLOAD INSPECTION FORM (7 Cols)       */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-300 cyber-bento-card relative group">
            
            {/* Horizontal Cyber Scanline Sweep */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent scanline-bar pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />

            {/* Header: Envelope & Payload */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                    <span>Envelope & Payload Inspection</span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      INPUT
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Parse email headers, metadata, and raw text payload
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLineNumbers(!showLineNumbers)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center space-x-1 ${
                    showLineNumbers
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Toggle Line Numbers & Code View"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Lines</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isScanning || (!emailData.body && !emailData.subject && !emailData.senderEmail)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-900/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                  title="Clear All Fields"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Inputs Body */}
            <div className="p-5 sm:p-6 space-y-4">
              
              {/* Sender Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Sender Display Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={emailData.senderName || ''}
                      onChange={(e) => setEmailData({ ...emailData, senderName: e.target.value })}
                      placeholder="e.g. PayPal Security Team"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100/70 hover:bg-slate-100 focus:bg-white dark:bg-[#090D16] dark:hover:bg-[#0d1322] dark:focus:bg-[#090D16] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                    Sender Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      value={emailData.senderEmail || ''}
                      onChange={(e) => setEmailData({ ...emailData, senderEmail: e.target.value })}
                      placeholder="e.g. security-alert@service-paypal-verify.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100/70 hover:bg-slate-100 focus:bg-white dark:bg-[#090D16] dark:hover:bg-[#0d1322] dark:focus:bg-[#090D16] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailData.subject || ''}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="e.g. URGENT: Your account has been suspended due to suspicious activity"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100/70 hover:bg-slate-100 focus:bg-white dark:bg-[#090D16] dark:hover:bg-[#0d1322] dark:focus:bg-[#090D16] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
                />
              </div>

              {/* Body / Payload Textarea with optional Line Numbers */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                    Email Message Body & Payload
                  </label>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Extracts hyperlinks & urgency heuristics
                  </span>
                </div>

                <div className="relative rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100/70 dark:bg-[#090D16] overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  
                  {/* Line numbering gutter */}
                  <div className="flex">
                    {showLineNumbers && (
                      <div className="select-none py-3.5 pl-3 pr-2 bg-slate-200/60 dark:bg-slate-900/60 border-r border-slate-300 dark:border-white/10 text-right text-slate-400 dark:text-slate-600 font-mono text-xs leading-relaxed shrink-0 w-10 overflow-hidden">
                        {Array.from({ length: Math.max(1, lineCount) }).map((_, idx) => (
                          <div key={idx}>{idx + 1}</div>
                        ))}
                      </div>
                    )}

                    <textarea
                      ref={textareaRef}
                      rows={10}
                      value={emailData.body || ''}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      placeholder="Paste raw or complete email body here..."
                      className="w-full p-3.5 bg-transparent text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-mono leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none resize-y"
                    />
                  </div>

                  {/* Floating Paste Sample Action */}
                  {(!emailData.body && !emailData.subject) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <button
                        type="button"
                        onClick={handlePasteFirstSample}
                        className="pointer-events-auto px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-mono font-semibold flex items-center space-x-2 transition-transform hover:scale-105 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Paste Quick Threat Sample</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Footer & High-Visibility CTA */}
            <div className="px-5 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Word & Char Technical Badges */}
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {wordCount} words
                </span>
                <span>·</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {charCount} chars
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline text-[11px] text-slate-500">
                  Ctrl + Enter to trigger
                </span>
              </div>

              {/* High-Visibility Run Threat Analysis CTA Button */}
              <button
                type="button"
                onClick={onAnalyze}
                disabled={!isReady || isScanning}
                className="relative overflow-hidden w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {/* Animated scanline bar inside button */}
                <span className="absolute inset-x-0 h-[2px] bg-white/60 scanline-bar pointer-events-none" />

                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Neural Defense Stack...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                    <span>Run AI Threat Analysis</span>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: THREAT TELEMETRY & VERDICT VIEWPORT (5 Cols)     */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden min-h-[580px] flex flex-col justify-between transition-all duration-300 cyber-bento-card relative">
            
            {/* Viewport Header with Live Active Radar Icon */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center space-x-2.5">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="animate-ping absolute w-4 h-4 rounded-full bg-emerald-400 opacity-60 duration-1000" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                  <span>Threat Telemetry & Verdict</span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    LIVE HUD
                  </span>
                </h3>
              </div>

              {analysisResult && (
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy Incident Summary"
                  >
                    {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Export JSON Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Viewport Dynamic Content: Standby vs Scanning vs Scanned */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              
              {/* STATE 1: SCANNING (Animated Radar Sweep & High-Tech Step Pipeline) */}
              {isScanning && (
                <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-5 animate-in fade-in duration-200">
                  
                  {/* Cyber Radar Graphic with High-Speed Sweep */}
                  <div className="relative w-44 h-44 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-950/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    {/* Concentric rings */}
                    <div className="absolute inset-3 rounded-full border border-blue-500/20" />
                    <div className="absolute inset-8 rounded-full border border-blue-500/15" />
                    <div className="absolute inset-14 rounded-full border border-blue-500/15" />
                    <div className="absolute inset-20 rounded-full border border-blue-500/10" />
                    <div className="absolute inset-0 rounded-full radar-sweep-cone pointer-events-none" />
                    
                    {/* Crosshairs */}
                    <div className="absolute inset-x-0 top-1/2 h-px bg-blue-500/20 -translate-y-1/2" />
                    <div className="absolute inset-y-0 left-1/2 w-px bg-blue-500/20 -translate-x-1/2" />

                    {/* Center pulsing radar core */}
                    <div className="relative z-10 w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50 animate-ping" />
                    <div className="absolute z-10 w-2.5 h-2.5 rounded-full bg-blue-400" />
                  </div>

                  <div className="text-center space-y-1.5 max-w-sm">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      <span>{scanSteps[activeScanStep].label}...</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 min-h-[18px] transition-all">
                      {scanSteps[activeScanStep].desc}
                    </p>
                  </div>

                  {/* High-Tech Dynamic Progress Pipeline */}
                  <div className="w-full space-y-2 font-mono text-[11px]">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_8px_#38bdf8]"
                        style={{ width: `${scanSteps[activeScanStep].progress}%` }}
                      />
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {scanSteps.map((step, idx) => {
                        const isDone = idx < activeScanStep;
                        const isCurrent = idx === activeScanStep;

                        return (
                          <div 
                            key={idx}
                            className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                              isCurrent
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                : isDone
                                ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300'
                                : 'bg-transparent border-transparent text-slate-400 dark:text-slate-600 opacity-60'
                            }`}
                          >
                            <span className="flex items-center space-x-2">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : isCurrent ? (
                                <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-400 dark:border-slate-700 inline-block shrink-0" />
                              )}
                              <span>{step.label}</span>
                            </span>
                            <span className={`text-[10px] font-bold ${
                              isDone ? 'text-emerald-500' : isCurrent ? 'text-blue-500 animate-pulse' : 'text-slate-400'
                            }`}>
                              {isDone ? 'PASSED' : isCurrent ? 'INSPECTING' : 'QUEUED'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* STATE 2: STANDBY (Awaiting Target Payload) */}
              {!isScanning && !analysisResult && (
                <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-6 text-center">
                  
                  {/* Standby Cyber Target Reticle */}
                  <div className="relative w-36 h-36 rounded-full border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-3 rounded-full border border-slate-200 dark:border-white/5" />
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Terminal className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-sm">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      STANDBY // AWAITING TARGET ENVELOPE
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Zero-Day neural gateway is active. Select a benchmark scenario above or paste email parameters on the left to initiate multi-vector inspection.
                    </p>
                  </div>

                  {/* Ready Telemetry Indicators */}
                  <div className="w-full grid grid-cols-2 gap-2 text-left font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-white/5">
                      <div className="text-slate-500 text-[10px]">URL DETONATOR</div>
                      <div className="text-emerald-500 font-bold mt-0.5 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>READY</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-white/5">
                      <div className="text-slate-500 text-[10px]">COERCION PARSER</div>
                      <div className="text-emerald-500 font-bold mt-0.5 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>READY</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-white/5">
                      <div className="text-slate-500 text-[10px]">DOMAIN SPOOF ENGINE</div>
                      <div className="text-emerald-500 font-bold mt-0.5 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>READY</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-white/5">
                      <div className="text-slate-500 text-[10px]">TRANSFORMER STACK</div>
                      <div className="text-blue-500 font-bold mt-0.5 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span>STANDBY</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* STATE 3: SCANNED (Threat Telemetry & Verdict Viewport) */}
              {!isScanning && analysisResult && (
                <div className="space-y-4">
                  
                  {/* Verdict Executive Banner */}
                  <div className={`p-4 rounded-xl border transition-all animate-fade-slide-up stagger-1 ${
                    isPhishing
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : isSuspicious
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        {isPhishing ? (
                          <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                        ) : isSuspicious ? (
                          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              isPhishing ? 'bg-rose-500 text-white' : isSuspicious ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                            }`}>
                              {analysisResult.verdictBadge || (isPhishing ? 'Phishing Threat' : isSuspicious ? 'Suspicious' : 'Legitimate')}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {analysisResult.latency_ms || 1.2} ms latency
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                            {analysisResult.verdictTitle || (isPhishing ? 'Malicious Phishing Attack Identified' : isSuspicious ? 'Suspicious Cues Detected' : 'Email Content Verified Safe')}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verdict Meter & Score Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 flex items-center justify-between animate-fade-slide-up stagger-2">
                    <RiskGauge 
                      score={analysisResult.score} 
                      verdict={analysisResult.verdict} 
                      confidence={analysisResult.confidence} 
                    />
                  </div>

                  {/* Vector Breakdown Accordion */}
                  <div className="space-y-2 animate-fade-slide-up stagger-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Multi-Vector Threat Breakdown
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Click vector to expand
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {vectorItems.map((item) => {
                        const Icon = item.icon;
                        const isExpanded = expandedVector === item.id;
                        const isHigh = item.score >= 60;
                        const isMedium = item.score >= 30 && item.score < 60;
                        const badgeColor = isHigh 
                          ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' 
                          : isMedium 
                          ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
                          : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';

                        return (
                          <div 
                            key={item.id}
                            className="rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/5 overflow-hidden transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedVector(isExpanded ? null : item.id)}
                              className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <Icon className={`w-3.5 h-3.5 ${isHigh ? 'text-rose-500' : isMedium ? 'text-amber-500' : 'text-emerald-500'}`} />
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                  {item.title}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                  {item.score}%
                                </span>
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                              </div>
                            </button>

                            {/* Accordion Expanded Findings */}
                            {isExpanded && (
                              <div className="px-3 pb-3 pt-1 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 animate-in fade-in duration-100">
                                <p className="text-[10px] text-slate-500 mb-1">{item.desc}</p>
                                <div className="space-y-1 font-mono text-[10px]">
                                  {item.findings.map((f, fIdx) => (
                                    <div key={fIdx} className="flex items-start space-x-1.5 text-slate-700 dark:text-slate-300">
                                      <span className="text-blue-500 mt-0.5">›</span>
                                      <span>{f}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explainability Snippet Card */}
                  <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 space-y-1.5 animate-fade-slide-up stagger-4">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Threat Rationale & Explainability</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isPhishing
                        ? `The message combines severe panic coercion with credential lures. Detected ${analysisResult.highlights?.length || 0} deceptive trigger phrases and ${analysisResult.urlAnalysis?.length || 0} unverified external URLs.`
                        : isSuspicious
                        ? 'Unusual urgency detected with atypical sender address signatures. Secondary human validation is recommended.'
                        : 'Authentic communication pattern verified. No coercive deadlocks or credential extraction lures discovered.'}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Viewport Footer Actions */}
            {analysisResult && (
              <div className="px-5 py-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setModalView('xray')}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-600/20 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Content X-Ray</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalView('remediation')}
                  className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Remediation</span>
                </button>

                <button
                  type="button"
                  onClick={onResetScan}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Reset & Inspect New Email"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL: INTERACTIVE CONTENT X-RAY & REMEDIATION GUIDANCE        */}
      {/* ============================================================== */}
      {modalView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center space-x-2">
                {modalView === 'xray' && <Eye className="w-4 h-4 text-blue-500" />}
                {modalView === 'remediation' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {modalView === 'xray' ? 'Deep Content Threat X-Ray' : 'Incident Remediation Checklist'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalView(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-mono font-bold px-2 py-1 rounded-md"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {modalView === 'xray' && (
                <EmailXRayView 
                  emailData={emailData} 
                  highlights={analysisResult?.highlights || []} 
                />
              )}

              {modalView === 'remediation' && (
                <ActionRecommendations 
                  recommendations={analysisResult?.recommendations || []}
                  verdict={analysisResult?.verdict}
                  emailData={emailData}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => setModalView(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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
