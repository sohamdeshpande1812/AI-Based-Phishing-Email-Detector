import React from 'react';

export default function RiskGauge({ score = 0, verdict = 'phishing', confidence = 95 }) {
  // Determine status styles
  const isPhishing = verdict === 'phishing' || score >= 60;
  const isSuspicious = verdict === 'suspicious' || (score >= 30 && score < 60);

  const strokeColor = isPhishing ? '#ef4444' : isSuspicious ? '#f59e0b' : '#10b981';
  const textColor = isPhishing ? 'text-rose-600 dark:text-rose-400' : isSuspicious ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';
  const label = isPhishing ? 'Critical Risk' : isSuspicious ? 'Elevated Risk' : 'Low Risk';

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center space-x-4">
      {/* Compact Clean Ring */}
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease'
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-bold font-mono ${textColor}`}>
            {score}%
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Risk
          </span>
        </div>
      </div>

      {/* Label and Details */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Threat Probability
        </div>
        <div className={`text-sm font-bold ${textColor}`}>
          {label} ({score}/100)
        </div>
        <div className="text-xs text-slate-500 font-mono mt-0.5">
          Model Confidence: {confidence}%
        </div>
      </div>
    </div>
  );
}
