export interface Task {
  id: string;
  action: string;
  timeEstimate: string; // e.g., "45 mins", "1 hr"
  timeMinutes: number;   // estimated time in minutes for sequencing
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  urgency: 'Immediate' | 'High' | 'Normal' | 'Low';
  reason: string;
  dependency: string | null;
  completed: boolean;
}

export interface RealityCheck {
  riskScore: number; // 0 to 100
  riskLevel: 'High' | 'Medium' | 'Low';
  timeRemainingText: string;
  isRealistic: boolean;
  realisticReasoning: string;
  missingDeliverables: string[];
}

export interface AnalysisResult {
  id: string;
  title: string;
  deadlineText: string;
  createdAt: string;
  rawInput: string;
  isRescueMode?: boolean;
  realityCheck: RealityCheck;
  fullWinPath: Task[];
  safeSubmitPath: Task[];
  recoveryPath: Task[];
  requirements: {
    id: string;
    requirement: string;
    completed: boolean;
  }[];
}

export type EnergyLevel = 'Low' | 'Medium' | 'High';

export type AgentLedgerEntry = {
  id: string;
  order: number;
  title: string;
  summary: string;
  status: "complete" | "high-risk" | "blocker" | "optimized" | "recommended" | "ready" | "progress";
  icon: string;
  timestamp?: string;
  details?: string[];
  source?: "gemini" | "rescue-mode" | "user-action";
};

export type DoneProof = {
  id: string;
  taskId: string;
  type: "url" | "github" | "google-doc" | "deployment" | "image" | "pdf" | "note";
  value: string;
  fileName?: string;
  status: "missing" | "added" | "format-verified" | "complete";
  updatedAt: string;
};

export type LocalUserProfile = {
  name: string;
  purpose?: "study" | "work" | "freelance" | "personal" | "mixed";
  createdAt: string;
  updatedAt: string;
  hasCompletedOnboarding: boolean;
};


