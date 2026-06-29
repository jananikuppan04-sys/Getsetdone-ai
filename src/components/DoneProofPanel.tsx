import React, { useState } from 'react';
import { DoneProof } from '../types';
import { 
  Link, 
  Github, 
  FileSpreadsheet, 
  ExternalLink, 
  Image, 
  FileText, 
  CheckCircle2, 
  X, 
  Upload, 
  AlertCircle,
  FileUp,
  Sparkles
} from 'lucide-react';

interface DoneProofPanelProps {
  proofs: DoneProof[];
  onUpdateProof: (proofId: string, value: string, fileName?: string, status?: DoneProof['status']) => void;
  onMarkComplete?: (proofId: string, completed: boolean) => void;
}

const ProofTypeIcons: Record<string, React.ComponentType<any>> = {
  url: Link,
  github: Github,
  'google-doc': FileSpreadsheet,
  deployment: ExternalLink,
  image: Image,
  pdf: FileText,
  note: FileText,
};

export const DoneProofPanel: React.FC<DoneProofPanelProps> = ({ proofs, onUpdateProof, onMarkComplete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStartEdit = (proof: DoneProof) => {
    setEditingId(proof.id);
    setInputValue(proof.value);
    setFileName(proof.fileName || '');
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setInputValue('');
    setFileName('');
    setError(null);
  };

  const validateProof = (proof: DoneProof, value: string): { isValid: boolean; status: DoneProof['status'] } => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { isValid: false, status: 'missing' };
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

    if (proof.type === 'github') {
      const isUrl = urlPattern.test(trimmed);
      const isGithub = trimmed.toLowerCase().includes('github.com');
      if (!isUrl || !isGithub) {
        setError('Please enter a valid GitHub repository URL.');
        return { isValid: false, status: 'missing' };
      }
      return { isValid: true, status: 'format-verified' };
    }

    if (proof.type === 'google-doc') {
      const isUrl = urlPattern.test(trimmed);
      const isGoogleDocs = trimmed.toLowerCase().includes('docs.google.com') || trimmed.toLowerCase().includes('github.com') || urlPattern.test(trimmed);
      if (!isUrl) {
        setError('Please enter a valid documentation link.');
        return { isValid: false, status: 'missing' };
      }
      return { isValid: true, status: 'format-verified' };
    }

    if (proof.type === 'deployment') {
      const isUrl = urlPattern.test(trimmed);
      if (!isUrl) {
        setError('Please enter a valid deployment URL.');
        return { isValid: false, status: 'missing' };
      }
      return { isValid: true, status: 'format-verified' };
    }

    if (proof.type === 'url') {
      const isUrl = urlPattern.test(trimmed);
      if (!isUrl) {
        setError('Please enter a valid URL.');
        return { isValid: false, status: 'missing' };
      }
      return { isValid: true, status: 'format-verified' };
    }

    return { isValid: true, status: 'added' };
  };

  const handleSaveProof = (proof: DoneProof) => {
    const { isValid, status } = validateProof(proof, inputValue);
    if (!isValid) return;

    onUpdateProof(proof.id, inputValue, fileName, status);
    setEditingId(null);
    setError(null);
  };

  const handleFileUpload = (proof: DoneProof, e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size allowed is 10MB.');
      return;
    }

    const mime = file.type || '';
    if (proof.type === 'image' && !mime.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    if (proof.type === 'pdf' && mime !== 'application/pdf') {
      setError('Please upload a valid PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateProof(proof.id, reader.result as string, file.name, 'complete');
      setEditingId(null);
    };
    reader.readAsDataURL(file);
  };

  const getStatusLabel = (status: DoneProof['status']) => {
    switch (status) {
      case 'added': return 'Added';
      case 'format-verified': return 'Verified';
      case 'complete': return 'Done';
      case 'missing': default: return 'Awaiting';
    }
  };

  const getStatusColor = (status: DoneProof['status']) => {
    switch (status) {
      case 'complete': return 'text-emerald-400 bg-emerald-950/10 border-emerald-500/10';
      case 'format-verified': return 'text-sky-400 bg-sky-950/10 border-sky-500/10';
      case 'added': return 'text-indigo-400 bg-indigo-950/10 border-indigo-500/10';
      case 'missing': default: return 'text-amber-500 bg-amber-950/10 border-amber-500/5';
    }
  };

  const getProofTitle = (taskId: string) => {
    switch (taskId) {
      case 'proof-deployment': return 'Production Link';
      case 'proof-github': return 'GitHub Repo';
      case 'proof-readme': return 'README Doc';
      case 'proof-description': return 'Project Pitch';
      case 'proof-demo': return 'Demo Video/Screen';
      case 'proof-confirm': return 'Final Sign-Off';
      default: return taskId;
    }
  };

  return (
    <div className="bg-[#0b0f17] border border-slate-850 rounded-xl p-5 space-y-4 shadow-sm" id="doneproof-root">
      
      {/* Mini Title */}
      <div className="border-b border-slate-900 pb-2.5">
        <h3 className="text-xs font-bold text-white tracking-wide uppercase">DoneProof Workspace</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Attach link or file evidence to clear gates.</p>
      </div>

      {/* Proof list */}
      <div className="space-y-2.5">
        {proofs.map((proof) => {
          const Icon = ProofTypeIcons[proof.type] || FileText;
          const isEditing = editingId === proof.id;
          const statusColor = getStatusColor(proof.status);
          const isFilePlaceholder = proof.type === 'image' || proof.type === 'pdf';

          return (
            <div 
              key={proof.id} 
              className={`border rounded-lg p-3 transition-all ${
                proof.status === 'complete' || proof.status === 'format-verified'
                  ? 'bg-emerald-950/5 border-emerald-500/10' 
                  : 'bg-slate-950/40 border-slate-900 hover:border-slate-850'
              }`}
              id={`proof-card-${proof.id}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-1.5 rounded ${statusColor} border shrink-0`}>
                    <Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{getProofTitle(proof.id)}</h4>
                    <p className="text-[9px] text-slate-500 font-medium">
                      Type: {proof.type === 'google-doc' ? 'Google Doc' : proof.type}
                    </p>
                  </div>
                </div>
                
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border shrink-0 ${statusColor}`}>
                  {getStatusLabel(proof.status)}
                </span>
              </div>

              {/* Editing block */}
              {isEditing ? (
                <div className="mt-2.5 pt-2.5 border-t border-slate-900 space-y-2.5 animate-fade-in">
                  {error && (
                    <div className="bg-red-950/20 border border-red-500/15 text-red-400 p-2 rounded text-[10px] flex gap-1.5 items-center">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {isFilePlaceholder ? (
                    <div className="flex items-center justify-center border border-dashed border-slate-800 rounded-lg p-3 bg-slate-950">
                      <label className="flex flex-col items-center gap-1 cursor-pointer text-[10px] text-slate-400 hover:text-white transition-colors">
                        <FileUp size={16} className="text-indigo-400" />
                        <span className="font-semibold">Upload {proof.type.toUpperCase()} file (Max 10MB)</span>
                        <input 
                          type="file" 
                          accept={proof.type === 'image' ? 'image/*' : 'application/pdf'} 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(proof, e)}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Paste verified link URL here"
                        className="flex-1 bg-slate-950 border border-slate-850 focus:border-indigo-500/60 rounded px-2.5 py-1.5 text-[11px] text-slate-200 outline-none placeholder-slate-600 font-mono"
                      />
                      <button 
                        onClick={() => handleSaveProof(proof)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3.5 rounded transition-colors cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 text-[10px]">
                    <button 
                      onClick={handleCancelEdit}
                      className="text-slate-500 hover:text-slate-300 px-1 py-0.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  {proof.value ? (
                    <div className="flex items-center justify-between bg-slate-950/80 border border-slate-900 rounded p-2 text-[11px]">
                      <div className="truncate pr-2 min-w-0">
                        {proof.fileName ? (
                          <p className="text-emerald-400 font-semibold truncate flex items-center gap-1">
                            <CheckCircle2 size={11} className="shrink-0" />
                            {proof.fileName}
                          </p>
                        ) : (
                          <a 
                            href={proof.value.startsWith('http') ? proof.value : `https://${proof.value}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 hover:underline truncate flex items-center gap-1 font-mono text-[10px]"
                          >
                            <ExternalLink size={10} className="shrink-0" />
                            {proof.value}
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {onMarkComplete && (
                          <button
                            onClick={() => onMarkComplete(proof.id, proof.status !== 'complete')}
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider transition-colors ${
                              proof.status === 'complete'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {proof.status === 'complete' ? 'Done' : 'Mark'}
                          </button>
                        )}
                        <button 
                          onClick={() => handleStartEdit(proof)}
                          className="text-slate-500 hover:text-slate-300 text-[10px] px-1 hover:bg-slate-900 rounded transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleStartEdit(proof)}
                      className="w-full py-1.5 border border-dashed border-slate-850 hover:border-slate-800 bg-slate-950/10 hover:bg-slate-950/40 text-slate-500 hover:text-slate-300 transition-colors text-[10px] font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={11} />
                      Attach verified proof link
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
