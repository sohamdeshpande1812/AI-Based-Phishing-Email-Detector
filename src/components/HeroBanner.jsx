import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Activity, 
  Lock, 
  Crosshair, 
  TrendingUp,
  Cpu,
  Layers,
  BrainCircuit
} from 'lucide-react';

export default function HeroBanner() {
  const telemetryStats = [
    {
      title: "Total Corpus Scanned",
      value: "60,000+",
      label: "Verified Training Samples",
      trend: "+12.4% MoM",
      icon: ShieldCheck,
      color: "text-blue-500",
      bgGlow: "from-blue-500/10 to-transparent",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Detection Accuracy",
      value: "99.9%",
      label: "Zero False-Positive Target",
      trend: "Ensemble Verified",
      icon: Crosshair,
      color: "text-emerald-500",
      bgGlow: "from-emerald-500/10 to-transparent",
      borderColor: "border-emerald-500/20"
    },
    {
      title: "Avg Inference Time",
      value: "1.2 ms",
      label: "Random Forest & Bi-LSTM",
      trend: "Ultra-Low Latency",
      icon: Zap,
      color: "text-amber-500",
      bgGlow: "from-amber-500/10 to-transparent",
      borderColor: "border-amber-500/20"
    },
    {
      title: "Zero-Day Block Rate",
      value: "98.4%",
      label: "Polymorphic & AI Phish",
      trend: "High Efficacy",
      icon: Lock,
      color: "text-rose-500",
      bgGlow: "from-rose-500/10 to-transparent",
      borderColor: "border-rose-500/20"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      
      {/* Top Banner Header with Glow Effects */}
      <div className="relative text-center mb-6">
        
        {/* Subtle background radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-28 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Zero-Day Defense Protocol · Active Real-Time Threat Intelligence</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          Autonomous Phishing & Exploit Threat Analyzer
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Inspect incoming emails for multi-vector threat cues including deceptive URLs, urgent psychological coercion, credential harvesting, and domain spoofing using our multi-model machine learning stack.
        </p>
      </div>

      {/* 4 Threat Metric Cards with Glassmorphism & Depth */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-2">
        {telemetryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#12192B] dark:to-[#0B0F1A] backdrop-blur-md border border-slate-300 dark:border-slate-700 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 group cyber-bento-card cursor-default select-none shadow-md shadow-slate-900/5 dark:shadow-black/40 flex flex-col justify-between min-h-[118px]"
            >
              {/* Subtle card top gradient glow */}
              <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${stat.bgGlow} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500`} />
              
              {/* Subtle bottom-edge hairline neon highlight on hover */}
              <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/50 dark:group-hover:via-blue-400/60 transition-all duration-500" />

              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold truncate">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 ${stat.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-xs`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-300 truncate font-medium">
                  {stat.label}
                </span>
                <span className={`font-mono font-semibold ${stat.color} text-[10px]`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
