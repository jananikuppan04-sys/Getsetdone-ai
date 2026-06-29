import React, { useState, useRef } from 'react';
import { ArrowLeft, Sparkles, Upload, FileText, X, AlertCircle } from 'lucide-react';

interface IntakePageProps {
  onBack: () => void;
  onSubmit: (text: string, file: { base64: string; mimeType: string; name: string } | null) => Promise<void>;
  isLoading: boolean;
  onRescue: (text: string) => void;
}

export const IntakePage: React.FC<IntakePageProps> = ({ onBack, onSubmit, isLoading, onRescue }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRescueError, setShowRescueError] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Simple loading feedback interval
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const steps = [
      'Deconstructing brief and task descriptions...',
      'Assessing reality limits and timeline parameters...',
      'Evaluating deliverables and dependencies...',
      'Calculating mitigation paths and recovery buffers...',
      'Assembling the interactive dashboard...'
    ];
    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(timer);
  }, [isLoading]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size allowed is 10MB.");
      return;
    }

    const mime = selectedFile.type || "";
    const nameLower = selectedFile.name.toLowerCase();
    const isSupported = 
      mime.startsWith('image/') || 
      mime === 'application/pdf' || 
      mime.startsWith('audio/') || 
      mime === 'text/plain' || 
      nameLower.endsWith('.txt') || 
      nameLower.endsWith('.json') || 
      nameLower.endsWith('.md');

    if (!isSupported) {
      setError("This file type is not directly processed for smart text extraction. However, you can proceed by entering your project specifications inside the crisis description text area.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFile({
          base64: e.target.result as string,
          mimeType: selectedFile.type || "application/octet-stream",
          name: selectedFile.name
        });
        setError(null);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !file) {
      setError("Please describe your deadline crisis or attach a project file to analyze.");
      return;
    }
    setError(null);
    setShowRescueError(false);
    try {
      await onSubmit(text, file);
    } catch (err: any) {
      setShowRescueError(true);
    }
  };

  const handleTriggerRescuePlan = () => {
    onRescue(text);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 10000) {
      setText(val);
    }
  };

  const loadPreset = (presetText: string) => {
    setText(presetText);
    setError(null);
    setShowRescueError(false);
  };

  const stepsText = [
    'Deconstructing brief and task descriptions...',
    'Assessing reality limits and timeline parameters...',
    'Evaluating deliverables and dependencies...',
    'Calculating mitigation paths and recovery buffers...',
    'Assembling the interactive dashboard...'
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto space-y-6 py-12 animate-fade-in" id="intake-loading">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-slate-900 border-t-indigo-500 animate-spin"></div>
          <Sparkles className="absolute text-indigo-400 animate-pulse" size={24} />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white tracking-tight">AI Strategist Working</h2>
          <p className="text-slate-400 text-xs italic min-h-[18px]">
            "{stepsText[loadingStep]}"
          </p>
        </div>
        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-1 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((loadingStep + 1) / stepsText.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal">
          Analyzing constraints, assessing system fail points, and building fallback architectures. This usually takes around 5-10 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in" id="intake-root">
      
      {/* Header and Back navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 text-slate-400 hover:text-white bg-[#0b0f17] border border-slate-800/80 rounded-lg transition-colors cursor-pointer"
          title="Back"
          id="intake-back-btn"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">PanicDrop Intake</h1>
          <p className="text-xs text-slate-400">Provide the project brief, deadlines, and active blockers.</p>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main form section */}
        <div className="lg:col-span-8">
          <form onSubmit={(e) => handleFormSubmit(e)} className="bg-[#0b0f17] border border-slate-800/80 p-5 sm:p-6 rounded-xl space-y-5 shadow-sm">
            
            {/* Premium Error UI */}
            {showRescueError ? (
              <div className="bg-slate-900 border border-indigo-500/20 p-4 rounded-xl space-y-3 animate-fade-in" id="intake-error-premium">
                <div className="flex gap-3 items-start">
                  <div className="p-1.5 bg-indigo-950 text-indigo-400 rounded-md shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">Temporary model capacity overflow.</h3>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      We have compiled a fallback strategy matching typical high-risk scenarios to keep your session moving.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFormSubmit()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Retry Analysis
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerRescuePlan}
                    className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Load Offline Plan
                  </button>
                </div>
              </div>
            ) : error ? (
              <div className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl flex gap-3 text-xs animate-fade-in" id="intake-error">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Analysis Notice</p>
                  <p className="text-slate-300 mt-0.5 leading-normal">{error}</p>
                </div>
              </div>
            ) : null}

            {/* Description Area */}
            <div className="space-y-1.5">
              <label htmlFor="panic-text" className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Project Specifications / Current Failures
              </label>
              <textarea
                id="panic-text"
                className="w-full h-44 bg-slate-950 border border-slate-850 rounded-lg p-3 text-slate-200 placeholder-slate-500 text-xs focus:border-indigo-500/80 outline-none transition-all resize-y leading-relaxed font-sans"
                placeholder="E.g., Presentation due tomorrow morning. Unresolved bugs in payment checkout. Need custom database schemas but time runs short. Help me generate an MVP."
                value={text}
                onChange={handleTextChange}
              />
              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                <span>Explicitly state dependencies for smart ordering.</span>
                <span className={text.length >= 9000 ? 'text-amber-500 font-semibold' : ''}>
                  {text.length.toLocaleString()} / 10,000 characters
                </span>
              </div>
            </div>

            {/* Drag & Drop Attachments */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Supporting Files <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-950/10' 
                    : file 
                      ? 'border-emerald-500/40 bg-emerald-950/5' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-950'
                }`}
                id="intake-dropzone"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,audio/*,text/plain"
                  className="hidden"
                />

                {file ? (
                  <div className="flex items-center justify-between bg-[#0b0f17] p-2.5 rounded-lg border border-emerald-500/20 max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2 text-left min-w-0">
                      <div className="p-1.5 bg-emerald-950 text-emerald-400 rounded">
                        <FileText size={14} />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{file.mimeType}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto h-6 w-6 text-slate-500 flex items-center justify-center">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-300">Drag & drop files here, or <span className="text-indigo-400">browse</span></p>
                      <p className="text-[10px] text-slate-500">Supports images, requirements docs, PDFs, txt logs (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              id="intake-submit-btn"
            >
              <Sparkles size={14} className="fill-white/10" />
              Generate Recovery Architecture
            </button>
          </form>
        </div>

        {/* Sidebar Scenario presets */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0b0f17] border border-slate-800/80 p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Select Template Scenario</h3>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => loadPreset("I need to submit my client pitch deck tomorrow morning. I haven't done competitor research, the budget calculations are unverified, and I need a high-fidelity mock-up. Only 12 hours left.")}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg transition-colors text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <p className="font-bold text-slate-300 mb-0.5">Freelancer: Client Pitch Deck</p>
                <p className="line-clamp-1 text-slate-500">"Pitch deck tomorrow. Missing mockups and budget calculations. 12h."</p>
              </button>

              <button
                type="button"
                onClick={() => loadPreset("Our team needs to push a public beta launch by Monday. We have database locks, API responses are super slow, payment integration throws 500 errors occasionally, and we don't have user onboarding guidelines written.")}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg transition-colors text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <p className="font-bold text-slate-300 mb-0.5">Startup Team: Public Beta Launch</p>
                <p className="line-clamp-1 text-slate-500">"Beta launch Monday. slow APIs, occasional checkout failures, missing guides."</p>
              </button>

              <button
                type="button"
                onClick={() => loadPreset("My final college paper is due in 6 hours. The outline is mostly done but I still need to format 10 academic citations, write a solid thesis statement and conclusion, and proofread for grammatical flow.")}
                className="w-full text-left p-3 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-lg transition-colors text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <p className="font-bold text-slate-300 mb-0.5">Academic: Citation Backlog</p>
                <p className="line-clamp-1 text-slate-500">"Thesis paper due in 6h. Backlog of academic citations, proofreading."</p>
              </button>
            </div>
          </div>

          <div className="bg-[#0b0f17] border border-slate-850 p-5 rounded-xl text-xs text-slate-400 space-y-2">
            <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-amber-500 shrink-0" />
              Strategic Safe-Submit Protocol
            </h4>
            <p className="leading-relaxed text-[11px]">
              Instead of forcing unrealistic checklists, our system models dynamic recovery pathways. It targets immediate, highly-stable MVP releases while safeguarding your remaining time budget.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
