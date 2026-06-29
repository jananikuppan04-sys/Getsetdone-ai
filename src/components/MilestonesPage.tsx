import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  TrendingUp, 
  History, 
  Zap, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface Milestone {
  id: string;
  level: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
  metric: string;
}

interface MilestonesPageProps {
  userName: string;
  readyToSubmitScore?: number;
  completedTasksCount?: number;
  totalTasksCount?: number;
  completedProofsCount?: number;
  totalProofsCount?: number;
}

export const MilestonesPage: React.FC<MilestonesPageProps> = ({
  userName,
  readyToSubmitScore = 42,
  completedTasksCount = 0,
  totalTasksCount = 0,
  completedProofsCount = 0,
  totalProofsCount = 0
}) => {
  // Let's load the dynamic metrics or default values from localStorage if available
  const [streak, setStreak] = React.useState<number>(() => {
    const saved = localStorage.getItem('getsetdone_milestone_streak');
    return saved ? parseInt(saved, 10) : 4;
  });

  const [focusHours, setFocusHours] = React.useState<number>(() => {
    const saved = localStorage.getItem('getsetdone_milestone_focus');
    return saved ? parseFloat(saved) : 12.5;
  });

  const [rescuedCount, setRescuedCount] = React.useState<number>(() => {
    const saved = localStorage.getItem('getsetdone_milestone_rescued');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Automatically update and save when props change
  React.useEffect(() => {
    if (readyToSubmitScore >= 85) {
      // Unlocked execution pro, let's bump the rescued plans if not done before
      const hasKey = localStorage.getItem('getsetdone_milestone_unlocked_pro');
      if (!hasKey) {
        localStorage.setItem('getsetdone_milestone_unlocked_pro', 'true');
        setRescuedCount(prev => {
          const next = prev + 1;
          localStorage.setItem('getsetdone_milestone_rescued', String(next));
          return next;
        });
      }
    }
  }, [readyToSubmitScore]);

  // Determine dynamic milestone statuses
  const m1Status = 'completed'; // Always complete once a plan is generated
  const m2Status = completedTasksCount > 0 ? 'completed' : 'in-progress';
  const m3Status = readyToSubmitScore >= 85 ? 'completed' : 'in-progress';
  const m4Status = rescuedCount >= 3 ? 'completed' : 'locked';

  const milestones: Milestone[] = [
    {
      id: 'm-1',
      level: 1,
      title: 'Crisis Mitigator',
      description: 'Identified deadline risk and successfully built an offline recovery workbook on an active timeline.',
      status: m1Status,
      metric: 'Completed 1/1'
    },
    {
      id: 'm-2',
      level: 2,
      title: 'Scope Master',
      description: 'Pivoted uncompleted milestones to the Best Plan to Finish, bypassing high-risk third-party locks.',
      status: m2Status,
      metric: `${completedTasksCount}/${totalTasksCount} Tasks`
    },
    {
      id: 'm-3',
      level: 3,
      title: 'Execution Pro',
      description: 'Satisfied 100% of outstanding deliverables, uploaded format-verified proofs, and unlocked the Submission Gate.',
      status: m3Status,
      metric: readyToSubmitScore >= 85 ? 'Verified 100%' : `Active Checklist (${readyToSubmitScore}%)`
    },
    {
      id: 'm-4',
      level: 4,
      title: 'Deficit Solver',
      description: 'Complete 3 separate fallback Rescue plans without allowing an absolute deadline failure.',
      status: m4Status,
      metric: `${rescuedCount} of 3 Plans`
    }
  ];


  return (
    <div className="space-y-6 text-left animate-fade-in" id="milestones-page">
      
      {/* Header */}
      <div className="border-b border-slate-900 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Milestones & Rewards
            <span className="text-indigo-400 text-xs font-normal">SaaS Execution Audit</span>
          </h1>
          <p className="text-xs text-slate-400">Great progress, {userName}. Review your structured progress, focus consistency, and delivery badges.</p>
        </div>
      </div>

      {/* Unlocked Focus Builder congrats card */}
      <div className="bg-indigo-600/10 border border-indigo-500/25 rounded-xl p-4 flex gap-3.5 items-center" id="milestone-focus-builder-unlocked">
        <div className="p-2.5 bg-indigo-600 text-white rounded-lg shrink-0">
          <Award size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Great progress, {userName}!</h4>
          <p className="text-[11px] text-indigo-400 mt-0.5 font-medium">You unlocked the "Focus Builder" achievement by maintaining solid session consistency.</p>
        </div>
      </div>

      {/* Structured Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="milestones-metrics-grid">
        
        <div className="bg-[#0b0f17] border border-slate-850 p-5 rounded-xl space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/5 blur-lg rounded-full"></div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <TrendingUp size={12} className="text-indigo-400" />
            Execution Streak
          </span>
          <p className="text-2xl font-bold text-white font-mono">4 Days</p>
          <p className="text-[10px] text-slate-400">Consistent daily schedule & checklist execution.</p>
        </div>

        <div className="bg-[#0b0f17] border border-slate-850 p-5 rounded-xl space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/5 blur-lg rounded-full"></div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <Zap size={12} className="text-amber-400 animate-pulse" />
            Focus Hours Logged
          </span>
          <p className="text-2xl font-bold text-white font-mono">12.5h</p>
          <p className="text-[10px] text-slate-400">Tracked via interactive pomodoro countdown.</p>
        </div>

        <div className="bg-[#0b0f17] border border-slate-850 p-5 rounded-xl space-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-500/5 blur-lg rounded-full"></div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" />
            Rescued Worksheets
          </span>
          <p className="text-2xl font-bold text-white font-mono">3 Plans</p>
          <p className="text-[10px] text-slate-400">Completed release gates frozen and finalized.</p>
        </div>

      </div>

      {/* Professional Milestones Milestones */}
      <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Milestone Verification Matrix</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Subtle, performance-focused indicators for professional developers.</p>
        </div>

        <div className="divide-y divide-slate-900">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id} 
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-1 last:pb-1 text-left"
            >
              <div className="flex gap-4 items-start">
                {/* Level badge */}
                <div className={`h-10 w-10 rounded-lg border flex flex-col items-center justify-center shrink-0 font-mono ${
                  milestone.status === 'completed'
                    ? 'bg-emerald-950/10 border-emerald-500/15 text-emerald-400'
                    : milestone.status === 'in-progress'
                      ? 'bg-indigo-950/10 border-indigo-500/15 text-indigo-400'
                      : 'bg-slate-950 border-slate-900 text-slate-600'
                }`}>
                  <span className="text-[8px] uppercase tracking-widest font-black leading-none opacity-60">Lvl</span>
                  <span className="text-sm font-bold leading-none mt-0.5">{milestone.level}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white tracking-tight">{milestone.title}</h4>
                    {milestone.status === 'completed' && (
                      <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                        Verified
                      </span>
                    )}
                    {milestone.status === 'in-progress' && (
                      <span className="bg-indigo-950/30 text-indigo-400 border border-indigo-500/10 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1 max-w-xl">
                    {milestone.description}
                  </p>
                </div>
              </div>

              {/* Status column */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs">
                <span className="text-[10px] text-slate-500 font-mono font-medium">{milestone.metric}</span>
                {milestone.status === 'completed' ? (
                  <div className="h-6 w-6 rounded-full bg-emerald-950/15 text-emerald-400 flex items-center justify-center border border-emerald-500/10">
                    <CheckCircle2 size={13} />
                  </div>
                ) : milestone.status === 'in-progress' ? (
                  <div className="h-6 w-6 rounded-full bg-indigo-950/15 text-indigo-400 flex items-center justify-center border border-indigo-500/10 animate-pulse">
                    <Sparkles size={11} />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-slate-950 text-slate-700 flex items-center justify-center border border-slate-900">
                    <Lock size={11} />
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
