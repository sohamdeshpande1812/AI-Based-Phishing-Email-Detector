import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Download, 
  Code, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Cpu
} from 'lucide-react';
import RiskGauge from './RiskGauge';
import ThreatBreakdown from './ThreatBreakdown';
import EmailXRayView from './EmailXRayView';
import ActionRecommendations from './ActionRecommendations';

export default function ResultDashboard({ result, emailData, onResetScan }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'xray' | 'actions' | 'json'

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      scanDate: new Date().toISOString(),
      emailInput: emailData,
      analysisResult: result
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `security-incident-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const isPhishing = result.verdict === 'phishing';
  const isSuspicious = result.verdict === 'suspicious';
  const isLegitimate = result.verdict === 'legitimate';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200 transition-colors duration-200">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onResetScan}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 px-3.5 py-2 rounded-xl transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workspace</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Incident Report</span>
          </button>
        </div>
      </div>

      {/* Main Executive Verdict Banner */}
      <div className={`p-6 sm:p-7 rounded-2xl border transition-all shadow-xl ${
        isPhishing
          ? 'bg-rose-500/10 border-rose-500/30'
          : isSuspicious
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-emerald-500/10 border-emerald-500/30'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${
              isPhishing
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                : isSuspicious
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
            }`}>
              {isPhishing ? (
                <ShieldAlert className="w-6 h-6" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-extrabold uppercase tracking-wider ${
                  isPhishing
                    ? 'bg-rose-600 text-white'
                    : isSuspicious
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {result.verdictBadge || (isPhishing ? 'Phishing Threat' : isSuspicious ? 'Suspicious' : 'Legitimate / Safe')}
                </span>

                <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 bg-white dark:bg-[#090D16] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10 shadow-xs">
                  <Cpu className="w-3 h-3 text-blue-500" />
                  <span>{result.engineSource || 'ML Classification'}</span>
                </span>

                {result.latency_ms !== undefined && (
                  <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 bg-white dark:bg-[#090D16] px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10 shadow-xs">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{result.latency_ms} ms latency</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {result.verdictTitle || (isPhishing ? 'Malicious Phishing Indicators Detected' : isSuspicious ? 'Suspicious Attributes Identified' : 'Email Content Verified Clean')}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {isPhishing
                  ? 'Our machine learning models identified credential theft signals, urgent social engineering cues, and domain deception tactics consistent with zero-day phishing campaigns.'
                  : isSuspicious
                  ? 'This email exhibits abnormal traits such as unsolicited deadline pressure or unverified external links. Exercise heightened verification.'
                  : 'No credential lures, deceptive links, or malicious identity indicators were detected in this message.'}
              </p>

              {result.warningNotice && (
                <div className="mt-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 px-3 py-1.5 rounded-xl font-mono">
                  Notice: {result.warningNotice}
                </div>
              )}
            </div>
          </div>

          {/* Compact Enterprise Risk Gauge */}
          <div className="shrink-0 pt-4 lg:pt-0 lg:border-l lg:border-slate-300/80 dark:lg:border-white/10 lg:pl-6">
            <RiskGauge score={result.score} verdict={result.verdict} confidence={result.confidence} />
          </div>

        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-md">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Threat Indicators
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {result.redFlags?.length || 0}
          </div>
          <span className="text-xs text-slate-500 font-medium">Flags Raised</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-md">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Flagged Phrases
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-500 mt-1">
            {result.highlights?.length || 0}
          </div>
          <span className="text-xs text-slate-500 font-medium">Urgency & Theft Cues</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-md">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Extracted Links
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-500 mt-1">
            {result.stats?.totalUrls || result.urlAnalysis?.length || 0}
          </div>
          <span className="text-xs text-slate-500 font-medium">URLs Analyzed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-md">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Model Certainty
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-500 mt-1">
            {result.confidence}%
          </div>
          <span className="text-xs text-slate-500 font-medium">Confidence Score</span>
        </div>
      </div>

      {/* Detailed Investigation Tabs */}
      <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden transition-colors duration-200">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-white/10 px-5 pt-3 space-x-4 bg-slate-50/80 dark:bg-slate-900/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Threat Vector Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('xray')}
            className={`pb-3 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'xray'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Content X-Ray & Highlights</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`pb-3 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'actions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Remediation Guidance</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`pb-3 text-xs font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'json'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer Payload</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6">
          {activeTab === 'overview' && (
            <ThreatBreakdown result={result} />
          )}

          {activeTab === 'xray' && (
            <EmailXRayView emailData={emailData} highlights={result.highlights} />
          )}

          {activeTab === 'actions' && (
            <ActionRecommendations recommendations={result.recommendations} verdict={result.verdict} emailData={emailData} />
          )}

          {activeTab === 'json' && (
            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-white/10">
              <pre className="text-xs font-mono text-emerald-400">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
