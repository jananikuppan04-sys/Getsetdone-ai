import React, { useState } from 'react';
import { AgentLedgerEntry } from '../types';
import { 
  FileText, 
  AlertCircle, 
  ShieldAlert, 
  Scissors, 
  CheckSquare, 
  Activity, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Zap,
  CheckCircle,
  Database
} from 'lucide-react';

interface AgentDecisionLedgerProps {
  entries: AgentLedgerEntry[];
  isRescueMode?: boolean;
}

const IconMap: Record<string, React.ComponentType<any>> = {
  FileText,
  AlertCircle,
  ShieldAlert,
  Scissors,
  CheckSquare,
  Activity,
  Award,
  Zap,
  CheckCircle,
  Database
};

const StatusStyles: Record<string, { bg: string; text: string; border: string }> = {
  complete: { bg: 'bg-emerald-950/20', text: 'text-emerald-400', border: 'border-emerald-500/15' },
  'high-risk': { bg: 'bg-rose-950/20', text: 'text-rose-400', border: 'border-rose-500/15' },
  blocker: { bg: 'bg-red-950/20', text: 'text-red-400', border: 'border-red-500/20 font-bold' },
  optimized: { bg: 'bg-amber-950/20', text: 'text-amber-400', border: 'border-amber-500/15' },
  recommended: { bg: 'bg-indigo-950/20', text: 'text-indigo-400', border: 'border-indigo-500/15' },
  ready: { bg: 'bg-sky-950/20', text: 'text-sky-400', border: 'border-sky-500/15' },
  progress: { bg: 'bg-slate-900/40', text: 'text-slate-400', border: 'border-slate-800' }
};

export const AgentDecisionLedger: React.FC<AgentDecisionLedgerProps> = ({ entries, isRescueMode }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getBadgeStyle = () => {
    if (isRescueMode) {
      return { text: "Rescue active", bg: "bg-amber-950/30 border-amber-500/15 text-amber-400" };
    }
    return { text: "Agent plan live", bg: "bg-indigo-950/30 border-indigo-500/15 text-indigo-400" };
  };

  const badge = getBadgeStyle();
  const sortedEntries = [...entries].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm" id="agent-ledger-root">
      
      {/* Header section with Compact Badge */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-900 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">Why This Plan?</h3>
            <span className={`px-2 py-0.5 rounded text-[9px] font-mono border font-semibold uppercase tracking-wider ${badge.bg}`}>
              {badge.text}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">See how GetSetDone reached this plan.</p>
        </div>
        <div className="p-1 bg-indigo-950/20 text-indigo-400 rounded-md">
          <Sparkles size={13} />
        </div>
      </div>

      {/* Timeline entries list */}
      <div className="relative pl-3.5 border-l border-slate-900 ml-2.5 space-y-4 py-1">
        {sortedEntries.map((entry) => {
          const IconComponent = IconMap[entry.icon] || FileText;
          const style = StatusStyles[entry.status] || StatusStyles.progress;
          const isExpanded = expandedId === entry.id;

          return (
            <div key={entry.id} className="relative group text-left" id={`ledger-step-${entry.order}`}>
              
              {/* Timeline dot */}
              <div className="absolute -left-[23px] top-1.5 h-4 w-4 rounded-full bg-[#0b0f17] border border-slate-800 flex items-center justify-center text-[8px] font-mono font-bold text-slate-500 group-hover:border-indigo-500/40 transition-colors">
                {entry.order}
              </div>

              {/* Box */}
              <div className="bg-[#070b12]/40 hover:bg-[#070b12]/90 border border-slate-900 rounded-lg p-3 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-md shrink-0 ${style.bg} ${style.text} border ${style.border}`}>
                      <IconComponent size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{entry.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{entry.summary}</p>
                    </div>
                  </div>
                  
                  {/* Status element */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest font-semibold border ${style.bg} ${style.text} ${style.border}`}>
                      {entry.status}
                    </span>
                    {entry.timestamp && (
                      <span className="text-[9px] text-slate-600 font-mono">{entry.timestamp}</span>
                    )}
                  </div>
                </div>

                {/* Accordion Content */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-900 space-y-2 animate-fade-in text-[11px] text-slate-400 leading-relaxed">
                    {entry.details && entry.details.length > 0 && (
                      <ul className="space-y-1 pl-0.5 list-none">
                        {entry.details.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <span className="text-indigo-400 select-none shrink-0">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {entry.source && (
                      <div className="flex justify-between items-center text-[9px] text-slate-600 pt-2 border-t border-slate-950 font-mono">
                        <span>Source: {entry.source}</span>
                        <span className="capitalize">
                          {entry.source === 'rescue-mode' 
                            ? 'Static Fallback Engine' 
                            : entry.source === 'gemini' 
                              ? 'Gemini 3.5 Flash SDK' 
                              : 'Interactive Action'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* View/Hide Details trigger button */}
                <button
                  onClick={() => toggleExpand(entry.id)}
                  className="w-full flex items-center justify-center gap-0.5 mt-2 text-[9px] font-bold text-slate-500 hover:text-slate-300 transition-colors select-none pt-1"
                >
                  {isExpanded ? (
                    <>
                      <span>Hide logs</span>
                      <ChevronUp size={11} />
                    </>
                  ) : (
                    <>
                      <span>View sequence logs</span>
                      <ChevronDown size={11} />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
