import React, { useState } from 'react';
import { 
  Trash2, 
  ArrowRight, 
  Mail, 
  User, 
  Loader2
} from 'lucide-react';
import { sampleEmails } from '../data/sampleEmails';

export default function EmailInputSection({
  emailData,
  setEmailData,
  onAnalyze,
  isScanning,
  onSelectSample
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(sampleEmails[0]?.id || null);

  const handlePresetClick = (sample) => {
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
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (emailData.body.trim() || emailData.subject.trim()) {
        onAnalyze();
      }
    }
  };

  const wordCount = emailData.body.trim() ? emailData.body.trim().split(/\s+/).length : 0;
  const charCount = emailData.body.length;
  const isReady = emailData.body.trim().length > 0 || emailData.subject.trim().length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-150" onKeyDown={handleKeyDown}>
      
      {/* Preset Test Scenarios */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
            Quick Test Scenarios (Corpus Benchmark Samples)
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Click to auto-populate
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5">
          {sampleEmails.map((sample) => {
            const isSelected = selectedPresetId === sample.id;
            const isPhish = sample.type === 'phishing';
            return (
              <button
                key={sample.id}
                onClick={() => handlePresetClick(sample)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all whitespace-nowrap shadow-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isPhish
                    ? 'bg-rose-50/90 hover:bg-rose-100 text-slate-900 dark:bg-slate-900 dark:text-slate-300 border-rose-300 dark:border-slate-800 hover:border-rose-400 dark:hover:border-slate-700'
                    : 'bg-emerald-50/90 hover:bg-emerald-100 text-slate-900 dark:bg-slate-900 dark:text-slate-300 border-emerald-300 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isPhish ? (isSelected ? 'bg-white' : 'bg-rose-500') : (isSelected ? 'bg-white' : 'bg-emerald-500')}`} />
                <span className="font-semibold text-xs">{sample.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isSelected 
                    ? 'bg-blue-700 text-blue-100' 
                    : isPhish 
                    ? 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent'
                }`}>
                  {sample.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Email Input Form Card */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl shadow-slate-300/40 dark:shadow-none overflow-hidden transition-all duration-150">
        
        {/* Card Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between bg-slate-100/90 dark:bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Email Inspection Envelope</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">Provide sender metadata and raw text for multi-vector threat scanning</p>
            </div>
          </div>

          <button
            onClick={handleClear}
            disabled={isScanning || (!emailData.body && !emailData.subject && !emailData.senderEmail)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:bg-transparent shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Form</span>
          </button>
        </div>

        {/* Sender & Header Fields */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                Sender Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={emailData.senderName || ''}
                  onChange={(e) => setEmailData({ ...emailData, senderName: e.target.value })}
                  placeholder="e.g. IT Helpdesk or CEO Office"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100/75 hover:bg-slate-100 focus:bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-0 transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
                Sender Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  value={emailData.senderEmail || ''}
                  onChange={(e) => setEmailData({ ...emailData, senderEmail: e.target.value })}
                  placeholder="e.g. support@domain-security.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-100/75 hover:bg-slate-100 focus:bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-0 transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1.5">
              Subject Line
            </label>
            <input
              type="text"
              value={emailData.subject || ''}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="e.g. Immediate Action Required: Account Termination in 24 Hours"
              className="w-full px-3 py-2 rounded-lg bg-slate-100/75 hover:bg-slate-100 focus:bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-0 transition-all shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">
                Email Message Body & Payload
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                Include URLs, hyperlinks, or signature text
              </span>
            </div>
            <textarea
              rows={9}
              value={emailData.body || ''}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              placeholder="Paste the raw or full body text of the email message here..."
              className="w-full p-3.5 rounded-lg bg-slate-100/75 hover:bg-slate-100 focus:bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs sm:text-sm leading-relaxed font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-0 transition-all shadow-xs font-sans"
            />
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs">{wordCount} words</span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs">{charCount} chars</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              Ctrl + Enter to run
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onAnalyze}
              disabled={!isReady || isScanning}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Threat Vectors...</span>
                </>
              ) : (
                <>
                  <span>Run Threat Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
