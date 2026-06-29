import { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, X, ShieldAlert } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { IntakePage } from './components/IntakePage';
import { RealityCheckPage } from './components/RealityCheckPage';
import { Dashboard } from './components/Dashboard';
import { WelcomeOnboarding } from './components/WelcomeOnboarding';
import { AnalysisResult, LocalUserProfile } from './types';
import { generateRescueWorkbookClient, generateNeutralTemplate } from './utils';
import { getLocalData, saveLocalData, clearLocalData, AnalysisResultSchema, LocalUserProfileSchema } from './utils/storage';
import { LogoWithWordmark } from './components/Logo';
import { z } from 'zod';

type ViewState = 'landing' | 'intake' | 'reality' | 'dashboard';

const defaultDailyWorkbook: AnalysisResult = {
  id: "daily-workspace",
  title: "Personal Daily Workspace",
  deadlineText: "Daily Mode Active",
  createdAt: new Date().toISOString(),
  rawInput: "Daily task tracking and habits stabilization.",
  isRescueMode: false,
  realityCheck: {
    riskScore: 0,
    riskLevel: "Low",
    timeRemainingText: "No deadline active",
    isRealistic: true,
    realisticReasoning: "You are tracking your daily focus list. Keep building consistency!",
    missingDeliverables: []
  },
  fullWinPath: [],
  safeSubmitPath: [],
  recoveryPath: [],
  requirements: []
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [resetWarning, setResetWarning] = useState<boolean>(false);
  const [storageWarning, setStorageWarning] = useState<boolean>(false);

  // Initialize user profile
  const [userProfile, setUserProfile] = useState<LocalUserProfile | null>(() => {
    try {
      const raw = localStorage.getItem('getsetdone:user-profile');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const result = LocalUserProfileSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
    } catch (e) {
      console.error("Failed to parse user profile from localStorage", e);
    }
    return null;
  });

  // Check if localStorage is writable on load
  useEffect(() => {
    try {
      const testKey = '__getsetdone_test_storage_key__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      setStorageWarning(false);
    } catch (e) {
      setStorageWarning(true);
    }
  }, []);

  // Initialize view and active workbook on load from local storage
  useEffect(() => {
    // Listen for storage quota exhaustion errors
    const handleStorageError = (e: any) => {
      alert(e.detail?.message || "Storage error: could not write changes to browser database.");
    };
    window.addEventListener('getsetdone_storage_error', handleStorageError);

    // Sync across browser tabs
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'getsetdone_active_analysis') {
        if (e.newValue) {
          try {
            setActiveAnalysis(JSON.parse(e.newValue));
          } catch (err) {}
        } else {
          setActiveAnalysis(null);
        }
      }
      if (e.key === 'getsetdone_current_view') {
        if (e.newValue) {
          setCurrentView(e.newValue as any);
        }
      }
      if (e.key === 'getsetdone:user-profile') {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            const result = LocalUserProfileSchema.safeParse(parsed);
            if (result.success) {
              setUserProfile(result.data);
            } else {
              setUserProfile(null);
            }
          } catch (err) {}
        } else {
          setUserProfile(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageSync);


    // Safe schema-validated localStorage retrieve
    const { data: savedAnalysis, resetOccurred: analysisReset } = getLocalData(
      'getsetdone_active_analysis',
      AnalysisResultSchema,
      null
    );

    const { data: savedView } = getLocalData(
      'getsetdone_current_view',
      z.string(),
      'landing'
    );

    if (analysisReset) {
      setResetWarning(true);
    }

    if (savedAnalysis) {
      setActiveAnalysis(savedAnalysis);
      setCurrentView(savedView as ViewState);
    } else {
      setCurrentView('landing');
    }

    return () => {
      window.removeEventListener('getsetdone_storage_error', handleStorageError);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  // Save changes to local storage on workbook change
  const saveAnalysis = (analysis: AnalysisResult | null, view?: ViewState) => {
    setActiveAnalysis(analysis);
    if (analysis) {
      saveLocalData('getsetdone_active_analysis', analysis);
    } else {
      clearLocalData('getsetdone_active_analysis');
    }
    
    if (view) {
      setCurrentView(view);
      saveLocalData('getsetdone_current_view', view);
    }
  };

  const navigateTo = (view: ViewState) => {
    setCurrentView(view);
    saveLocalData('getsetdone_current_view', view);
  };

  // Intake submit handler calling our back-end API
  const handleIntakeSubmit = async (
    text: string, 
    file: { base64: string; mimeType: string; name: string } | null
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-deadline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, file }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with code ${response.status}`);
      }

      const parsedResult: AnalysisResult = await response.json();
      saveAnalysis(parsedResult, 'reality');
    } catch (err: any) {
      console.error("Analysis request failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanMyDay = () => {
    // Seed default daily workbook & enter dashboard
    localStorage.setItem('getsetdone_sidebar_tab', 'today');
    saveAnalysis(defaultDailyWorkbook, 'dashboard');
  };

  const handleStartFocus = () => {
    // Seed default daily workbook, navigate to dashboard, start pomodoro immediately via trigger
    localStorage.setItem('getsetdone_sidebar_tab', 'today');
    localStorage.setItem('getsetdone_focus_trigger_immediate', 'true');
    saveAnalysis(defaultDailyWorkbook, 'dashboard');
  };

  const handleSelectTemplate = (templateName: string) => {
    const templateData = generateNeutralTemplate(templateName);
    saveAnalysis(templateData, 'reality');
  };

  const handleClearAll = () => {
    saveAnalysis(null, 'landing');
  };

  const handleLoadRescue = (text: string) => {
    const rescueData = generateRescueWorkbookClient(text);
    saveAnalysis(rescueData, 'reality');
  };

  const handleOnboardingComplete = (name: string, purpose: "study" | "work" | "freelance" | "personal" | "mixed") => {
    const profile: LocalUserProfile = {
      name,
      purpose,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hasCompletedOnboarding: true
    };
    try {
      localStorage.setItem('getsetdone:user-profile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to save user profile", err);
    }
  };

  const handleUpdateProfile = (updated: Partial<LocalUserProfile>) => {
    if (!userProfile) return;
    const newProfile = {
      ...userProfile,
      ...updated,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('getsetdone:user-profile', JSON.stringify(newProfile));
      setUserProfile(newProfile);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleResetWorkspace = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('getsetdone_') || key.startsWith('daily_') || key === 'getsetdone:user-profile')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    setUserProfile(null);
    setActiveAnalysis(null);
    setCurrentView('landing');
  };

  if (!userProfile || !userProfile.hasCompletedOnboarding) {
    return (
      <WelcomeOnboarding 
        onComplete={handleOnboardingComplete} 
        storageWarning={storageWarning}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white relative" id="app-container">
      
      {/* Dynamic corrupted database recovery notice banner */}
      {resetWarning && (
        <div className="bg-amber-950/45 border-b border-amber-500/15 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center gap-2 animate-slide-in">
          <ShieldAlert size={14} className="text-amber-400" />
          <span>We reset an outdated saved plan to keep your workspace working.</span>
          <button 
            onClick={() => setResetWarning(false)}
            className="underline font-bold hover:text-white cursor-pointer ml-1 text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Background radial fade */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-radial from-indigo-950/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Global Header - Hidden or streamlined when inside deep Dashboard views to make room for full sidebar layout */}
      {currentView !== 'dashboard' && (
        <header className="sticky top-0 z-40 bg-[#070b12]/80 backdrop-blur-md border-b border-slate-900/60 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div 
            onClick={handleClearAll}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all select-none"
            id="brand-logo"
          >
            <LogoWithWordmark />
          </div>

          {/* Premium Navbar links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400">
            <button 
              onClick={() => handleSelectTemplate("Client Project")} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Client Template
            </button>
            <button 
              onClick={() => setShowHelpModal(true)} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Helps
            </button>
            {activeAnalysis && (
              <button 
                onClick={() => navigateTo('dashboard')} 
                className="hover:text-white transition-colors cursor-pointer font-medium text-indigo-400 animate-pulse"
              >
                Go to Dashboard
              </button>
            )}
          </nav>

          {/* Actions & Help */}
          <div className="flex items-center gap-3">
            {currentView === 'landing' ? (
              <button
                onClick={() => navigateTo('intake')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-all shadow-sm shadow-indigo-600/10 cursor-pointer"
              >
                Start Rescue Plan
              </button>
            ) : (
              <button
                onClick={handleClearAll}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800 hover:border-slate-700 px-2.5 py-1.5 rounded-lg"
              >
                Home
              </button>
            )}
            
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg transition-all"
              title="Help Center"
              id="help-modal-trigger"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </header>
      )}

      {/* Main Views Container */}
      <main className="flex-grow relative z-10">
        {currentView === 'landing' && (
          <LandingPage 
            userName={userProfile.name}
            onStartNew={() => navigateTo('intake')} 
            onPlanMyDay={handlePlanMyDay}
            onStartFocus={handleStartFocus}
          />
        )}

        {currentView === 'intake' && (
          <IntakePage 
            onBack={() => navigateTo('landing')}
            onSubmit={handleIntakeSubmit}
            isLoading={isLoading}
            onRescue={handleLoadRescue}
          />
        )}

        {currentView === 'reality' && activeAnalysis && (
          <RealityCheckPage 
            data={activeAnalysis}
            onProceed={() => navigateTo('dashboard')}
          />
        )}

        {currentView === 'dashboard' && activeAnalysis && (
          <Dashboard 
            data={activeAnalysis}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onResetWorkspace={handleResetWorkspace}
            onUpdateData={(newData) => saveAnalysis(newData)}
            onBackToIntake={() => navigateTo('intake')}
            onResetDemo={handleClearAll}
          />
        )}
      </main>


      {/* App Footer (Streamlined in Dashboard to avoid double scrolling) */}
      {currentView !== 'dashboard' && (
        <footer className="border-t border-slate-900/40 bg-[#070b12]/40 py-4 px-6 text-center text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>GetSetDone Workspace — Powered by Gemini & Antigravity Agent</p>
          <div className="flex gap-4">
            <button onClick={handleClearAll} className="hover:text-slate-400 cursor-pointer transition-all">Reset All Settings</button>
            <span className="text-slate-800">|</span>
            <p className="font-semibold text-slate-400">Less panic. More progress.</p>
          </div>
        </footer>
      )}

      {/* "How It Helps" Premium React Modal Popover */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" id="help-modal">
          <div className="bg-[#0b0f17] border border-slate-800/80 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative space-y-6">
            <button 
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X size={16} />
            </button>

            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                How GetSetDone Protects Your Deadlines
              </h3>
              <p className="text-slate-400 text-xs mt-1">A real SaaS framework to bypass execution panic.</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-md bg-indigo-950 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Add Your Deadline</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Paste raw specifications, project briefs, or screenshots. Our systems instantly extract deliverables, tasks, and sequence constraints.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-md bg-indigo-950 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Deadline Check</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    We evaluate your timeline mathematically. If the full scope represents extreme failure risk, we warn you upfront.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-md bg-indigo-950 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Best Plan to Finish</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Automatically bypass blocked third-party dependencies, mock unessential routes, and focus strictly on delivering a working core flow.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-6 w-6 rounded-md bg-indigo-950 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Add Proof & Submission Checklist</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Attach live deployment URLs and code repo links. Our automated release checks verify layout and files to unlock submission assets.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900/80 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer"
              >
                Got It, Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
