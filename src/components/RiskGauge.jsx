import React from 'react';

export default function RiskGauge({ score = 0, verdict = 'phishing', confidence = 95 }) {
  const isPhishing = verdict === 'phishing' || score >= 60;
  const isSuspicious = verdict === 'suspicious' || (score >= 30 && score < 60);

  const strokeColor = isPhishing ? '#F43F5E' : isSuspicious ? '#F59E0B' : '#10B981';
  const glowFilter = isPhishing 
    ? 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.45))' 
    : isSuspicious 
    ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.45))' 
    : 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.45))';

  const textColor = isPhishing 
    ? 'text-rose-600 dark:text-rose-400' 
    : isSuspicious 
    ? 'text-amber-600 dark:text-amber-400' 
    : 'text-emerald-600 dark:text-emerald-400';

  const label = isPhishing ? 'Critical Risk' : isSuspicious ? 'Elevated Risk' : 'Low Risk / Benign';

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex items-center space-x-4 p-2">
      {/* High-End Circular Radial Gauge */}
      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
          {/* Subtle Outer Track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="9"
            fill="transparent"
          />
          {/* Active Glowing Value Arc */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke={strokeColor}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: glowFilter,
              transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>

        {/* Center Percentage & Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-2xl font-extrabold font-mono tracking-tight ${textColor}`}>
            {score}%
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            PROBABILITY
          </span>
        </div>
      </div>

      {/* Label and Risk Level */}
      <div className="space-y-1">
        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Phishing Likelihood
        </div>
        <div className={`text-base font-extrabold ${textColor}`}>
          {label}
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Confidence:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{confidence}%</span>
        </div>
      </div>
    </div>
  );
}
