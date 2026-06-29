import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { LogoIcon } from './Logo';

interface WelcomeOnboardingProps {
  onComplete: (name: string, purpose: "study" | "work" | "freelance" | "personal" | "mixed") => void;
  storageWarning?: boolean;
}

export const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({ onComplete, storageWarning = false }) => {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState<"study" | "work" | "freelance" | "personal" | "mixed">('mixed');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    // Validation checks:
    // 1. Name is required
    if (!trimmed) {
      setError("Please enter a valid name to continue.");
      return;
    }

    // 2. Minimum 2 characters, maximum 30 characters
    if (trimmed.length < 2 || trimmed.length > 30) {
      setError("Please enter a valid name to continue.");
      return;
    }

    // 3. Do not allow only numbers or special characters (must contain at least one alphabet/letter)
    const hasLetters = /[a-zA-Z\u00C0-\u017F]/.test(trimmed);
    if (!hasLetters) {
      setError("Please enter a valid name to continue.");
      return;
    }

    // Success! Clear error and call onComplete
    setError(null);
    onComplete(trimmed, purpose);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 flex flex-col items-center justify-center p-4 relative font-sans overflow-hidden" id="onboarding-root">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-indigo-950/20 via-transparent to-transparent pointer-events-none rounded-full"></div>

      <div className="max-w-md w-full space-y-8 bg-[#0b0f17] border border-slate-900 rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl shadow-black/80">
        
        {/* Logo and Greeting Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-1">
            <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl shadow-lg shadow-indigo-500/5">
              <LogoIcon size={44} />
            </div>
          </div>
          
          <span className="inline-flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/15 px-2.5 py-1 rounded-full text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={11} className="text-indigo-400 fill-indigo-500/20 shrink-0" />
            Welcome to GetSetDone
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Let’s make your next move count.
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Tell us your name to personalize your plans, habits, and deadline recovery workspace.
          </p>
        </div>

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input 1: Name */}
          <div className="space-y-2 text-left">
            <label htmlFor="user-name" className="text-xs font-bold text-slate-300">
              What should we call you? <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              id="user-name"
              placeholder="Enter your first name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full bg-slate-950 border ${
                error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-850 focus:border-indigo-500/70'
              } text-slate-200 text-xs rounded-xl px-4 py-3 outline-none transition-colors placeholder:text-slate-600 font-medium`}
              autoFocus
            />
            {error && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 animate-pulse" id="name-validation-error">
                <ShieldAlert size={12} />
                {error}
              </p>
            )}
          </div>

          {/* Input 2: Purpose */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-slate-300">
              What are you mainly using GetSetDone for?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'study', label: 'Study' },
                { value: 'work', label: 'Work' },
                { value: 'freelance', label: 'Freelance' },
                { value: 'personal', label: 'Personal goals' },
                { value: 'mixed', label: 'A bit of everything' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPurpose(opt.value as any)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    purpose === opt.value
                      ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/40 shadow-sm shadow-indigo-500/5'
                      : 'bg-slate-950/60 hover:bg-slate-950 text-slate-400 border-slate-900 hover:border-slate-850'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Storage Alert Warning */}
          {storageWarning && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/15 rounded-xl flex gap-2.5 text-[11px] text-amber-300">
              <ShieldAlert size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">Your profile may not be saved in this browser because LocalStorage is full or unavailable.</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-2 group"
            id="onboarding-submit-btn"
          >
            Start My Workspace
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-600">
            No internet connection required. All your data stays secure inside this browser.
          </p>
        </div>
      </div>
    </div>
  );
};
