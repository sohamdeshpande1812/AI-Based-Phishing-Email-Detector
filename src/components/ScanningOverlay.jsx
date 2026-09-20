import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Search, Cpu, Globe, AlertTriangle } from 'lucide-react';

const SCAN_STEPS = [
  { id: 1, title: 'Parsing Headers & Sender Identity', icon: Shield, time: 200 },
  { id: 2, title: 'Inspecting Hyperlinks & Domain Spoofing', icon: Globe, time: 450 },
  { id: 3, title: 'Analyzing Urgency & Psychological Coercion Cues', icon: AlertTriangle, time: 700 },
  { id: 4, title: 'Generating AI Threat Matrix & Final Verdict', icon: Cpu, time: 950 },
];

export default function ScanningOverlay({ isScanning }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isScanning) {
      setCurrentStep(0);
      setProgress(15);
      return;
    }

    const t1 = setTimeout(() => { setCurrentStep(1); setProgress(45); }, 200);
    const t2 = setTimeout(() => { setCurrentStep(2); setProgress(75); }, 450);
    const t3 = setTimeout(() => { setCurrentStep(3); setProgress(95); }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        {/* Center Scanner Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping opacity-30" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 animate-spin duration-3000" />
          <div className="w-16 h-16 rounded-full bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Search className="w-7 h-7 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-1">
          Deep Threat Inspection in Progress
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-6">
          Neural Security Engine analyzing multi-vector indicators...
        </p>

        {/* Scan Steps Checklist */}
        <div className="space-y-3 text-left mb-6">
          {SCAN_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={step.id}
                className={`flex items-center space-x-3 px-3 py-2 rounded-xl border text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <span className="font-medium truncate">{step.title}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
