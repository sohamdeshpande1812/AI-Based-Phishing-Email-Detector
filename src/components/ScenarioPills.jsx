import React from 'react';
import { sampleEmails } from '../data/sampleEmails';
import { AlertTriangle, ShieldAlert, ShieldCheck, Sparkles, Check } from 'lucide-react';

export default function ScenarioPills({ selectedPresetId, onSelectSample }) {
  const getTagBadge = (tag) => {
    switch (tag) {
      case 'CRITICAL':
        return {
          icon: ShieldAlert,
          classes: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
          hoverBorder: 'hover:border-rose-500/60 hover:shadow-rose-500/10',
          dot: 'bg-rose-500',
          glow: 'group-hover:shadow-[0_0_12px_rgba(244,63,94,0.35)]'
        };
      case 'SUSPICIOUS':
        return {
          icon: AlertTriangle,
          classes: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          hoverBorder: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
          dot: 'bg-amber-500',
          glow: 'group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]'
        };
      case 'BENIGN':
      default:
        return {
          icon: ShieldCheck,
          classes: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          hoverBorder: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
          dot: 'bg-emerald-500',
          glow: 'group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)]'
        };
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick-Test Scenarios (1-Click Presets)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Auto-fills envelope payload
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sampleEmails.map((sample) => {
          const isSelected = selectedPresetId === sample.id;
          const tagInfo = getTagBadge(sample.threatTag || (sample.type === 'phishing' ? 'CRITICAL' : 'BENIGN'));
          const TagIcon = tagInfo.icon;

          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`group relative flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 whitespace-nowrap shrink-0 shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 ring-2 ring-blue-500/40'
                  : `bg-white dark:bg-[#111728] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 ${tagInfo.hoverBorder} ${tagInfo.glow} hover:-translate-y-0.5 hover:dark:bg-[#151D33] hover:dark:border-slate-700`
              }`}
            >
              {/* Dot indicator */}
              <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-white' : tagInfo.dot}`} />

              {/* Sample Title */}
              <span className="font-semibold text-xs tracking-tight">
                {sample.name.split(' - ')[0]}
              </span>

              {/* Threat Tag Badge */}
              <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-md border flex items-center space-x-1 ${
                isSelected 
                  ? 'bg-blue-700/80 text-blue-100 border-blue-400/40' 
                  : tagInfo.classes
              }`}>
                <span>{sample.threatTag || (sample.type === 'phishing' ? 'CRITICAL' : 'BENIGN')}</span>
              </span>

              {/* Checkmark when active */}
              {isSelected && (
                <Check className="w-3.5 h-3.5 text-white shrink-0 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
