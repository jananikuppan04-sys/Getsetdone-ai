import { AnalysisResult } from './types';

export const hackathonDemoData: AnalysisResult = {
  id: 'hackathon-demo',
  title: 'Hackathon Submission Recovery',
  deadlineText: 'Today at 11:59 PM (4 hours left)',
  createdAt: new Date().toISOString(),
  rawInput: 'Hackathon submission is due today at 11:59 PM. I have 4 hours left. My UI is incomplete, authentication is broken, and I still need a deployed link, GitHub README, project description, and final checklist.',
  realityCheck: {
    riskScore: 95,
    riskLevel: 'High',
    timeRemainingText: '4 Hours Remaining',
    isRealistic: false,
    realisticReasoning: 'Full Win path is highly unrealistic. Attempting to fix broken authentication AND polish an incomplete UI in 4 hours leaves zero time for deployment, README drafting, and checklist verification. If you attempt this, you are 95% likely to miss submission completely.',
    missingDeliverables: [
      'Working authentication system (currently broken)',
      'Polished application UI (currently incomplete)',
      'Deployed live application link',
      'Compelling GitHub README description',
      'Concise project pitch description',
      'Completed submission checklist'
    ]
  },
  fullWinPath: [
    {
      id: 'fw-1',
      action: 'Debug database connection and rewrite authentication middleware',
      timeEstimate: '2 hrs',
      timeMinutes: 120,
      impact: 'Critical',
      urgency: 'Immediate',
      reason: 'Necessary to make the sign-in and signup screens functional.',
      dependency: 'None',
      completed: false
    },
    {
      id: 'fw-2',
      action: 'Build out missing screens and connect frontend pages to API routes',
      timeEstimate: '1.5 hrs',
      timeMinutes: 90,
      impact: 'High',
      urgency: 'High',
      reason: 'Judges need to see all views completed to score the UI portion fully.',
      dependency: 'fw-1',
      completed: false
    },
    {
      id: 'fw-3',
      action: 'Deploy database, server, and frontend to Cloud Run / Vercel',
      timeEstimate: '45 mins',
      timeMinutes: 45,
      impact: 'Critical',
      urgency: 'High',
      reason: 'Required to get a live URL for the submission form.',
      dependency: 'fw-2',
      completed: false
    },
    {
      id: 'fw-4',
      action: 'Write detailed GitHub README file with setup instructions and screenshots',
      timeEstimate: '30 mins',
      timeMinutes: 30,
      impact: 'High',
      urgency: 'Normal',
      reason: 'Helps judges install, understand, and review the project repository.',
      dependency: 'fw-3',
      completed: false
    },
    {
      id: 'fw-5',
      action: 'Fill out Devpost submission form and checklist',
      timeEstimate: '15 mins',
      timeMinutes: 15,
      impact: 'Critical',
      urgency: 'Immediate',
      reason: 'The actual submission action to lock in your work.',
      dependency: 'fw-4',
      completed: false
    }
  ],
  safeSubmitPath: [
    {
      id: 'ss-1',
      action: 'Bypass Auth: Implement a dummy user session directly in Local Storage',
      timeEstimate: '20 mins',
      timeMinutes: 20,
      impact: 'Critical',
      urgency: 'Immediate',
      reason: 'Authentication is a massive time-sink. Removing it frees up 1.5+ hours. Judges can click "Login" and get immediate access without setup.',
      dependency: null,
      completed: false
    },
    {
      id: 'ss-2',
      action: 'Polish ONE stellar core user flow & mock / lock secondary pages',
      timeEstimate: '60 mins',
      timeMinutes: 60,
      impact: 'High',
      urgency: 'Immediate',
      reason: 'A flawless, elegant single flow is 10x better than 5 broken pages. Put a "Coming Soon" or modal overlay on secondary links.',
      dependency: 'ss-1',
      completed: false
    },
    {
      id: 'ss-3',
      action: 'Deploy static frontend (Vercel/Netlify) using pre-packaged mock server data',
      timeEstimate: '20 mins',
      timeMinutes: 20,
      impact: 'Critical',
      urgency: 'High',
      reason: 'Extremely fast. Static deployment takes under 5 minutes and is immune to server crashes during judge scaling.',
      dependency: 'ss-2',
      completed: false
    },
    {
      id: 'ss-4',
      action: 'Write a high-impact GitHub README and project pitch description',
      timeEstimate: '45 mins',
      timeMinutes: 45,
      impact: 'High',
      urgency: 'High',
      reason: 'When the app is simplified, marketing is key. Explain your pivot, include high-fidelity visual walk-throughs, and record a 2-minute Loom video.',
      dependency: 'ss-3',
      completed: false
    },
    {
      id: 'ss-5',
      action: 'Lock in Devpost form submission and final checklists early',
      timeEstimate: '15 mins',
      timeMinutes: 15,
      impact: 'Critical',
      urgency: 'Immediate',
      reason: 'Submitting 30 minutes before 11:59 PM bypasses platform congestion crashes.',
      dependency: 'ss-4',
      completed: false
    }
  ],
  recoveryPath: [
    {
      id: 'rec-1',
      action: 'Deployment Failure: Fallback to screen recording & upload to YouTube/Loom',
      timeEstimate: '20 mins',
      timeMinutes: 20,
      impact: 'Critical',
      urgency: 'High',
      reason: 'If deployment is bricked at 11:45 PM, a Loom walk-through proves your code actually runs on localhost.',
      dependency: null,
      completed: false
    },
    {
      id: 'rec-2',
      action: 'Vercel/Hosting Down: Push static files to GitHub Pages as backup',
      timeEstimate: '15 mins',
      timeMinutes: 15,
      impact: 'High',
      urgency: 'High',
      reason: 'An alternate deployment method ensures you have a live link ready.',
      dependency: null,
      completed: false
    },
    {
      id: 'rec-3',
      action: 'Git commit blocks/push limits: Submit zip package of code directly',
      timeEstimate: '10 mins',
      timeMinutes: 10,
      impact: 'High',
      urgency: 'High',
      reason: 'Keeps you from missing the deadline due to networking issues.',
      dependency: null,
      completed: false
    }
  ],
  requirements: [
    { id: 'req-1', requirement: 'Polished core user flow', completed: false },
    { id: 'req-2', requirement: 'Bypassed authentication flow', completed: false },
    { id: 'req-3', requirement: 'Deployed live link', completed: false },
    { id: 'req-4', requirement: 'GitHub README file', completed: false },
    { id: 'req-5', requirement: 'Project description draft', completed: false },
    { id: 'req-6', requirement: 'Final Devpost submission', completed: false }
  ]
};
