import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface FinishMeterProps {
  score: number;
  breakdown: {
    deliverables: number; // raw percentage 0-100
    proofs: number;       // raw percentage 0-100
    blockersResolved: boolean;
    deadlineSafety: number; // raw percentage 0-100
  };
  suggestions: string[];
}

export const FinishMeter: React.FC<FinishMeterProps> = ({ score, breakdown, suggestions }) => {
  // Determine state based on score
  let stateLabel = 'Not Ready';
  let stateColor = 'text-rose-400 border-rose-500/10 bg-rose-950/10';
  let progressColor = 'stroke-rose-500';

  if (score >= 85) {
    stateLabel = 'Submission Ready';
    stateColor = 'text-emerald-400 border-emerald-500/10 bg-emerald-950/10';
    progressColor = 'stroke-emerald-400';
  } else if (score >= 70) {
    stateLabel = 'Nearly Ready';
    stateColor = 'text-indigo-400 border-indigo-500/10 bg-indigo-950/10';
    progressColor = 'stroke-indigo-400';
  } else if (score >= 40) {
    stateLabel = 'In Progress';
    stateColor = 'text-amber-400 border-amber-500/10 bg-amber-950/10';
    progressColor = 'stroke-amber-500';
  }

  // Circular progress math
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm" id="finish-meter-root">
      
      {/* Title block */}
      <div className="border-b border-slate-900 pb-2.5 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">Ready to Submit?</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Continuous verification health index.</p>
        </div>
        <div className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border shrink-0 ${stateColor}`}>
          {stateLabel}
        </div>
      </div>

      {/* Clean circular ring */}
      <div className="flex items-center justify-center py-2">
        <div className="relative h-28 w-28">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-slate-900"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              className={`${progressColor} transition-all duration-700 ease-out`}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-white tracking-tight">{score}%</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Readiness</span>
          </div>
        </div>
      </div>

      {/* Weighted breakdown parameters */}
      <div className="space-y-3 bg-[#070b12]/50 border border-slate-900 rounded-lg p-3 text-xs">
        <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1.5">Readiness Components</h4>
        
        {/* Component 1: Deliverables complete (35%) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Deliverables Complete (35%)</span>
            <span className="font-mono text-white">
              {Math.round((breakdown.deliverables / 100) * 35)}/35
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${breakdown.deliverables}%` }}
            ></div>
          </div>
        </div>

        {/* Component 2: Proof attached (30%) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Proof Attached (30%)</span>
            <span className="font-mono text-white">
              {Math.round((breakdown.proofs / 100) * 30)}/30
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${breakdown.proofs}%` }}
            ></div>
          </div>
        </div>

        {/* Component 3: High-risk blockers resolved (20%) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Blockers Resolved (20%)</span>
            <span className="font-mono text-white">
              {breakdown.blockersResolved ? '20' : '0'}/20
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
            <div 
              className={`${breakdown.blockersResolved ? 'bg-indigo-400' : 'bg-red-500'} h-full rounded-full transition-all duration-500`}
              style={{ width: breakdown.blockersResolved ? '100%' : '0%' }}
            ></div>
          </div>
        </div>

        {/* Component 4: Deadline safety (15%) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>Deadline Safety (15%)</span>
            <span className="font-mono text-white">
              {Math.round((breakdown.deadlineSafety / 100) * 15)}/15
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${breakdown.deadlineSafety}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Suggested next steps */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[9px] flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400 shrink-0 animate-pulse" />
            Recommended Directives
          </h4>
          <div className="space-y-1.5">
            {suggestions.slice(0, 2).map((suggestion, idx) => (
              <div key={idx} className="flex gap-2 bg-[#070b12]/30 border border-slate-900 p-2.5 rounded-lg text-[11px] text-slate-300 leading-normal">
                <div className="mt-0.5 text-indigo-400 shrink-0">
                  <CheckCircle2 size={12} />
                </div>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
