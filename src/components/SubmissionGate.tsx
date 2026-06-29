import React, { useState } from 'react';
import { Lock, Unlock, CheckCircle2, AlertTriangle, Globe, Github, Sparkles } from 'lucide-react';
import { DoneProof } from '../types';

interface SubmissionGateProps {
  score: number;
  isLocked: boolean;
  lockReasons: string[];
  proofs: DoneProof[];
  onSubmitRelease?: () => void;
}

export const SubmissionGate: React.FC<SubmissionGateProps> = ({ score, isLocked, lockReasons, proofs, onSubmitRelease }) => {
  const [submitted, setSubmitted] = useState(false);

  const getProofValue = (id: string) => {
    const p = proofs.find(proof => proof.id === id);
    return p && p.value ? p.value : null;
  };

  const handleTriggerSubmit = () => {
    if (onSubmitRelease) {
      onSubmitRelease();
    }
    setSubmitted(true);
  };

  return (
    <div className={`bg-[#0b0f17] border rounded-xl p-5 shadow-sm transition-all ${
      isLocked 
        ? 'border-slate-850' 
        : 'border-emerald-500/25 bg-[#0b0f17]/80'
    }`} id="submission-gate-root">
      
      {/* Title */}
      <div className="border-b border-slate-900 pb-2.5 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">Submission Checklist</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Automated release clearance criteria.</p>
        </div>
        <div className={`p-1.5 rounded-lg border ${
          isLocked 
            ? 'bg-slate-950 border-slate-900 text-slate-500' 
            : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20'
        }`}>
          {isLocked ? <Lock size={13} /> : <Unlock size={13} className="animate-pulse" />}
        </div>
      </div>

      {isLocked ? (
        <div className="space-y-3 pt-3 animate-fade-in" id="submission-gate-locked">
          <div className="flex gap-2.5 bg-rose-950/10 border border-rose-500/15 p-3 rounded-lg text-rose-400">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider">Checklist Pending</h4>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Readiness: <span className="text-white font-mono font-bold">{score}%</span>. Satisfy the outstanding criteria below to unlock submission package assets.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Remaining Requirements:</h5>
            {lockReasons.map((reason, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-slate-950 border border-slate-900 p-2.5 rounded-lg text-[11px] text-slate-400 leading-normal">
                <span className="text-red-400 font-bold shrink-0 select-none">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-3 animate-fade-in" id="submission-gate-unlocked">
          {submitted ? (
            <div className="space-y-3 text-center py-4 bg-[#070b12]/60 border border-emerald-500/10 rounded-lg p-4 animate-fade-in">
              <div className="mx-auto h-9 w-9 rounded-full bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Submission Logged</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Your certified package has been validated, frozen, and compiled with active DoneProof indicators.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2.5 bg-emerald-950/10 border border-emerald-500/15 p-3 rounded-lg text-emerald-400">
                <Sparkles size={13} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">Clearance Status: Ready</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Readiness score is <span className="text-emerald-400 font-bold">{score}%</span>. Core requirements, uploaded file proofs, and system safety checks have been cleared.
                  </p>
                </div>
              </div>

              {/* Verified Links Package block */}
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 space-y-2 text-[11px]">
                <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5">Bundle Manifest</h5>
                
                <div className="space-y-2">
                  {/* Deployment */}
                  {getProofValue('proof-deployment') && (
                    <div className="flex items-center justify-between gap-2 text-slate-300">
                      <span className="flex items-center gap-1 shrink-0"><Globe size={11} className="text-indigo-400" /> Live deployment:</span>
                      <a href={getProofValue('proof-deployment') || '#'} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-mono text-[10px] hover:underline truncate max-w-[150px]">
                        {getProofValue('proof-deployment')}
                      </a>
                    </div>
                  )}

                  {/* GitHub Repo */}
                  {getProofValue('proof-github') && (
                    <div className="flex items-center justify-between gap-2 text-slate-300">
                      <span className="flex items-center gap-1 shrink-0"><Github size={11} className="text-indigo-400" /> Repository code:</span>
                      <a href={getProofValue('proof-github') || '#'} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-mono text-[10px] hover:underline truncate max-w-[150px]">
                        {getProofValue('proof-github')}
                      </a>
                    </div>
                  )}

                  {/* README Check */}
                  {getProofValue('proof-readme') && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1 shrink-0"><CheckCircle2 size={11} className="text-emerald-400" /> README file:</span>
                      <span className="text-slate-400 font-medium text-[10px]">Verified Attachment</span>
                    </div>
                  )}

                  {/* Description Check */}
                  {getProofValue('proof-description') && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1 shrink-0"><CheckCircle2 size={11} className="text-emerald-400" /> Project overview:</span>
                      <span className="text-slate-400 font-medium text-[10px]">Verified Attachment</span>
                    </div>
                  )}

                  {/* Demo Attachment */}
                  {getProofValue('proof-demo') && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1 shrink-0"><CheckCircle2 size={11} className="text-emerald-400" /> Screenshots:</span>
                      <span className="text-slate-400 font-medium text-[10px]">Verified Attachment</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit trigger button */}
              <button
                onClick={handleTriggerSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Unlock size={12} />
                Compile Submission Bundle
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
