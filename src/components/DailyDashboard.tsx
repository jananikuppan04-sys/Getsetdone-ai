import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Flame, 
  CheckSquare, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyDashboardProps {
  userName: string;
  onSwitchToRescue: () => void;
  hasActiveRescuePlan: boolean;
  rescuePlanProgress: number;
}

interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  completed: boolean;
  streak: number;
}

interface WeeklyGoal {
  id: string;
  goal: string;
  completed: boolean;
}

export const DailyDashboard: React.FC<DailyDashboardProps> = ({ 
  userName,
  onSwitchToRescue, 
  hasActiveRescuePlan,
  rescuePlanProgress 
}) => {
  const [focusFinished, setFocusFinished] = useState(false);
  // --- STATE FOR SCHEDULE ---
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('getsetdone_daily_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'sc-1', time: '09:00 AM', task: 'Draft project specifications and schema layout', completed: true },
      { id: 'sc-2', time: '11:00 AM', task: 'Review mock DB stubs and service boundaries', completed: false },
      { id: 'sc-3', time: '02:00 PM', task: 'Deploy initial compiled static bundle', completed: false },
      { id: 'sc-4', time: '04:30 PM', task: 'Formulate README and pitch presentation slides', completed: false }
    ];
  });

  // --- STATE FOR HABITS ---
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('getsetdone_daily_habits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'h-1', name: 'Document pre-requisites first', completed: true, streak: 5 },
      { id: 'h-2', name: 'Verify compilation every 15 mins', completed: false, streak: 3 },
      { id: 'h-3', name: 'Draft readme/docs before finishing code', completed: false, streak: 4 },
      { id: 'h-4', name: 'Run test suite locally', completed: false, streak: 2 }
    ];
  });

  // --- STATE FOR WEEKLY GOALS ---
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem('getsetdone_daily_weekly_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: 'wg-1', goal: 'Launch stable MVP of the project before the weekend', completed: false },
      { id: 'wg-2', goal: 'Maintain a 5-day focus habit streak', completed: true },
      { id: 'wg-3', goal: 'Avoid any last-minute merge crisis on deployment', completed: false }
    ];
  });

  // --- FOCUS SESSION TIMER ---
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  // New item inputs
  const [newScheduleTask, setNewScheduleTask] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('09:00 AM');
  const [newHabitName, setNewHabitName] = useState('');
  const [newGoalText, setNewGoalText] = useState('');

  // Persist Daily State
  useEffect(() => {
    localStorage.setItem('getsetdone_daily_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('getsetdone_daily_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('getsetdone_daily_weekly_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  // Focus Timer Tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setTimerRunning(false);
      if (timerMode === 'focus') {
        setFocusFinished(true);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSecondsLeft, timerMode]);

  const handleTimerPreset = (mode: 'focus' | 'break') => {
    setTimerMode(mode);
    setTimerRunning(false);
    setTimerSecondsLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    setFocusFinished(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Toggles
  const toggleScheduleItem = (id: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(item => {
      if (item.id === id) {
        const nextCompleted = !item.completed;
        return { 
          ...item, 
          completed: nextCompleted,
          streak: nextCompleted ? item.streak + 1 : Math.max(0, item.streak - 1)
        };
      }
      return item;
    }));
  };

  const toggleWeeklyGoal = (id: string) => {
    setWeeklyGoals(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  // Add handlers
  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleTask.trim()) return;
    const newItem: ScheduleItem = {
      id: `sc-new-${Date.now()}`,
      time: newScheduleTime,
      task: newScheduleTask,
      completed: false
    };
    setSchedule(prev => [...prev, newItem]);
    setNewScheduleTask('');
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newItem: Habit = {
      id: `h-new-${Date.now()}`,
      name: newHabitName,
      completed: false,
      streak: 0
    };
    setHabits(prev => [...prev, newItem]);
    setNewHabitName('');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newItem: WeeklyGoal = {
      id: `wg-new-${Date.now()}`,
      goal: newGoalText,
      completed: false
    };
    setWeeklyGoals(prev => [...prev, newItem]);
    setNewGoalText('');
  };

  // Delete handlers
  const handleDeleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteGoal = (id: string) => {
    setWeeklyGoals(prev => prev.filter(item => item.id !== id));
  };

  // Smart check for running behind
  const uncheckedTasksCount = schedule.filter(item => !item.completed).length;
  const isRunningBehind = (hasActiveRescuePlan && rescuePlanProgress < 85) || uncheckedTasksCount >= 3;

  // Progress metrics
  const totalItemsCount = schedule.length + habits.length;
  const completedItemsCount = schedule.filter(i => i.completed).length + habits.filter(i => i.completed).length;
  const dailyProgressPercent = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

  return (
    <div className="space-y-6 text-left" id="daily-dashboard-view">
      
      {/* Dynamic Header */}
      <div className="border-b border-slate-900 pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Your plan for today, {userName}
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          </h1>
          <p className="text-xs text-slate-400">Small progress now prevents last-minute stress later.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-indigo-400" />
          <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Smart Proactive Rescue Mode Switch Callout */}
      {isRunningBehind && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-950/20 border border-red-500/25 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md shadow-red-950/5"
          id="smart-rescue-callout"
        >
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-red-950 border border-red-500/15 rounded-lg text-red-400 animate-pulse shrink-0">
              <Flame size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Running behind? Switch to Rescue Mode.</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                {hasActiveRescuePlan 
                  ? `Your active deadline is at risk (Current plan readiness is only ${rescuePlanProgress}%). Get a realistic recovery flow immediately.`
                  : `You have ${uncheckedTasksCount} uncompleted scheduled tasks left. Pivot to a simplified scope before pressure spikes.`}
              </p>
            </div>
          </div>
          <button
            onClick={onSwitchToRescue}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-lg transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-sm shadow-red-600/10"
          >
            Activate Rescue Mode
            <ArrowRight size={11} />
          </button>
        </motion.div>
      )}

      {/* Main Grid: Left column (Schedule & Habits), Right column (Focus Timer, Weekly Goals, Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Today's Schedule & Habits */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Today's Schedule Card */}
          <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Schedule</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold font-mono">
                {schedule.filter(s => s.completed).length} / {schedule.length} Done
              </span>
            </div>

            {/* List of items */}
            <div className="space-y-2">
              {schedule.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                    item.completed 
                      ? 'bg-emerald-950/5 border-emerald-500/10 text-slate-500' 
                      : 'bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-300'
                  }`}
                >
                  <div 
                    onClick={() => toggleScheduleItem(item.id)}
                    className="flex items-start gap-3 flex-grow cursor-pointer"
                  >
                    <button
                      type="button"
                      className={`mt-0.5 shrink-0 h-4 w-4 rounded border transition-colors flex items-center justify-center ${
                        item.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'bg-[#070b12] border-slate-800'
                      }`}
                    >
                      {item.completed && <CheckCircle2 size={10} className="stroke-[3]" />}
                    </button>
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase block tracking-wider mb-0.5">{item.time}</span>
                      <p className={`text-xs font-medium leading-relaxed ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {item.task}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteScheduleItem(item.id)}
                    className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors self-center shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Schedule Form */}
            <form onSubmit={handleAddScheduleItem} className="flex gap-2 pt-2 border-t border-slate-900">
              <input 
                type="text"
                placeholder="09:00 AM"
                value={newScheduleTime}
                onChange={e => setNewScheduleTime(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-900 focus:border-indigo-500/40 rounded px-2.5 py-1.5 text-[11px] text-slate-300 outline-none placeholder-slate-700 font-mono text-center"
              />
              <input 
                type="text"
                placeholder="Add new calendar item..."
                value={newScheduleTask}
                onChange={e => setNewScheduleTask(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-900 focus:border-indigo-500/40 rounded px-2.5 py-1.5 text-[11px] text-slate-200 outline-none placeholder-slate-600"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white px-3 rounded transition-all flex items-center justify-center cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </form>
          </div>

          {/* Daily Habits Card */}
          <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Daily Habits</h3>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold font-mono">
                {habits.filter(h => h.completed).length} / {habits.length} Done
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {habits.map(habit => (
                <div 
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-start justify-between gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                    habit.completed 
                      ? 'bg-emerald-950/5 border-emerald-500/10 text-slate-500' 
                      : 'bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      className={`h-4.5 w-4.5 rounded-full border transition-colors flex items-center justify-center shrink-0 ${
                        habit.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'bg-[#070b12] border-slate-800'
                      }`}
                    >
                      {habit.completed && <CheckCircle2 size={10} className="stroke-[3]" />}
                    </button>
                    <div className="truncate text-left">
                      <p className={`text-xs font-medium truncate ${habit.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {habit.name}
                      </p>
                      <span className="text-[9px] text-slate-500 font-mono font-bold block mt-0.5">
                        🔥 Streak: {habit.streak} days
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHabit(habit.id);
                    }}
                    className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors self-center shrink-0"
                    title="Remove Habit"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddHabit} className="flex gap-2 pt-2 border-t border-slate-900">
              <input 
                type="text"
                placeholder="Create custom habit (e.g., Take a walk)..."
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-900 focus:border-indigo-500/40 rounded px-2.5 py-1.5 text-[11px] text-slate-200 outline-none placeholder-slate-600"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white px-3 rounded transition-all flex items-center justify-center cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Focus Session, Weekly Goals, Progress */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Daily Progress Widget */}
          <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-3 shadow-sm text-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-left border-b border-slate-900 pb-2">Daily Progress</h3>
            
            <div className="relative py-2">
              <div className="text-2xl font-bold text-white font-mono">{dailyProgressPercent}%</div>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Today's Goal Met</p>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${dailyProgressPercent}%` }}
              ></div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed text-left">
              Includes checklist items from Today's Schedule and completed Daily Habits. Focus on completing 80% to build solid execution consistency.
            </p>
          </div>

          {/* Focus Session Countdown Card */}
          <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm text-center">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Focus Session</h3>
              </div>
              <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                timerMode === 'focus' 
                  ? 'bg-indigo-950/25 border-indigo-500/10 text-indigo-400' 
                  : 'bg-emerald-950/25 border-emerald-500/10 text-emerald-400'
              }`}>
                {timerMode}
              </span>
            </div>

            {/* Countdown timer ticking */}
            <div className="relative py-3">
              <div className="text-4xl font-mono font-bold text-white tracking-widest tabular-nums select-none">
                {formatTimer(timerSecondsLeft)}
              </div>
              {timerRunning && timerMode === 'focus' && (
                <p className="text-[10px] text-indigo-400 font-semibold mt-1.5 animate-pulse" id="focus-timer-stay-with-it">
                  Stay with it, {userName}.
                </p>
              )}
              {focusFinished && (
                <p className="text-[11px] text-emerald-400 font-bold mt-2 bg-emerald-950/20 border border-emerald-500/10 py-1.5 px-3 rounded-lg animate-fade-in" id="focus-timer-finished-msg">
                  Nice work, {userName}. You finished a focus session.
                </p>
              )}
            </div>

            {/* Presets and Actions */}
            <div className="space-y-3">
              <div className="flex justify-center gap-1.5">
                <button
                  onClick={() => handleTimerPreset('focus')}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase border transition-colors cursor-pointer ${
                    timerMode === 'focus' 
                      ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' 
                      : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  25m Focus
                </button>
                <button
                  onClick={() => handleTimerPreset('break')}
                  className={`px-2 py-1 rounded text-[9px] font-bold uppercase border transition-colors cursor-pointer ${
                    timerMode === 'break' 
                      ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  5m Break
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-900/60">
                <button
                  onClick={() => {
                    if (!timerRunning) {
                      setFocusFinished(false);
                    }
                    setTimerRunning(!timerRunning);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] py-1.5 px-3.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {timerRunning ? <Pause size={11} /> : <Play size={11} />}
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerSecondsLeft(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                    setFocusFinished(false);
                  }}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 p-1.5 rounded-lg transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Weekly Goals Card */}
          <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Goals</h3>
              <span className="text-[10px] text-slate-500 font-semibold font-mono">
                {weeklyGoals.filter(w => w.completed).length} / {weeklyGoals.length}
              </span>
            </div>

            <div className="space-y-2">
              {weeklyGoals.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-start justify-between gap-2.5 p-2.5 rounded-lg border transition-all ${
                    item.completed 
                      ? 'bg-emerald-950/5 border-emerald-500/10 text-slate-500' 
                      : 'bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-300'
                  }`}
                >
                  <div 
                    onClick={() => toggleWeeklyGoal(item.id)}
                    className="flex items-start gap-2.5 flex-grow cursor-pointer text-left"
                  >
                    <button
                      type="button"
                      className={`mt-0.5 shrink-0 h-4 w-4 rounded border transition-colors flex items-center justify-center ${
                        item.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'bg-[#070b12] border-slate-800'
                      }`}
                    >
                      {item.completed && <CheckCircle2 size={10} className="stroke-[3]" />}
                    </button>
                    <p className={`text-xs font-medium leading-relaxed ${item.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                      {item.goal}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteGoal(item.id)}
                    className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors self-center shrink-0 animate-fade-in"
                    title="Remove Goal"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2 pt-2 border-t border-slate-900">
              <input 
                type="text"
                placeholder="Add weekly target..."
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
                className="flex-grow bg-slate-950 border border-slate-900 focus:border-indigo-500/40 rounded px-2.5 py-1.5 text-[11px] text-slate-200 outline-none placeholder-slate-600"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white px-3 rounded transition-all flex items-center justify-center cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
