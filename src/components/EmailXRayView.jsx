import React, { useState } from 'react';
import { Eye, Info, AlertTriangle } from 'lucide-react';

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
            className={`cursor-pointer px-1.5 py-0.5 mx-0.5 rounded font-medium transition-colors inline-flex items-center text-xs ${
              isHigh
                ? isSelected
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 dark:hover:bg-rose-500/30'
                : isSelected
                ? 'bg-amber-500 text-white'
                : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 dark:hover:bg-amber-500/30'
            }`}
            title="Click to view threat explanation"
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
    <div className="space-y-4 transition-colors duration-150">
      
      {/* Header Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Semantic Content X-Ray
          </h4>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
            {highlights.length} Flagged Phrase(s)
          </span>
        </div>

        <button
          onClick={() => setShowHighlights(!showHighlights)}
          className="text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
        >
          {showHighlights ? 'Hide Highlights' : 'Show Highlights'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Email Content Box */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto max-h-96 overflow-y-auto shadow-sm">
          {emailData.subject && (
            <div className="pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Subject:</span> {emailData.subject}
            </div>
          )}
          <div className="whitespace-pre-wrap font-sans">
            {renderHighlightedText()}
          </div>
        </div>

        {/* Threat Insight Sidebar */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Context Details</span>
            </div>

            {selectedHighlight ? (
              <div className="space-y-3 animate-in fade-in duration-100">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Flagged Phrase:</span>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-rose-600 dark:text-rose-400 mt-1 break-words">
                    "{selectedHighlight.text}"
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Threat Category:</span>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedHighlight.category}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">Severity:</span>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                      selectedHighlight.severity === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    }`}>
                      {selectedHighlight.severity} Risk
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">ML Justification:</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    {selectedHighlight.reason}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Info className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Click any highlighted phrase
                </p>
                <p className="text-xs text-slate-500">
                  Select phrases in the email body to inspect the underlying NLP risk justification.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="text-rose-600 dark:text-rose-400">● Red: High Urgency</span>
            <span className="text-amber-600 dark:text-amber-400">● Amber: Deceptive CTA</span>
          </div>
        </div>

      </div>

    </div>
  );
}
