import React from 'react';
import { 
  Flame, 
  Lock, 
  Globe, 
  UserX, 
  AlertOctagon, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function ThreatBreakdown({ result }) {
  const { metrics = {}, redFlags = [], urlAnalysis = [], senderAnalysis = {} } = result;

  const categories = [
    {
      id: 'urgency',
      title: 'Urgency & Psychological Coercion',
      score: metrics.urgencyScore || 0,
      icon: Flame,
      color: metrics.urgencyScore > 50 ? 'text-rose-500' : 'text-slate-400',
      barColor: metrics.urgencyScore > 50 ? 'bg-rose-500' : metrics.urgencyScore > 20 ? 'bg-amber-500' : 'bg-emerald-500',
      desc: 'High-pressure deadlines, threats of account lockout, and panic-inducing language'
    },
    {
      id: 'harvesting',
      title: 'Credential & Data Harvesting',
      score: metrics.harvestingScore || 0,
      icon: Lock,
      color: metrics.harvestingScore > 50 ? 'text-rose-500' : 'text-slate-400',
      barColor: metrics.harvestingScore > 50 ? 'bg-rose-500' : metrics.harvestingScore > 20 ? 'bg-amber-500' : 'bg-emerald-500',
      desc: 'Prompts for passwords, two-factor bypass, banking forms, or sensitive PII'
    },
    {
      id: 'links',
      title: 'Deceptive Links & Lookalike Domains',
      score: metrics.linksScore || 0,
      icon: Globe,
      color: metrics.linksScore > 50 ? 'text-rose-500' : 'text-slate-400',
      barColor: metrics.linksScore > 50 ? 'bg-rose-500' : metrics.linksScore > 20 ? 'bg-amber-500' : 'bg-emerald-500',
      desc: 'Direct IP destinations, high-risk TLDs, and character-swapped brand URLs'
    },
    {
      id: 'sender',
      title: 'Sender Identity & Domain Spoofing',
      score: metrics.senderScore || 0,
      icon: UserX,
      color: metrics.senderScore > 50 ? 'text-rose-500' : 'text-slate-400',
      barColor: metrics.senderScore > 50 ? 'bg-rose-500' : metrics.senderScore > 20 ? 'bg-amber-500' : 'bg-emerald-500',
      desc: 'Discrepancies between display name and actual sender email domain'
    },
  ];

  return (
    <div className="space-y-6 transition-colors duration-200">
      
      {/* Category Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200 dark:border-white/5">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {cat.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs">
                    {cat.score}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-white/5">
                <div
                  className={`h-full ${cat.barColor} transition-all duration-500 ease-out`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Red Flags & Risk Indicators List */}
      <div className="bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-xs">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2 mb-3 pb-2 border-b border-slate-200 dark:border-white/5">
          <AlertOctagon className="w-4 h-4 text-rose-500" />
          <span>Identified Threat Indicators ({redFlags.length})</span>
        </h4>

        {redFlags.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-3 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>No malicious red flags or zero-day phishing signatures were identified in this email.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 flex items-start space-x-3 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs"
              >
                <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                  flag.severity === 'high' ? 'bg-rose-500' : 'bg-amber-400'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {flag.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-bold border ${
                      flag.severity === 'high'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {flag.severity} risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {flag.description}
                  </p>
                  {flag.url && (
                    <div className="mt-2 text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-[#090D16] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/5 break-all flex items-center space-x-1.5">
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span>{flag.url}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
