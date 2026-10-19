import React, { useState } from 'react';
import { Eye, Info, AlertTriangle, Sparkles } from 'lucide-react';

export default function EmailXRayView({ emailData, highlights = [] }) {
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showHighlights, setShowHighlights] = useState(true);

  const text = emailData.body || '';

  const renderHighlightedText = () => {
    if (!showHighlights || highlights.length === 0 || !text) {
      return <span className="whitespace-pre-wrap">{text || 'No email body text provided.'}</span>;
    }

    const uniquePhrases = [...new Set(highlights.map(h => h.text))];
    
    if (uniquePhrases.length === 0) {
      return <span className="whitespace-pre-wrap">{text}</span>;
    }

    const escapedPhrases = uniquePhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const combinedRegex = new RegExp(`(${escapedPhrases.join('|')})`, 'gi');

    const parts = text.split(combinedRegex);

    return parts.map((part, index) => {
      const match = highlights.find(h => h.text.toLowerCase() === part.toLowerCase());

      if (match) {
        const isSelected = selectedHighlight?.text.toLowerCase() === part.toLowerCase();
        const isHigh = match.severity === 'high';

        return (
          <mark
            key={index}
            onClick={() => setSelectedHighlight(match)}
            className={`cursor-pointer px-1.5 py-0.5 mx-0.5 rounded-md font-mono font-medium transition-all inline-flex items-center text-xs ${
              isHigh
                ? isSelected
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
                  : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : isSelected
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="Click to view ML threat rationale"
          >
            <span>{part}</span>
            <AlertTriangle className="w-3 h-3 ml-1 opacity-80" />
          </mark>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4 transition-colors duration-200">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-500" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Semantic Content Threat X-Ray
          </h4>
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-xs">
            {highlights.length} Token(s) Flagged
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowHighlights(!showHighlights)}
          className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs cursor-pointer"
        >
          {showHighlights ? 'Hide Tokens' : 'Show Tokens'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Email Content Box */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto max-h-96 overflow-y-auto shadow-inner">
          {emailData.subject && (
            <div className="pb-3 mb-3 border-b border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="text-slate-900 dark:text-slate-100 font-bold">Subject:</span> {emailData.subject}
            </div>
          )}
          <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
            {renderHighlightedText()}
          </div>
        </div>

        {/* Threat Insight Sidebar */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-white/10">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Token Telemetry</span>
            </div>

            {selectedHighlight ? (
              <div className="space-y-3 animate-in fade-in duration-100">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Flagged Phrase:</span>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-rose-500 mt-1 break-words">
                    "{selectedHighlight.text}"
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Threat Category:</span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedHighlight.category}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Severity Level:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-extrabold border ${
                      selectedHighlight.severity === 'high'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {selectedHighlight.severity} Risk
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">ML Justification:</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-white/10 font-sans">
                    {selectedHighlight.reason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs space-y-2">
                <Sparkles className="w-6 h-6 text-slate-400 mx-auto opacity-40" />
                <p>Click on any highlighted token in the text box to inspect its specific threat rationale.</p>
              </div>
            )}
          </div>

          {selectedHighlight && (
            <button
              type="button"
              onClick={() => setSelectedHighlight(null)}
              className="mt-4 w-full py-1.5 rounded-lg text-xs font-mono font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
