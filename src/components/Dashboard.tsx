import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, 
  ChevronRight, Sparkles, Filter, CheckSquare, Square, FileText, ArrowLeft, HeartPulse, RefreshCw, ShieldAlert,
  LayoutDashboard, Flame, Shield, HelpCircle, Award, Target, History, Settings, Menu, X, ArrowUpRight
} from 'lucide-react';
import { AnalysisResult, Task, EnergyLevel, AgentLedgerEntry, DoneProof, LocalUserProfile } from '../types';
import { AgentDecisionLedger } from './AgentDecisionLedger';
import { DoneProofPanel } from './DoneProofPanel';
import { FinishMeter } from './FinishMeter';
import { SubmissionGate } from './SubmissionGate';
import { generateInitialLedger } from '../utils';
import { DailyDashboard } from './DailyDashboard';
import { MilestonesPage } from './MilestonesPage';
import { LogoIcon, LogoWithWordmark } from './Logo';

interface DashboardProps {
  data: AnalysisResult;
  userProfile: LocalUserProfile;
  onUpdateProfile: (updated: Partial<LocalUserProfile>) => void;
  onResetWorkspace: () => void;
  onUpdateData: (newData: AnalysisResult) => void;
  onBackToIntake: () => void;
  onResetDemo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  userProfile,
  onUpdateProfile,
  onResetWorkspace,
  onUpdateData, 
  onBackToIntake, 
  onResetDemo 
}) => {
  const [activeTab, setActiveTab] = useState<'fullWin' | 'safeSubmit' | 'recovery'>('safeSubmit');
  const [energyFilter, setEnergyFilter] = useState<EnergyLevel>('High');
  const [filterMode, setFilterMode] = useState<'all' | 'match'>('all');
  
  // Custom sidebar active tab state with localStorage persistence
  const [sidebarTab, setSidebarTab] = useState<'today' | 'rescue' | 'milestones' | 'history' | 'settings'>(() => {
    const saved = localStorage.getItem('getsetdone_sidebar_tab');
    if (saved && ['today', 'rescue', 'milestones', 'history', 'settings'].includes(saved)) {
      return saved as any;
    }
    return 'rescue';
  });

  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editPurpose, setEditPurpose] = useState(userProfile.purpose || 'mixed');

  useEffect(() => {
    localStorage.setItem('getsetdone_sidebar_tab', sidebarTab);
  }, [sidebarTab]);

  const [clutchMode, setClutchMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // DoneProofs state
  const [proofs, setProofs] = useState<DoneProof[]>(() => {
    const saved = localStorage.getItem(`getsetdone_proofs_${data.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved proofs:", e);
      }
    }
    return [
      { id: 'proof-deployment', taskId: 'ss-3', type: 'deployment', value: '', status: 'missing', updatedAt: '' },
      { id: 'proof-github', taskId: 'ss-4', type: 'github', value: '', status: 'missing', updatedAt: '' },
      { id: 'proof-readme', taskId: 'ss-4', type: 'google-doc', value: '', status: 'missing', updatedAt: '' },
      { id: 'proof-description', taskId: 'ss-4', type: 'note', value: '', status: 'missing', updatedAt: '' },
      { id: 'proof-demo', taskId: 'ss-4', type: 'image', value: '', status: 'missing', updatedAt: '' },
      { id: 'proof-confirm', taskId: 'ss-5', type: 'note', value: '', status: 'missing', updatedAt: '' }
    ];
  });

  // Agent Ledger Entries state
  const [ledgerEntries, setLedgerEntries] = useState<AgentLedgerEntry[]>(() => {
    const saved = localStorage.getItem(`getsetdone_ledger_${data.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved ledger:", e);
      }
    }
    return generateInitialLedger(data);
  });

  // Synchronize states on data.id change
  useEffect(() => {
    const savedProofs = localStorage.getItem(`getsetdone_proofs_${data.id}`);
    if (savedProofs) {
      try {
        setProofs(JSON.parse(savedProofs));
      } catch (e) {}
    } else {
      setProofs([
        { id: 'proof-deployment', taskId: 'ss-3', type: 'deployment', value: '', status: 'missing', updatedAt: '' },
        { id: 'proof-github', taskId: 'ss-4', type: 'github', value: '', status: 'missing', updatedAt: '' },
        { id: 'proof-readme', taskId: 'ss-4', type: 'google-doc', value: '', status: 'missing', updatedAt: '' },
        { id: 'proof-description', taskId: 'ss-4', type: 'note', value: '', status: 'missing', updatedAt: '' },
        { id: 'proof-demo', taskId: 'ss-4', type: 'image', value: '', status: 'missing', updatedAt: '' },
        { id: 'proof-confirm', taskId: 'ss-5', type: 'note', value: '', status: 'missing', updatedAt: '' }
      ]);
    }

    const savedLedger = localStorage.getItem(`getsetdone_ledger_${data.id}`);
    if (savedLedger) {
      try {
        setLedgerEntries(JSON.parse(savedLedger));
      } catch (e) {}
    } else {
      setLedgerEntries(generateInitialLedger(data));
    }
  }, [data.id]);

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem(`getsetdone_proofs_${data.id}`, JSON.stringify(proofs));
  }, [proofs, data.id]);

  useEffect(() => {
    localStorage.setItem(`getsetdone_ledger_${data.id}`, JSON.stringify(ledgerEntries));
  }, [ledgerEntries, data.id]);

  // Countdown timer state with accurate localStorage date-offset calculation
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const savedPaused = localStorage.getItem(`getsetdone_timer_paused_${data.id}`);
    if (savedPaused) {
      return parseInt(savedPaused, 10);
    }
    const savedEnd = localStorage.getItem(`getsetdone_timer_end_${data.id}`);
    if (savedEnd) {
      const remaining = Math.max(0, Math.floor((parseInt(savedEnd, 10) - Date.now()) / 1000));
      return remaining;
    }
    return data.id === 'hackathon-demo' ? 4 * 60 * 60 : 6 * 60 * 60;
  });

  const [timerRunning, setTimerRunning] = useState<boolean>(() => {
    const savedRunning = localStorage.getItem(`getsetdone_timer_running_${data.id}`);
    return savedRunning === null ? true : savedRunning === 'true';
  });

  // Synchronize timer on data.id change or on initial load
  useEffect(() => {
    const savedPaused = localStorage.getItem(`getsetdone_timer_paused_${data.id}`);
    const savedEnd = localStorage.getItem(`getsetdone_timer_end_${data.id}`);
    let initialSeconds = 6 * 60 * 60;
    if (data.id === 'hackathon-demo') {
      initialSeconds = 4 * 60 * 60;
    }

    if (savedPaused) {
      setSecondsLeft(parseInt(savedPaused, 10));
    } else if (savedEnd) {
      const remaining = Math.max(0, Math.floor((parseInt(savedEnd, 10) - Date.now()) / 1000));
      setSecondsLeft(remaining);
    } else {
      setSecondsLeft(initialSeconds);
      localStorage.setItem(`getsetdone_timer_end_${data.id}`, String(Date.now() + initialSeconds * 1000));
    }
  }, [data.id]);

  // Update localStorage end time or paused remaining seconds
  useEffect(() => {
    localStorage.setItem(`getsetdone_timer_running_${data.id}`, String(timerRunning));
    if (timerRunning) {
      localStorage.removeItem(`getsetdone_timer_paused_${data.id}`);
      localStorage.setItem(`getsetdone_timer_end_${data.id}`, String(Date.now() + secondsLeft * 1000));
    } else {
      localStorage.setItem(`getsetdone_timer_paused_${data.id}`, String(secondsLeft));
      localStorage.removeItem(`getsetdone_timer_end_${data.id}`);
    }
  }, [timerRunning, secondsLeft, data.id]);

  // Countdown clock interval - uses end time to prevent browser tab pause drift
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        const savedEnd = localStorage.getItem(`getsetdone_timer_end_${data.id}`);
        if (savedEnd) {
          const remaining = Math.max(0, Math.floor((parseInt(savedEnd, 10) - Date.now()) / 1000));
          setSecondsLeft(remaining);
          if (remaining <= 0) {
            setTimerRunning(false);
          }
        } else {
          setSecondsLeft(prev => {
            const next = prev - 1;
            if (next <= 0) {
              setTimerRunning(false);
              return 0;
            }
            return next;
          });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, data.id]);


  const handleExportBackup = () => {
    try {
      const backup: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('getsetdone_') || key.startsWith('daily_'))) {
          const val = localStorage.getItem(key);
          if (val) backup[key] = val;
        }
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `getsetdone_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export backup: " + err);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (typeof json !== 'object' || json === null) {
          throw new Error("Invalid backup format");
        }
        
        const keys = Object.keys(json);
        const hasGSKeys = keys.some(k => k.startsWith('getsetdone_') || k.startsWith('daily_'));
        if (!hasGSKeys) {
          throw new Error("This file does not contain valid GetSetDone backup data.");
        }

        keys.forEach(k => {
          if (k.startsWith('getsetdone_') || k.startsWith('daily_')) {
            localStorage.setItem(k, json[k]);
          }
        });

        alert("Backup imported successfully! Your workspace will reload.");
        window.location.reload();
      } catch (err: any) {
        alert("Failed to import backup: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmResetWorkspace = () => {
    onResetWorkspace();
    setShowResetConfirm(false);
  };


  // Convert seconds to HH:MM:SS format
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0')
    ].join(':');
  };

  // Helper to toggle task completion
  const handleToggleTask = (pathType: 'fullWin' | 'safeSubmit' | 'recovery', taskId: string) => {
    const updated = { ...data };
    let taskList: Task[] = [];
    if (pathType === 'fullWin') taskList = updated.fullWinPath;
    if (pathType === 'safeSubmit') taskList = updated.safeSubmitPath;
    if (pathType === 'recovery') taskList = updated.recoveryPath;

    const taskIndex = taskList.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      taskList[taskIndex].completed = !taskList[taskIndex].completed;
      
      if (data.id === 'hackathon-demo' && pathType === 'safeSubmit') {
        const actionText = taskList[taskIndex].action.toLowerCase();
        if (actionText.includes('bypass') && updated.requirements[1]) {
          updated.requirements[1].completed = taskList[taskIndex].completed;
        }
        if (actionText.includes('polish') && updated.requirements[0]) {
          updated.requirements[0].completed = taskList[taskIndex].completed;
        }
        if (actionText.includes('deploy') && updated.requirements[2]) {
          updated.requirements[2].completed = taskList[taskIndex].completed;
        }
        if (actionText.includes('readme') && updated.requirements[3]) {
          updated.requirements[3].completed = taskList[taskIndex].completed;
        }
        if (actionText.includes('readme') && updated.requirements[4]) {
          updated.requirements[4].completed = taskList[taskIndex].completed;
        }
        if (actionText.includes('post') && updated.requirements[5]) {
          updated.requirements[5].completed = taskList[taskIndex].completed;
        }
      }

      // Append ledger event for task status changed
      const newEvent: AgentLedgerEntry = {
        id: `action-${Date.now()}`,
        order: ledgerEntries.length + 1,
        title: `Task Marked ${taskList[taskIndex].completed ? 'Complete' : 'Incomplete'}`,
        summary: `User updated task: "${taskList[taskIndex].action}"`,
        status: taskList[taskIndex].completed ? 'complete' : 'progress',
        icon: 'CheckSquare',
        timestamp: new Date().toLocaleTimeString(),
        source: 'user-action',
        details: [
          `Path Strategy: ${pathType === 'safeSubmit' ? 'Safe Submit' : pathType === 'fullWin' ? 'Full Win' : 'Recovery Playbook'}`,
          `Time Cost: ${taskList[taskIndex].timeEstimate}`,
          `Task impact level: ${taskList[taskIndex].impact}`
        ]
      };
      setLedgerEntries(prev => [...prev, newEvent]);

      onUpdateData(updated);
    }
  };

  // Helper to toggle requirement checklist item
  const handleToggleRequirement = (reqId: string) => {
    const updated = { ...data };
    const reqIndex = updated.requirements.findIndex(r => r.id === reqId);
    if (reqIndex !== -1) {
      updated.requirements[reqIndex].completed = !updated.requirements[reqIndex].completed;
      
      // Append ledger event for requirement status changed
      const newEvent: AgentLedgerEntry = {
        id: `action-${Date.now()}`,
        order: ledgerEntries.length + 1,
        title: `Requirement Checklist Updated`,
        summary: `Requirement "${updated.requirements[reqIndex].requirement}" toggled.`,
        status: updated.requirements[reqIndex].completed ? 'complete' : 'progress',
        icon: 'CheckSquare',
        timestamp: new Date().toLocaleTimeString(),
        source: 'user-action',
        details: [
          `Requirement ID: ${reqId}`,
          `Status: ${updated.requirements[reqIndex].completed ? 'SECURED' : 'OUTSTANDING'}`,
          "Readiness components updated instantly"
        ]
      };
      setLedgerEntries(prev => [...prev, newEvent]);

      onUpdateData(updated);
    }
  };

  // Helper to update DoneProof values and auto-complete requirements
  const handleUpdateProof = (proofId: string, value: string, fileName?: string, status?: DoneProof['status']) => {
    const updatedProofs = proofs.map(p => {
      if (p.id === proofId) {
        return {
          ...p,
          value,
          fileName,
          status: status || 'added',
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    setProofs(updatedProofs);

    let proofTitle = proofId;
    if (proofId === 'proof-deployment') proofTitle = 'Deployment Link';
    if (proofId === 'proof-github') proofTitle = 'GitHub Repository';
    if (proofId === 'proof-readme') proofTitle = 'README Documentation';
    if (proofId === 'proof-description') proofTitle = 'Project Description';
    if (proofId === 'proof-demo') proofTitle = 'Demo Screenshot/Video';
    if (proofId === 'proof-confirm') proofTitle = 'Submission Confirmation';

    const newEvent: AgentLedgerEntry = {
      id: `action-${Date.now()}`,
      order: ledgerEntries.length + 1,
      title: `${proofTitle} Verified`,
      summary: `User attached valid evidence for ${proofTitle}.`,
      status: 'complete',
      icon: 'CheckSquare',
      timestamp: new Date().toLocaleTimeString(),
      source: 'user-action',
      details: [
        `Verification detail: ${fileName || value}`,
        `Updated timestamp: ${new Date().toLocaleTimeString()}`,
        "Circular progress recalibration complete"
      ]
    };
    setLedgerEntries(prev => [...prev, newEvent]);

    const updated = { ...data };
    if (proofId === 'proof-deployment' && updated.requirements[2]) {
      updated.requirements[2].completed = true;
    }
    if (proofId === 'proof-github' && updated.requirements[3]) {
      updated.requirements[3].completed = true;
    }
    if (proofId === 'proof-readme' && updated.requirements[4]) {
      updated.requirements[4].completed = true;
    }
    if (proofId === 'proof-description' && updated.requirements[4]) {
      updated.requirements[4].completed = true;
    }
    if (proofId === 'proof-confirm' && updated.requirements[5]) {
      updated.requirements[5].completed = true;
    }
    onUpdateData(updated);
  };

  // Helper to mark a proof complete directly from user check
  const handleMarkProofComplete = (proofId: string, completed: boolean) => {
    const updatedProofs = proofs.map(p => {
      if (p.id === proofId) {
        return {
          ...p,
          status: (completed ? 'complete' : 'missing') as DoneProof['status'],
          updatedAt: completed ? new Date().toISOString() : ''
        };
      }
      return p;
    });
    setProofs(updatedProofs);

    const updated = { ...data };
    if (proofId === 'proof-deployment' && updated.requirements[2]) {
      updated.requirements[2].completed = completed;
    }
    if (proofId === 'proof-github' && updated.requirements[3]) {
      updated.requirements[3].completed = completed;
    }
    if (proofId === 'proof-readme' && updated.requirements[4]) {
      updated.requirements[4].completed = completed;
    }
    if (proofId === 'proof-description' && updated.requirements[4]) {
      updated.requirements[4].completed = completed;
    }
    if (proofId === 'proof-confirm' && updated.requirements[5]) {
      updated.requirements[5].completed = completed;
    }
    onUpdateData(updated);
  };

  // Cognitive Replan Blocked Handler
  const handleTriggerBlockedReplan = () => {
    const updated = { ...data };
    
    const ss1Idx = updated.safeSubmitPath.findIndex(t => t.id === 'ss-1');
    if (ss1Idx !== -1) {
      updated.safeSubmitPath[ss1Idx].completed = true;
    }
    const req2Idx = updated.requirements.findIndex(r => r.id === 'req-2');
    if (req2Idx !== -1) {
      updated.requirements[req2Idx].completed = true;
    }

    const ss2Idx = updated.safeSubmitPath.findIndex(t => t.id === 'ss-2');
    if (ss2Idx !== -1) {
      updated.safeSubmitPath[ss2Idx].completed = true;
    }
    const req1Idx = updated.requirements.findIndex(r => r.id === 'req-1');
    if (req1Idx !== -1) {
      updated.requirements[req1Idx].completed = true;
    }

    onUpdateData(updated);

    const baseOrder = ledgerEntries.length + 1;
    const newEvents: AgentLedgerEntry[] = [
      {
        id: `blocked-${Date.now()}-1`,
        order: baseOrder,
        title: "Blocker Reported",
        summary: "User reported broken authentication system blocker.",
        status: "blocker",
        icon: "ShieldAlert",
        timestamp: new Date().toLocaleTimeString(),
        source: "user-action",
        details: [
          "Blocked Item: Authentication Sign-In middleware error",
          "Impact Level: 95% deadline crash risk assessed if debugging continues"
        ]
      },
      {
        id: `blocked-${Date.now()}-2`,
        order: baseOrder + 1,
        title: "Impact Assessed",
        summary: "Analyzed time requirements. Debugging authentication requires 2-3 hours.",
        status: "high-risk",
        icon: "AlertCircle",
        timestamp: new Date().toLocaleTimeString(),
        source: "user-action",
        details: [
          "Remaining Time: 4 Hours Total",
          "Verdict: Remaining budget is insufficient for database rewrites without failing submission entirely"
        ]
      },
      {
        id: `blocked-${Date.now()}-3`,
        order: baseOrder + 2,
        title: "Tasks Reordered / Removed",
        summary: "Suspended active database migration; promoted offline local fallback.",
        status: "optimized",
        icon: "Scissors",
        timestamp: new Date().toLocaleTimeString(),
        source: "user-action",
        details: [
          "Removed: ss-1 / fw-1 custom middleware repair",
          "Promoted: localStorage-based dummy token session bypass"
        ]
      },
      {
        id: `blocked-${Date.now()}-4`,
        order: baseOrder + 3,
        title: "Fallback Solution Selected",
        summary: "Standard offline mock mode activated (+20% Blocker Safety resolved).",
        status: "recommended",
        icon: "CheckSquare",
        timestamp: new Date().toLocaleTimeString(),
        source: "user-action",
        details: [
          "Mechanism: Auto-injected dummy session into localStorage bypass routes",
          "Judges: Will bypass registration requirements directly to access working core flow"
        ]
      },
      {
        id: `blocked-${Date.now()}-5`,
        order: baseOrder + 4,
        title: "New Readiness Score Calculated",
        summary: "Recalculated Finish Meter readiness score with blockers fully cleared.",
        status: "progress",
        icon: "Award",
        timestamp: new Date().toLocaleTimeString(),
        source: "user-action",
        details: [
          "Score Impact: High-risk blocker penalty removed (+20 points)",
          "Next step: Attach static build deployment and readme documentation proofs"
        ]
      }
    ];

    setLedgerEntries(prev => [...prev, ...newEvents]);
  };

  const getActiveTasks = (): Task[] => {
    if (activeTab === 'fullWin') return data.fullWinPath;
    if (activeTab === 'safeSubmit') return data.safeSubmitPath;
    return data.recoveryPath;
  };

  const activeTasks = getActiveTasks();

  const isTaskMatchingEnergy = (task: Task, level: EnergyLevel): boolean => {
    if (level === 'High') {
      return task.impact === 'Critical' || task.impact === 'High' || task.timeMinutes >= 45;
    }
    if (level === 'Medium') {
      return task.timeMinutes >= 20 && task.timeMinutes <= 60;
    }
    return task.timeMinutes < 30 || task.impact === 'Low' || task.impact === 'Medium';
  };

  const filteredTasks = activeTasks.filter(t => {
    if (filterMode === 'match') {
      return isTaskMatchingEnergy(t, energyFilter);
    }
    return true;
  });

  const completedActiveTasks = activeTasks.filter(t => t.completed).length;
  const totalActiveTasks = activeTasks.length;
  const activeTaskPercent = totalActiveTasks > 0 ? Math.round((completedActiveTasks / totalActiveTasks) * 100) : 0;

  const completedRequirements = data.requirements.filter(r => r.completed).length;
  const totalRequirements = data.requirements.length;

  // --- FINISH METER CALCULATIONS ---
  const totalReqs = data.requirements.length;
  const completedReqs = data.requirements.filter(r => r.completed).length;
  
  const deliverablesRawPercent = totalReqs > 0 ? (completedReqs / totalReqs) * 100 : 0;
  let deliverablesComponentScore = Math.round((completedReqs / totalReqs) * 35);
  
  const baseCodeProgress = (data.id === 'hackathon-demo') ? 21 : 0;
  deliverablesComponentScore += baseCodeProgress;

  const totalProofs = proofs.length;
  const completedProofs = proofs.filter(p => p.status === 'complete' || p.status === 'format-verified' || p.status === 'added').length;
  const proofsRawPercent = totalProofs > 0 ? (completedProofs / totalProofs) * 100 : 0;
  const proofsComponentScore = Math.round((completedProofs / totalProofs) * 30);

  const blockersResolved = data.requirements.some(r => r.id === 'req-2' && r.completed) || data.safeSubmitPath.some(t => t.id === 'ss-1' && t.completed);
  const blockersComponentScore = blockersResolved ? 20 : 0;

  let deadlineSafetyPercent = 0;
  if (activeTab === 'safeSubmit' || activeTab === 'recovery') {
    deadlineSafetyPercent = 100;
  } else {
    deadlineSafetyPercent = 20;
  }
  const safetyComponentScore = Math.round((deadlineSafetyPercent / 100) * 15);

  let totalReadinessScore = deliverablesComponentScore + proofsComponentScore + blockersComponentScore + safetyComponentScore;
  if (totalReadinessScore > 100) totalReadinessScore = 100;

  const allReqsComplete = completedReqs === totalReqs;
  const allProofsComplete = completedProofs === totalProofs;
  const noBlockersRemaining = blockersResolved;
  const scoreThresholdMet = totalReadinessScore >= 85;

  const isGateLocked = !(allReqsComplete && allProofsComplete && noBlockersRemaining && scoreThresholdMet);

  const gateLockReasons: string[] = [];
  if (!allReqsComplete) {
    gateLockReasons.push(`Deliverables: ${totalReqs - completedReqs} outstanding deliverables remain.`);
  }
  if (!allProofsComplete) {
    gateLockReasons.push(`DoneProof: ${totalProofs - completedProofs} verification checks are missing.`);
  }
  if (!noBlockersRemaining) {
    gateLockReasons.push('Execution Risk: Unresolved high-risk database/auth blocker. Update My Plan.');
  }
  if (!scoreThresholdMet) {
    gateLockReasons.push(`Readiness: Core rating is ${totalReadinessScore}%. Target 85% to unlock.`);
  }

  const nextStepSuggestions: string[] = [];
  if (!blockersResolved) {
    nextStepSuggestions.push('Activate "I’m Stuck — Update My Plan" to initiate dummy token local authorization bypass.');
  }
  if (proofs.find(p => p.id === 'proof-deployment')?.status === 'missing') {
    nextStepSuggestions.push('Submit a valid production URL inside the deployment proof module.');
  }
  if (proofs.find(p => p.id === 'proof-github')?.status === 'missing') {
    nextStepSuggestions.push('Attach your official GitHub repository link to verify your delivery format.');
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-950/10', bar: 'bg-red-500' };
    if (score >= 40) return { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-950/10', bar: 'bg-amber-500' };
    return { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-950/10', bar: 'bg-emerald-500' };
  };

  const riskStyle = getRiskColor(data.realityCheck.riskScore);

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 flex flex-col md:flex-row relative" id="dashboard-root">
      
      {/* ========================================================== */}
      {/* MOBILE HEADER BAR                                          */}
      {/* ========================================================== */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0b0f17] border-b border-slate-900 sticky top-0 z-50">
        <LogoWithWordmark />
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-red-950/20 text-red-400 border border-red-500/10 px-2 py-0.5 rounded font-mono font-bold">
            03:42:18
          </span>
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {isMobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* LEFT SIDEBAR (Notion/Linear Inspired Drawer/Rail)          */}
      {/* ========================================================== */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0b0f17] border-r border-slate-900/80 p-5 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 shrink-0
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} id="left-sidebar">
        <div className="space-y-6">
          
          {/* Logo & short tagline */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-900">
            <LogoWithWordmark />
          </div>

          {/* Navigation Section List */}
          <div className="space-y-4">
            
            {/* DAILY SECTION */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2 block mb-1">Daily</span>
              <button
                onClick={() => { setSidebarTab('today'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  sidebarTab === 'today'
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent'
                }`}
              >
                <LayoutDashboard size={14} />
                Today
              </button>
            </div>

            {/* RESCUE SECTION */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2 block mb-1">Rescue</span>
              
              <button
                onClick={() => { setSidebarTab('rescue'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  sidebarTab === 'rescue'
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent'
                }`}
              >
                <Shield size={14} className="text-emerald-500" />
                Your Deadline Plan
              </button>

              <button
                onClick={onBackToIntake}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent text-left cursor-pointer"
              >
                <Flame size={14} className="text-amber-500" />
                Add Your Deadline
              </button>
            </div>

            {/* PROGRESS SECTION */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2 block mb-1">Progress</span>
              
              <button
                onClick={() => { setSidebarTab('milestones'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  sidebarTab === 'milestones'
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent'
                }`}
              >
                <Target size={14} />
                Milestones & Rewards
              </button>

              <button
                onClick={() => { setSidebarTab('history'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  sidebarTab === 'history'
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent'
                }`}
              >
                <History size={14} />
                Past Plans
              </button>
            </div>

            {/* CONFIGURATION SECTION */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2 block mb-1">Configuration</span>
              
              <button
                onClick={() => { setSidebarTab('settings'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  sidebarTab === 'settings'
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 border border-transparent'
                }`}
              >
                <Settings size={14} />
                Settings & Backup
              </button>
            </div>

          </div>

          {/* Clutch Mode Card with toggle */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Flame size={11} className={`${clutchMode ? 'text-orange-500 animate-pulse' : 'text-slate-500'}`} />
                Clutch Mode
              </span>
              <button 
                onClick={() => setClutchMode(!clutchMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  clutchMode ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  clutchMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 leading-normal">
              {clutchMode 
                ? "Active. Hyper-execution model throttles long-duration research tasks." 
                : "Disabled. Toggle to prune optional sub-tasks from plan sequence."}
            </p>
          </div>

        </div>

        {/* User profile card at bottom */}
        <div className="relative pt-3 border-t border-slate-900 font-sans">
          {showProfileMenu && (
            <div className="absolute bottom-12 left-0 right-0 bg-[#0b0f17] border border-slate-800/80 rounded-xl p-2 shadow-xl space-y-1 z-50 animate-slide-up text-left">
              <button 
                onClick={() => {
                  setSidebarTab('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left text-[11px] text-slate-300 hover:text-white hover:bg-slate-950 px-2 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <Settings size={12} className="text-slate-400" />
                Workspace Settings
              </button>
              <button 
                onClick={() => {
                  setEditName(userProfile.name);
                  setEditPurpose(userProfile.purpose || 'mixed');
                  setShowEditProfileModal(true);
                  setShowProfileMenu(false);
                }}
                className="w-full text-left text-[11px] text-slate-300 hover:text-white hover:bg-slate-950 px-2 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                id="edit-profile-menu-btn"
              >
                <Award size={12} className="text-slate-400" />
                Edit Profile
              </button>
              <button 
                onClick={() => {
                  setShowResetConfirm(true);
                  setShowProfileMenu(false);
                }}
                className="w-full text-left text-[11px] text-red-400 hover:text-red-300 hover:bg-red-950/20 px-2 py-1.5 rounded transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <ShieldAlert size={12} className="text-red-400" />
                Reset Workspace
              </button>
            </div>
          )}

          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-between gap-2 text-xs cursor-pointer p-1.5 hover:bg-slate-950 rounded-lg border border-transparent hover:border-slate-850 transition-all animate-fade-in"
            id="user-profile-trigger"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] uppercase shadow-sm shrink-0">
                {userProfile.name.charAt(0)}
              </div>
              <div className="min-w-0 text-left">
                <p className="font-bold text-white leading-none truncate">{userProfile.name}</p>
                <p className="text-[9px] text-slate-500 truncate mt-0.5 capitalize">{userProfile.purpose || 'mixed'} goals</p>
              </div>
            </div>
            <Menu size={12} className="text-slate-400 shrink-0" />
          </div>
        </div>
      </aside>

      {/* Background Dim for Mobile Sidebar overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* ========================================================== */}
      {/* MAIN CONTENT AREA                                          */}
      {/* ========================================================== */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-6xl mx-auto" id="main-workspace-frame">
        
        {/* Dynamic Hourly Greeting Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-indigo-950/20 to-slate-900/10 border border-slate-900 rounded-xl p-4 animate-fade-in" id="hourly-greeting-banner">
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return `Good morning, ${userProfile.name}.`;
                if (hour < 17) return `Good afternoon, ${userProfile.name}.`;
                return `Good evening, ${userProfile.name}.`;
              })()}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Let’s make the next move count.</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/40 border border-indigo-500/10 rounded-full w-fit">
            <Sparkles size={11} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] text-indigo-300 font-semibold capitalize">{userProfile.purpose || 'mixed'} workspace</span>
          </div>
        </div>

        {/* Global Dual-Mode Top Switcher */}
        <div className="bg-[#0b0f17]/95 border border-slate-900 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-sm">
          <div className="space-y-1">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-900/60 w-fit">
              <button
                onClick={() => setSidebarTab('today')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  sidebarTab === 'today'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard size={12} />
                Daily Mode
              </button>
              <button
                onClick={() => setSidebarTab('rescue')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  sidebarTab === 'rescue'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield size={12} className="text-emerald-400" />
                Rescue Mode
              </button>
            </div>
            <p className="text-[11px] text-slate-500 pl-1">
              {sidebarTab === 'today' && "🗓️ Daily Mode: Build habits, plan your day, and stay ahead."}
              {sidebarTab === 'rescue' && "🚑 Rescue Mode: Get a realistic plan when a deadline is at risk."}
              {sidebarTab === 'milestones' && "🏆 Milestones & Rewards: See your consistent streaks and badges."}
              {sidebarTab === 'history' && "📜 Past Plans: Keep track of saved historical recovery workbooks."}
            </p>
          </div>

          {/* AI-driven Proactive Switch Nudge (Missed tasks / urgent deadline trigger) */}
          {sidebarTab === 'today' && (
            <div className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/20 text-red-400 px-3.5 py-2 rounded-xl text-xs animate-pulse">
              <span className="font-semibold">Running behind? Switch to Rescue Mode.</span>
              <button
                onClick={() => setSidebarTab('rescue')}
                className="bg-red-500/10 hover:bg-red-500/25 text-red-300 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Quick Switch
              </button>
            </div>
          )}
        </div>

        {/* Render Today (Daily Dashboard) View */}
        {sidebarTab === 'today' && (
          <div className="animate-fade-in text-left">
            <DailyDashboard 
              userName={userProfile.name}
              onSwitchToRescue={() => setSidebarTab('rescue')}
              hasActiveRescuePlan={true}
              rescuePlanProgress={activeTaskPercent}
            />
          </div>
        )}

        {/* Render Milestones & Rewards View */}
        {sidebarTab === 'milestones' && (
          <div className="animate-fade-in text-left">
            <MilestonesPage 
              userName={userProfile.name}
              readyToSubmitScore={totalReadinessScore}
              completedTasksCount={completedActiveTasks}
              totalTasksCount={totalActiveTasks}
              completedProofsCount={completedProofs}
              totalProofsCount={totalProofs}
            />
          </div>
        )}

        {/* Render History view if clicked */}
        {sidebarTab === 'history' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Past Plans</h2>
                <p className="text-xs text-slate-400">Review past mitigation plans and completion compliance stats.</p>
              </div>
              <button onClick={() => setSidebarTab('rescue')} className="text-xs text-indigo-400 hover:underline">Back to Plan</button>
            </div>
            <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-6 text-center text-slate-400 space-y-3">
              <History size={32} className="mx-auto text-slate-600" />
              <p className="font-bold text-white text-xs">No saved archival plans found</p>
              <p className="text-[11px] leading-relaxed max-w-sm mx-auto">
                Only active live rescue sheets are tracked in local storage. Once you successfully lock a completed bundle, historical metrics persist here.
              </p>
            </div>
          </div>
        )}

        {/* Render Settings view if clicked */}
        {sidebarTab === 'settings' && (
          <div className="space-y-6 animate-fade-in text-left animate-slide-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Workspace Settings & Backups</h2>
                <p className="text-xs text-slate-400">Configure your local workspace, reset data, or backup progress.</p>
              </div>
              <button onClick={() => setSidebarTab('rescue')} className="text-xs text-indigo-400 hover:underline">Back to Plan</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Backups card */}
              <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Export & Import Backup</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Save your active workspace progress, daily habits, focus metrics, and custom proofs into a single JSON backup file, or restore from a previously saved backup.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleExportBackup}
                    className="flex-1 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 hover:text-indigo-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Export JSON Backup
                  </button>
                  <label className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center">
                    Import JSON Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Danger Zone card */}
              <div className="bg-[#0b0f17] border border-red-950/40 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider">Danger Zone</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Resetting your workspace will permanently delete all active plans, custom tasks, daily streaks, habits, goals, and proof files from this browser's local storage. This action cannot be undone.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full sm:w-auto bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-350 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Reset My Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN DASHBOARD PANEL VIEW (Rescue Mode) */}
        {sidebarTab === 'rescue' && (
          <div className="space-y-6 text-left animate-fade-in">
            
            {/* Top Greeting */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-900 pb-3">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Your Deadline Plan
                  <span className="text-indigo-400 text-xs font-normal">Active Strategy Board</span>
                </h1>
                <p className="text-[11px] text-slate-400">You have {Math.floor(secondsLeft / 3600)} hours {Math.floor((secondsLeft % 3600) / 60)} minutes left. Let’s focus on what matters.</p>
              </div>
              
              {/* Reset/Intake actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onBackToIntake}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Sparkles size={11} />
                  New Crisis
                </button>
              </div>
            </div>

            {/* ========================================================== */}
            {/* COMPACT METRICS GRID                                       */}
            {/* ========================================================== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="metrics-card-grid">
              
              {/* Metric 1: Time Remaining */}
              <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 h-8 w-8 bg-indigo-500/5 blur-lg rounded-full"></div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Time Remaining</span>
                  <Clock size={11} className="text-indigo-400 shrink-0" />
                </div>
                <div className="mt-2 text-center py-2 bg-slate-950 rounded-lg border border-slate-900">
                  <p className="text-base font-mono font-bold text-white tracking-widest">
                    {formatTime(secondsLeft)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1 text-[9px] text-slate-500 font-mono">
                  <button onClick={() => setTimerRunning(!timerRunning)} className="hover:text-white flex items-center gap-0.5">
                    {timerRunning ? <Pause size={9} /> : <Play size={9} />}
                    {timerRunning ? 'Hold' : 'Play'}
                  </button>
                  <button 
                    onClick={() => setSecondsLeft(data.id === 'hackathon-demo' ? 4*60*60 : 6*60*60)} 
                    className="hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Metric 2: Risk Status */}
              <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Risk Level</span>
                  <ShieldAlert size={11} className="text-red-400 shrink-0 animate-pulse" />
                </div>
                <div className="mt-3.5 space-y-1.5">
                  <p className={`text-sm font-bold tracking-wide ${riskStyle.text}`}>
                    {data.realityCheck.riskLevel} Crash
                  </p>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${riskStyle.bar}`} style={{ width: `${data.realityCheck.riskScore}%` }}></div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 font-mono">Score: {data.realityCheck.riskScore}%</p>
              </div>

              {/* Metric 3: Strategy Path */}
              <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Recommended Plan</span>
                  <Flame size={11} className="text-indigo-400 shrink-0" />
                </div>
                <div className="mt-3.5 space-y-1">
                  <p className="text-xs font-bold text-white capitalize">
                    {activeTab === 'safeSubmit' ? 'Best Plan to Finish' : activeTab === 'fullWin' ? 'Full Plan' : 'Backup Plan'}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    {activeTab === 'safeSubmit' ? '95% safety margin' : activeTab === 'fullWin' ? 'Extremely risky' : 'Contingency only'}
                  </p>
                </div>
                <p className="text-[9px] text-indigo-400 mt-2 font-mono">{activeTaskPercent}% tasks complete</p>
              </div>

              {/* Metric 4: Readiness Score */}
              <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Readiness Score</span>
                  <Award size={11} className="text-emerald-400 shrink-0" />
                </div>
                <div className="mt-3.5 space-y-1.5">
                  <p className="text-sm font-mono font-bold text-emerald-400">
                    {totalReadinessScore}%
                  </p>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${totalReadinessScore}%` }}></div>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 mt-2 font-mono">Gate target: 85%</p>
              </div>

            </div>

            {/* ========================================================== */}
            {/* NEXT BEST MOVE HERO ACTION CARD                            */}
            {/* ========================================================== */}
            <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm" id="next-best-move-card">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Next Best Move</span>
                </div>
                <p className="text-xs font-bold text-white">
                  {!blockersResolved 
                    ? "Bypass broken user authorization" 
                    : "Attach deployment link to DoneProof"}
                </p>
                <p className="text-[11px] text-slate-400 leading-normal max-w-xl">
                  {!blockersResolved 
                    ? "Bypassing uncompleted client auth middlewares with mock tokens secures delivery without losing hours debugging." 
                    : "Unlocking the Submission Gate requires registering your compiled production URL inside the DoneProof panel."}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="text-[10px] text-slate-400 font-mono">Est: {!blockersResolved ? '45m' : '10m'}</span>
                {!blockersResolved ? (
                  <button
                    onClick={handleTriggerBlockedReplan}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    Start Now
                    <ArrowUpRight size={12} />
                  </button>
                ) : (
                  <div className="bg-emerald-950/20 border border-emerald-500/15 text-emerald-400 font-bold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1">
                    <CheckCircle size={12} />
                    Done
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================== */}
            {/* MULTI-PATH WORKSPACE SECTION (Middle Content)              */}
            {/* ========================================================== */}
            <div className="space-y-4">
              
              {/* Strategy Tabs */}
              <div className="bg-[#0b0f17] p-1 rounded-xl border border-slate-900 flex gap-1">
                <button
                  onClick={() => setActiveTab('safeSubmit')}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all relative cursor-pointer ${
                    activeTab === 'safeSubmit'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-250'
                  }`}
                >
                  Best Plan to Finish
                  <span className="text-[9px] block opacity-75 font-normal">95% Success Rate</span>
                </button>

                <button
                  onClick={() => setActiveTab('fullWin')}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'fullWin'
                      ? 'bg-slate-900 border border-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-250'
                  }`}
                >
                  Full Plan
                  <span className="text-[9px] block opacity-75 font-normal text-rose-400">High Risk</span>
                </button>

                <button
                  onClick={() => setActiveTab('recovery')}
                  className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === 'recovery'
                      ? 'bg-slate-900 border border-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-250'
                  }`}
                >
                  Backup Plan
                  <span className="text-[9px] block opacity-75 font-normal">Emergency Reserves</span>
                </button>
              </div>

              {/* Description Block */}
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg text-[11px] leading-relaxed text-slate-400">
                {activeTab === 'safeSubmit' && "🛡️ BEST PLAN TO FINISH: Prioritizes immediate static layout compilation, mocked credentials, and comprehensive README documentation. Focuses purely on delivering a working core flow on-time."}
                {activeTab === 'fullWin' && "🔥 FULL PLAN: Original unpruned milestone checklist. Extremely risky. database lockouts, slow client authentication, and unreleased components increase the danger of absolute failure."}
                {activeTab === 'recovery' && "🚨 BACKUP PLAN: Playbook steps designed to mitigate hosting errors, database migrations, and build crashes that frequently occur in the final 60 minutes."}
              </div>

              {/* Energy Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0b0f17]/50 border border-slate-900 p-3 rounded-lg text-xs">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 shrink-0">
                  <HeartPulse size={12} className="text-indigo-400 shrink-0" />
                  Filter by Focus Level
                </span>
                
                <div className="flex gap-1.5 overflow-x-auto">
                  {(['Low', 'Medium', 'High'] as EnergyLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        setEnergyFilter(lvl);
                        setFilterMode('match');
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors border cursor-pointer ${
                        energyFilter === lvl && filterMode === 'match'
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-colors cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-950 border-slate-900 text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    Clear Filter
                  </button>
                </div>
              </div>

              {/* Spacious Task Rows */}
              <div className="space-y-2.5">
                {filteredTasks.length === 0 ? (
                  <div className="bg-slate-950 border border-slate-900 p-8 text-center rounded-xl text-xs text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-400">No active tasks match this Energy filter.</p>
                    <p className="text-[10px]">Toggle 'Clear Filter' above to view the complete strategic schedule.</p>
                  </div>
                ) : (
                  filteredTasks.map((task, idx) => {
                    const isMatching = isTaskMatchingEnergy(task, energyFilter);

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(activeTab, task.id)}
                        className={`relative z-10 flex gap-3.5 bg-[#0b0f17] border rounded-xl p-4 transition-all cursor-pointer group ${
                          task.completed 
                            ? 'border-emerald-500/10 bg-emerald-950/5' 
                            : isMatching && filterMode === 'match'
                              ? 'border-indigo-500/20 bg-indigo-950/10'
                              : 'border-slate-850 hover:border-slate-800'
                        }`}
                        id={`task-row-${task.id}`}
                      >
                        {/* Custom status checkbox */}
                        <div className="mt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleTask(activeTab, task.id)}
                            className={`h-4.5 w-4.5 rounded border transition-colors flex items-center justify-center cursor-pointer ${
                              task.completed 
                                ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-600'
                            }`}
                          >
                            {task.completed && <CheckCircle size={11} className="stroke-[3]" />}
                          </button>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h4 className={`text-xs font-bold leading-normal truncate ${
                              task.completed ? 'text-slate-500 line-through' : 'text-slate-100 group-hover:text-white'
                            }`}>
                              {task.action}
                            </h4>
                            
                            <span className="text-[9px] text-slate-500 font-mono font-bold shrink-0">
                              ⏱️ {task.timeEstimate}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              task.impact === 'Critical' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/15' 
                                : 'bg-slate-950 text-slate-500 border-slate-900'
                            }`}>
                              {task.impact} Impact
                            </span>

                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              task.urgency === 'Immediate' || task.urgency === 'High'
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15'
                                : 'bg-slate-950 text-slate-500 border-slate-900'
                            }`}>
                              {task.urgency} Urgency
                            </span>

                            {isMatching && (
                              <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border-emerald-500/15">
                                Focus Match
                              </span>
                            )}
                          </div>

                          <p className={`text-[11px] leading-relaxed ${task.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                            <span className="font-bold text-slate-300 uppercase tracking-widest text-[8px] block mb-0.5">Strategy Rationale:</span>
                            {task.reason}
                          </p>

                          {task.dependency && (
                            <p className="text-[9px] text-slate-600 font-medium">
                              Dependency: <span className="font-mono text-slate-500">{task.dependency}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* ========================================================== */}
      {/* RIGHT SIDEBAR (Calm, stacked metadata metrics)              */}
      {/* ========================================================== */}
      <aside className="hidden lg:block w-76 bg-[#070b12] border-l border-slate-900/80 p-5 space-y-6 shrink-0" id="right-sidebar">
        
        {/* Finish Meter */}
        <FinishMeter 
          score={totalReadinessScore}
          breakdown={{
            deliverables: deliverablesRawPercent,
            proofs: proofsRawPercent,
            blockersResolved: blockersResolved,
            deadlineSafety: deadlineSafetyPercent
          }}
          suggestions={nextStepSuggestions}
        />

        {/* Deliverables Checklist checklist */}
        <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-4.5 space-y-3.5">
          <div>
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest block">Deliverable Checklist</h3>
            <p className="text-[9px] text-slate-500 mt-0.5">Toggle complete criteria checks manually.</p>
          </div>

          <div className="space-y-1.5">
            {data.requirements.map((req) => (
              <div 
                key={req.id}
                onClick={() => handleToggleRequirement(req.id)}
                className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  req.completed 
                    ? 'bg-emerald-950/10 border-emerald-500/10 text-slate-500' 
                    : 'bg-slate-950 border-slate-900 hover:border-slate-850 text-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleRequirement(req.id);
                  }}
                  className={`mt-0.5 shrink-0 h-4 w-4 rounded border transition-colors ${
                    req.completed 
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950 flex items-center justify-center' 
                      : 'border-slate-800'
                  }`}
                >
                  {req.completed && <CheckCircle size={10} className="stroke-[3]" />}
                </button>
                <span className={`text-[11px] font-medium leading-tight ${req.completed ? 'line-through text-slate-500' : ''}`}>
                  {req.requirement}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest pt-2 border-t border-slate-950">
            {completedRequirements} of {totalRequirements} SECURED
          </p>
        </div>

        {/* DoneProof inputs */}
        <DoneProofPanel 
          proofs={proofs}
          onUpdateProof={handleUpdateProof}
          onMarkComplete={handleMarkProofComplete}
        />

        {/* Release gate */}
        <SubmissionGate 
          score={totalReadinessScore}
          isLocked={isGateLocked}
          lockReasons={gateLockReasons}
          proofs={proofs}
        />

        {/* Agent Ledger audit log */}
        <AgentDecisionLedger 
          entries={ledgerEntries} 
          isRescueMode={data.isRescueMode} 
        />

      </aside>

      {/* ========================================================== */}
      {/* MOBILE BOTTOM NAVIGATION & ACTIONS                         */}
      {/* ========================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0f17]/95 backdrop-blur-md border-t border-slate-900 px-2 py-2 flex items-center justify-around text-[10px] text-slate-500">
        <button 
          onClick={() => { setSidebarTab('today'); }}
          className={`flex flex-col items-center gap-0.5 ${sidebarTab === 'today' ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          <LayoutDashboard size={15} />
          <span>Today</span>
        </button>

        <button 
          onClick={() => { setSidebarTab('rescue'); }}
          className={`flex flex-col items-center gap-0.5 ${sidebarTab === 'rescue' ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          <Shield size={15} />
          <span>Rescue</span>
        </button>

        <button 
          onClick={() => { setSidebarTab('milestones'); }}
          className={`flex flex-col items-center gap-0.5 ${sidebarTab === 'milestones' ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          <Award size={15} />
          <span>Milestones</span>
        </button>

        <button 
          onClick={() => { setSidebarTab('history'); }}
          className={`flex flex-col items-center gap-0.5 ${sidebarTab === 'history' ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          <History size={15} />
          <span>History</span>
        </button>

        <button 
          onClick={() => { setSidebarTab('settings'); }}
          className={`flex flex-col items-center gap-0.5 ${sidebarTab === 'settings' ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
        >
          <Settings size={15} />
          <span>Settings</span>
        </button>
      </div>

      {/* Floating sticky Replan Button on mobile layout if auth blocker is active */}
      {!blockersResolved && sidebarTab === 'rescue' && (
        <div className="md:hidden fixed bottom-14 left-4 right-4 z-40">
          <button
            onClick={handleTriggerBlockedReplan}
            className="w-full bg-red-950 border border-red-500/20 text-red-400 hover:text-red-300 rounded-lg py-2 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <ShieldAlert size={14} className="shrink-0 animate-pulse" />
            I'm Stuck — Update My Plan
          </button>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" id="reset-confirm-modal">
          <div className="bg-[#0b0f17] border border-red-500/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-950/20 text-red-500 border border-red-500/10 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-sm font-bold text-white font-sans">Reset Your Workspace?</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                This will delete all daily habits, streaks, weekly goals, focus history, custom plans, and verified submission proofs. This action is permanent.
              </p>
            </div>
            <div className="flex gap-3 pt-2 font-sans">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetWorkspace}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" id="edit-profile-modal">
          <div className="bg-[#0b0f17] border border-slate-800/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left">
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Edit Profile</h3>
              <p className="text-slate-500 text-[10px] mt-0.5">Customize your local workspace experience.</p>
            </div>
            
            <div className="space-y-3 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={30}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main Workspace Purpose</label>
                <select 
                  value={editPurpose}
                  onChange={(e) => setEditPurpose(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer animate-fade-in"
                >
                  <option value="study">Study / Academic Projects</option>
                  <option value="work">Work / Enterprise Deliveries</option>
                  <option value="freelance">Freelance / Client Engagements</option>
                  <option value="personal">Personal Goals / Side Projects</option>
                  <option value="mixed">A bit of everything</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2 font-sans">
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const trimmed = editName.trim();
                  if (trimmed.length < 2) {
                    alert("Name must be at least 2 characters.");
                    return;
                  }
                  onUpdateProfile({ name: trimmed, purpose: editPurpose as any });
                  setShowEditProfileModal(false);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-xl transition-colors cursor-pointer"
                id="save-profile-btn"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
