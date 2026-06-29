import React from 'react';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, ListTodo } from 'lucide-react';
import { AnalysisResult } from '../types';
import { AgentDecisionLedger } from './AgentDecisionLedger';
import { generateInitialLedger } from '../utils';

interface RealityCheckPageProps {
  data: AnalysisResult;
  onProceed: () => void;
}

export const RealityCheckPage: React.FC<RealityCheckPageProps> = ({ data, onProceed }) => {
  const { realityCheck, title } = data;
  const { riskScore, riskLevel, timeRemainingText, isRealistic, realisticReasoning, missingDeliverables } = realityCheck;

  // Visual helper colors based on risk score (streamlined, no over-the-top glow)
  const getRiskColor = (score: number) => {
    if (score >= 80) return { border: 'border-red-500/20', bg: 'bg-red-950/10', text: 'text-red-400', bar: 'bg-red-500' };
    if (score >= 40) return { border: 'border-amber-500/20', bg: 'bg-amber-950/10', text: 'text-amber-400', bar: 'bg-amber-500' };
    return { border: 'border-emerald-500/20', bg: 'bg-emerald-950/10', text: 'text-emerald-400', bar: 'bg-emerald-500' };
  };

  const riskStyle = getRiskColor(riskScore);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in" id="reality-check-root">
      
      {data.isRescueMode && (
        <div className="bg-indigo-950/20 border border-indigo-500/15 text-indigo-300 py-2.5 px-4 rounded-xl flex gap-2 items-center justify-center text-center animate-pulse" id="rescue-mode-banner-reality">
          <Sparkles size={14} className="text-indigo-400 shrink-0" />
          <p className="text-[11px] font-medium">
            Running offline Rescue Mode. AI services are occupied. Generating a local recovery checklist to protect your deadline.
          </p>
        </div>
      )}
      
      {/* Workbook Header */}
      <div className="text-left space-y-2 border-b border-slate-900 pb-5">
        <div className="inline-flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-wider">
          <ShieldAlert size={12} className="text-red-400 shrink-0" />
          Execution Feasibility Scan Complete
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-400">
          Reality assessment formulated on {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Main Reality Check Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Risk Score Panel */}
        <div className={`bg-[#0b0f17] border ${riskStyle.border} rounded-xl p-5 flex flex-col justify-between items-center text-center`}>
          <div className="w-full">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">
              Deadline Risk Score
            </span>
            <div className="relative inline-flex items-center justify-center my-2">
              <div className="h-24 w-24 rounded-full border-2 border-slate-900 flex flex-col items-center justify-center bg-slate-950">
                <span className={`text-2xl font-bold tracking-tight ${riskStyle.text}`}>{riskScore}%</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{riskLevel} Risk</span>
              </div>
            </div>
          </div>
          <div className="w-full mt-3">
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div className={`h-full ${riskStyle.bar}`} style={{ width: `${riskScore}%` }}></div>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Probability of execution failure if scope is unadjusted.
            </p>
          </div>
        </div>

        {/* Time remaining Panel */}
        <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">
              Time Remaining
            </span>
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-slate-900/40 border border-slate-850 my-2 text-slate-400">
              <Clock size={32} className="text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="w-full">
            <p className="text-sm font-bold text-white tracking-wide">{timeRemainingText}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              Timeframe calculated against absolute delivery time.
            </p>
          </div>
        </div>

        {/* Verdict Panel */}
        <div className={`bg-[#0b0f17] border rounded-xl p-5 flex flex-col justify-between items-center text-center ${
          isRealistic ? 'border-emerald-500/15' : 'border-amber-500/15'
        }`}>
          <div className="w-full">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-2">
              Feasibility Verdict
            </span>
            <div className="my-2">
              {isRealistic ? (
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-emerald-950/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-amber-950/10 border border-amber-500/20 text-amber-400">
                  <AlertTriangle size={36} />
                </div>
              )}
            </div>
          </div>
          <div className="w-full">
            <span className={`text-[11px] font-bold block tracking-widest uppercase ${isRealistic ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isRealistic ? '100% FEASIBLE' : 'HIGH PANIC RISK'}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">
              {isRealistic ? 'Full Win path is entirely achievable.' : 'Slowing down and pivoting scope is critical.'}
            </p>
          </div>
        </div>

      </div>

      {/* Realistic Reasoning & Missing Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Deep Analysis reasoning */}
        <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-3.5">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-400" />
            AI Reality Check Analysis
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {realisticReasoning}
          </p>
          {!isRealistic && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/15 rounded-lg text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400 block mb-0.5">Recommended Pivot:</span>
              Continuing with the Full Win path represents severe risk. We strongly advise remaining strictly in the <strong className="font-semibold text-indigo-400">Safe Submit Path</strong> inside the workspace dashboard to guarantee a working delivery on time.
            </div>
          )}
        </div>

        {/* Unresolved / Missing deliverables */}
        <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 mb-3.5">
              <ListTodo size={14} className="text-indigo-400 animate-pulse" />
              Identified Deliverable Deficits
            </h3>
            <ul className="space-y-2">
              {missingDeliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-normal">
            These critical components require structural verification inside the DoneProof module to unlock submission clearance.
          </p>
        </div>

      </div>

      {/* Agent Decision Ledger */}
      <div className="py-2" id="reality-ledger-container">
        <AgentDecisionLedger 
          entries={generateInitialLedger(data)} 
          isRescueMode={data.isRescueMode} 
        />
      </div>

      {/* Navigation action to proceed */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#0b0f17] border border-indigo-500/10 rounded-xl shadow-sm">
        <div className="text-left">
          <p className="text-xs font-bold text-white">Unlock Strategic Paths</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Review alternate paths, interactive timeline monitors, and done proofs.</p>
        </div>
        <button
          onClick={onProceed}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
          id="reality-proceed-btn"
        >
          Enter Execution Workspace
          <ArrowRight size={13} />
        </button>
      </div>

    </div>
  );
};
