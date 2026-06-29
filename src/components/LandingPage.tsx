import React from 'react';
import { 
  Play, 
  Sparkles, 
  ShieldAlert, 
  Calendar,
  Zap,
  CheckSquare
} from 'lucide-react';
import { LogoIcon } from './Logo';

interface LandingPageProps {
  userName: string;
  onStartNew: () => void;
  onPlanMyDay: () => void;
  onStartFocus: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  userName,
  onStartNew, 
  onPlanMyDay, 
  onStartFocus
}) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 animate-fade-in" id="landing-root">
      
      {/* Personalized Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <div className="flex justify-center mb-1">
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl shadow-lg shadow-indigo-500/5">
            <LogoIcon size={44} />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/15 px-3 py-1 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles size={11} className="fill-indigo-500/20 text-indigo-400 shrink-0" />
          Workspace Ready
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome, {userName}.
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Choose how you want to get started.
          </p>
        </div>
      </div>

      {/* Three Personalized Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        
        {/* Card 1: Plan My Day */}
        <button
          onClick={onPlanMyDay}
          className="flex flex-col items-start text-left p-6 bg-[#0b0f17] hover:bg-[#101520] border border-slate-900 hover:border-indigo-500/30 rounded-2xl transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-indigo-500/2 active:scale-[0.98]"
          id="action-card-plan-day"
        >
          <div className="p-3 bg-indigo-950/40 text-indigo-400 border border-indigo-500/15 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Calendar size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              Plan My Day
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Add tasks, habits, and focus time.
            </p>
          </div>
        </button>

        {/* Card 2: Add a Deadline */}
        <button
          onClick={onStartNew}
          className="flex flex-col items-start text-left p-6 bg-[#0b0f17] hover:bg-[#101520] border border-slate-900 hover:border-indigo-500/30 rounded-2xl transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-indigo-500/2 active:scale-[0.98]"
          id="action-card-add-deadline"
        >
          <div className="p-3 bg-amber-950/40 text-amber-400 border border-amber-500/15 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <CheckSquare size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              Add a Deadline
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Get a realistic plan for important work.
            </p>
          </div>
        </button>

        {/* Card 3: Start Focus Session */}
        <button
          onClick={onStartFocus}
          className="flex flex-col items-start text-left p-6 bg-[#0b0f17] hover:bg-[#101520] border border-slate-900 hover:border-indigo-500/30 rounded-2xl transition-all cursor-pointer group space-y-4 hover:shadow-xl hover:shadow-indigo-500/2 active:scale-[0.98]"
          id="action-card-start-focus"
        >
          <div className="p-3 bg-indigo-950/40 text-indigo-400 border border-indigo-500/15 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Play size={18} className="fill-indigo-400/10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
              Start Focus Session
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Work on one task without distractions.
            </p>
          </div>
        </button>

      </div>

      {/* Core Protocol Info Row */}
      <div className="border-t border-slate-900/60 pt-8 max-w-2xl mx-auto text-center">
        <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <Zap size={12} className="text-indigo-400" />
          GetSetDone local dashboard runs entirely on your device with offline state persistence.
        </p>
      </div>

    </div>
  );
};
