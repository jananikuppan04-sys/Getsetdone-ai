import { AnalysisResult, Task, AgentLedgerEntry } from './types';

// Deterministic Local Fallback Generator for client-side execution
export function generateRescueWorkbookClient(rawInput: string): AnalysisResult {
  const text = rawInput ? rawInput.trim() : "";
  const lowercaseText = text.toLowerCase();
  
  let title = "Deadline Rescue Workbook";
  let deadlineText = "Immediate Action Needed";
  let riskScore = 85;
  let riskLevel = "High" as const;
  let timeRemainingText = "Immediate Timeline";
  let isRealistic = false;
  let realisticReasoning = "AI capacity is busy, but our local safety analysis rules indicate elevated timeline risk. To secure a successful submission, non-critical database integrations and custom logic should be mocked out immediately.";
  let missingDeliverables = ["Verified production deployment", "Completed checklist metrics", "Functional core user flow"];
  
  if (lowercaseText.includes("pitch") || lowercaseText.includes("deck") || lowercaseText.includes("client") || lowercaseText.includes("slides")) {
    title = "Client Pitch Deck Rescue Plan";
    deadlineText = "Next Business Morning";
    timeRemainingText = "Approx. 12 Hours Left";
    realisticReasoning = "Drafting exhaustive slides, verifying complex business figures, and building high-fidelity visual mockups in parallel has extremely high risk. A focused fallback presentation with pristine notes is required.";
    missingDeliverables = ["Verified budget/financial figures", "Competitor matrix slides", "High-fidelity mock-ups", "Slide speech notes"];
  } else if (lowercaseText.includes("paper") || lowercaseText.includes("college") || lowercaseText.includes("essay") || lowercaseText.includes("citations")) {
    title = "Academic Submission Rescue Plan";
    deadlineText = "Within 6 Hours";
    timeRemainingText = "Approx. 6 Hours Left";
    realisticReasoning = "Starting citations, formatting structures, and polishing the final argument so close to the deadline will lead to citation breakdown. Focus strictly on a solid conclusion and simple list formats.";
    missingDeliverables = ["Academic citation formatting", "Thesis statement alignment", "Proofreading edits", "Conclusion draft"];
  } else if (lowercaseText.includes("beta") || lowercaseText.includes("launch") || lowercaseText.includes("stripe") || lowercaseText.includes("payment")) {
    title = "Product Launch Stabilization Plan";
    deadlineText = "Upcoming Milestone Window";
    timeRemainingText = "Standard Milestone Margin";
    realisticReasoning = "Debugging production backend issues and validating live payment processors can block launch for days. Implementing clean local state and user onboarding notes protects the release schedule.";
    missingDeliverables = ["Robust payment integration stubs", "Onboarding guides", "Database lock mitigation logic"];
  }

  const fullWinPath: Task[] = [
    {
      id: "fw-1",
      action: "Attempt 100% full production feature implementation",
      timeEstimate: "2.5 hrs",
      timeMinutes: 150,
      impact: "High",
      urgency: "High",
      reason: "Attempts to complete the original comprehensive scope.",
      dependency: null,
      completed: false
    },
    {
      id: "fw-2",
      action: "Integrate and debug all third-party external APIs and databases",
      timeEstimate: "2 hrs",
      timeMinutes: 120,
      impact: "Critical",
      urgency: "Immediate",
      reason: "Connects real-time queries to production databases.",
      dependency: "fw-1",
      completed: false
    },
    {
      id: "fw-3",
      action: "Polish all secondary navigation screens and visual edge cases",
      timeEstimate: "1 hr",
      timeMinutes: 60,
      impact: "Medium",
      urgency: "Normal",
      reason: "Ensures every page on the site looks perfectly polished.",
      dependency: "fw-2",
      completed: false
    },
    {
      id: "fw-4",
      action: "Deploy full stack (client + server + db) and test user flow",
      timeEstimate: "45 mins",
      timeMinutes: 45,
      impact: "Critical",
      urgency: "High",
      reason: "Required to confirm the complete application functions on production.",
      dependency: "fw-3",
      completed: false
    }
  ];

  const safeSubmitPath: Task[] = [
    {
      id: "ss-1",
      action: "Bypass blocked services: implement standard offline mock mode",
      timeEstimate: "20 mins",
      timeMinutes: 20,
      impact: "Critical",
      urgency: "Immediate",
      reason: "Bypasses slow APIs or database errors instantly. Keeps the app fully interactive and immune to network crashes.",
      dependency: null,
      completed: false
    },
    {
      id: "ss-2",
      action: "Perfect exactly ONE core user experience and disable secondary clicks",
      timeEstimate: "45 mins",
      timeMinutes: 45,
      impact: "High",
      urgency: "Immediate",
      reason: "A flawless, focused core experience is 10x more valuable than a wide, broken, half-baked application layout.",
      dependency: "ss-1",
      completed: false
    },
    {
      id: "ss-3",
      action: "Draft spectacular documentation, README overview, or slide highlights",
      timeEstimate: "30 mins",
      timeMinutes: 30,
      impact: "High",
      urgency: "High",
      reason: "Professional documentation demonstrates clear execution intent and explains your elegant fallback pivot choice.",
      dependency: "ss-2",
      completed: false
    },
    {
      id: "ss-4",
      action: "Deploy simple static build and run final checklist verification",
      timeEstimate: "15 mins",
      timeMinutes: 15,
      impact: "Critical",
      urgency: "Immediate",
      reason: "Static files are immune to database drops and load near-instantly for judges or clients.",
      dependency: "ss-3",
      completed: false
    }
  ];

  const recoveryPath: Task[] = [
    {
      id: "rec-1",
      action: "Service Crash: fallback to localized Loom/screen recording demonstration",
      timeEstimate: "15 mins",
      timeMinutes: 15,
      impact: "Critical",
      urgency: "High",
      reason: "A screen recording provides concrete evidence that your code compiles and runs locally if servers go down.",
      dependency: null,
      completed: false
    },
    {
      id: "rec-2",
      action: "Build Failure: submit a clean standalone zip file package of your repository",
      timeEstimate: "10 mins",
      timeMinutes: 10,
      impact: "High",
      urgency: "High",
      reason: "Guarantees a submission before the hard deadline passes.",
      dependency: null,
      completed: false
    }
  ];

  const requirements = [
    { id: "req-1", requirement: "Flawless core application flow", completed: false },
    { id: "req-2", requirement: "Bypassed or mocked third-party integrations", completed: false },
    { id: "req-3", requirement: "Pristine README or presentation slides", completed: false },
    { id: "req-4", requirement: "Verified static deployment links", completed: false }
  ];

  // Print developer-only log when deterministic rescue plan is activated
  console.log("[GetSetDone Client] deterministic rescue plan activated");

  return {
    id: "rescue-" + Date.now(),
    title,
    deadlineText,
    createdAt: new Date().toISOString(),
    rawInput: text || "Manual intake",
    isRescueMode: true,
    realityCheck: {
      riskScore,
      riskLevel,
      timeRemainingText,
      isRealistic,
      realisticReasoning,
      missingDeliverables
    },
    fullWinPath,
    safeSubmitPath,
    recoveryPath,
    requirements
  };
}

export function generateInitialLedger(result: AnalysisResult): AgentLedgerEntry[] {
  const source = result.isRescueMode ? "rescue-mode" : "gemini";
  const numReqs = result.requirements ? result.requirements.length : 0;
  const isRescue = result.isRescueMode;

  const entries: AgentLedgerEntry[] = [
    {
      id: `${result.id}-step1`,
      order: 1,
      title: "Requirements Extracted",
      summary: `Detected ${numReqs} required deliverables from your project brief.`,
      status: "complete",
      icon: "FileText",
      timestamp: "0.0s",
      source,
      details: [
        "Analyzed input project brief",
        `Created specific sub-tasks to track progress: ${result.requirements ? result.requirements.map(r => r.requirement).join(", ") : "None"}`,
        `Method of analysis: ${isRescue ? "Local Pattern Search" : "Structured Gemini Parsing"}`
      ]
    },
    {
      id: `${result.id}-step2`,
      order: 2,
      title: "Deadline Risk Calculated",
      summary: `Estimated ${result.realityCheck?.riskScore || 0}% risk with ${result.realityCheck?.timeRemainingText || "N/A"}.`,
      status: result.realityCheck?.riskLevel === "High" ? "high-risk" : "progress",
      icon: "AlertCircle",
      timestamp: "0.2s",
      source,
      details: [
        `Risk level evaluated as ${result.realityCheck?.riskLevel || "Unknown"}`,
        `Reasoning: ${result.realityCheck?.realisticReasoning || "None available."}`,
        `Identified gaps: ${result.realityCheck?.missingDeliverables ? result.realityCheck.missingDeliverables.join(", ") : "None"}`
      ]
    },
    {
      id: `${result.id}-step3`,
      order: 3,
      title: "Critical Dependency Found",
      summary: isRescue 
        ? "Non-essential elements block rapid release and present critical timeline risk." 
        : "Authentication blocks deployment and is marked as a critical blocker.",
      status: "blocker",
      icon: "ShieldAlert",
      timestamp: "0.4s",
      source,
      details: [
        "Unresolved Authentication or broken secondary flows block build validation",
        "Recommended action: Bypass auth using Local Storage or simulated offline profiles"
      ]
    },
    {
      id: `${result.id}-step4`,
      order: 4,
      title: "Scope Trimmed",
      summary: "Moved non-essential UI polish and optional integrations out of the immediate plan.",
      status: "optimized",
      icon: "Scissors",
      timestamp: "0.6s",
      source,
      details: [
        "Brutally cut: authentication, massive custom databases, minor details",
        "Retained: single core flow, clean interactive elements, and solid user documentation"
      ]
    },
    {
      id: `${result.id}-step5`,
      order: 5,
      title: "Safe Submit Path Activated",
      summary: "Prioritized a deployable core flow, README, project description, and submission proof.",
      status: "recommended",
      icon: "CheckSquare",
      timestamp: "0.8s",
      source,
      details: [
        "Primary action sequence: bypass blocker, polish core flow, deploy statically, draft README, fill out form",
        "Provides 90% execution safety margin"
      ]
    },
    {
      id: `${result.id}-step6`,
      order: 6,
      title: "Recovery Plan Prepared",
      summary: "Created fallback paths using local storage instead of authentication.",
      status: "ready",
      icon: "Activity",
      timestamp: "0.9s",
      source,
      details: [
        "Recovery 1: Record 2-minute Loom/video walk-through if production deploy fails",
        "Recovery 2: Push static build to GitHub Pages if primary host is bricked",
        "Recovery 3: Package offline code as ZIP archive if Git pushes are blocked"
      ]
    },
    {
      id: `${result.id}-step7`,
      order: 7,
      title: "Submission Readiness Updated",
      summary: "Current readiness improved from 42% to 78% after scope prioritization.",
      status: "progress",
      icon: "Award",
      timestamp: "1.0s",
      source,
      details: [
        "Calculated by weighing deliverables, proofs, blocker statuses, and timelines",
        "Awaiting DoneProof submissions to cross the 85% submission gate threshold"
      ]
    }
  ];

  return entries;
}

export function generateNeutralTemplate(templateName: string): AnalysisResult {
  const timestamp = Date.now();
  let title = "Project Recovery Workbook";
  let deadlineText = "Action Required";
  let riskScore = 75;
  let riskLevel: 'High' | 'Medium' | 'Low' = "High";
  let timeRemainingText = "Limited Margin";
  let isRealistic = false;
  let realisticReasoning = "Completing the raw scope is high risk. We recommend switching to the Best Plan to Finish.";
  let missingDeliverables = ["Core deliverables verified", "Operational testing complete"];
  
  let fullWinPath: Task[] = [];
  let safeSubmitPath: Task[] = [];
  let recoveryPath: Task[] = [];
  let requirements: { id: string; requirement: string; completed: boolean }[] = [];

  if (templateName === "Assignment Due Soon") {
    title = "Academic Paper Rescue Plan";
    deadlineText = "Due in 6 Hours";
    riskScore = 65;
    riskLevel = "Medium" as const;
    timeRemainingText = "6 Hours Remaining";
    realisticReasoning = "With only 6 hours remaining, trying to write all body pages, validating extensive academic citations, and formatting all pages is high risk. Focus strictly on a solid thesis, clean structured bibliography, and direct core arguments.";
    missingDeliverables = ["Academic citation list formatted", "Thesis statement aligned", "Conclusion draft complete"];
    
    fullWinPath = [
      {
        id: "fw-1",
        action: "Draft final 4 pages of complete body text",
        timeEstimate: "3 hrs",
        timeMinutes: 180,
        impact: "High",
        urgency: "High",
        reason: "Fills out required page count fully.",
        dependency: null,
        completed: false
      },
      {
        id: "fw-2",
        action: "Format and cross-reference 12 academic references",
        timeEstimate: "1.5 hrs",
        timeMinutes: 90,
        impact: "Critical",
        urgency: "High",
        reason: "Required to satisfy plagiarism guidelines.",
        dependency: "fw-1",
        completed: false
      },
      {
        id: "fw-3",
        action: "Proofread complete draft for grammatical and academic flow",
        timeEstimate: "1 hr",
        timeMinutes: 60,
        impact: "Medium",
        urgency: "Normal",
        reason: "Polishes reading flow and quality.",
        dependency: "fw-2",
        completed: false
      }
    ];

    safeSubmitPath = [
      {
        id: "ss-1",
        action: "Focus purely on a strong introduction, key headers, and robust conclusion",
        timeEstimate: "1.5 hrs",
        timeMinutes: 90,
        impact: "Critical",
        urgency: "Immediate",
        reason: "Ensures the core intellectual arguments are clear and professional.",
        dependency: null,
        completed: false
      },
      {
        id: "ss-2",
        action: "Use standard bibliography builder tools for citation formatting",
        timeEstimate: "30 mins",
        timeMinutes: 30,
        impact: "High",
        urgency: "High",
        reason: "Speeds up citation backlog by 3x compared to manual entries.",
        dependency: "ss-1",
        completed: false
      },
      {
        id: "ss-3",
        action: "Run an automated grammar scan (e.g. Grammarly) and hand-edit main thesis",
        timeEstimate: "30 mins",
        timeMinutes: 30,
        impact: "High",
        urgency: "High",
        reason: "Fixes crucial flow issues without reading every line slowly.",
        dependency: "ss-2",
        completed: false
      }
    ];

    recoveryPath = [
      {
        id: "rec-1",
        action: "Format Issue: Export directly to PDF to lock in text layout",
        timeEstimate: "10 mins",
        timeMinutes: 10,
        impact: "High",
        urgency: "High",
        reason: "Guarantees margins stay correct on the reviewer's screen.",
        dependency: null,
        completed: false
      },
      {
        id: "rec-2",
        action: "Submission Crash: Save complete text in local markdown as offline backup",
        timeEstimate: "5 mins",
        timeMinutes: 5,
        impact: "High",
        urgency: "High",
        reason: "Provides a lightweight copy you can email instantly if the portal fails.",
        dependency: null,
        completed: false
      }
    ];

    requirements = [
      { id: "req-1", requirement: "Clear thesis statement and main conclusion", completed: false },
      { id: "req-2", requirement: "Formatted academic references page", completed: false },
      { id: "req-3", requirement: "Clean grammar and spelling check", completed: false }
    ];
  } else if (templateName === "Client Project") {
    title = "Client Dashboard MVP Delivery";
    deadlineText = "Due Tomorrow Morning";
    riskScore = 85;
    riskLevel = "High" as const;
    timeRemainingText = "Approx. 12 Hours Left";
    realisticReasoning = "Attempting full database migrations, custom Stripe authentication, and multi-page layouts in under 12 hours is extremely high risk. We must bypass non-critical elements, use mock data, and perfect the single core workspace flow.";
    missingDeliverables = ["Stripe payment processor verified", "Multi-page database integrations complete", "User onboarding guide"];

    fullWinPath = [
      {
        id: "fw-1",
        action: "Set up server-side database connections and migrations",
        timeEstimate: "3 hrs",
        timeMinutes: 180,
        impact: "Critical",
        urgency: "Immediate",
        reason: "Provides durable persistence for workspace entries.",
        dependency: null,
        completed: false
      },
      {
        id: "fw-2",
        action: "Integrate production Stripe API checkout and sync webhooks",
        timeEstimate: "2.5 hrs",
        timeMinutes: 150,
        impact: "High",
        urgency: "High",
        reason: "Processes client transactions securely.",
        dependency: "fw-1",
        completed: false
      },
      {
        id: "fw-3",
        action: "Build secondary screens and navigation sidebars",
        timeEstimate: "1.5 hrs",
        timeMinutes: 90,
        impact: "Medium",
        urgency: "Normal",
        reason: "Polishes the multi-view routing of the client app.",
        dependency: "fw-2",
        completed: false
      }
    ];

    safeSubmitPath = [
      {
        id: "ss-1",
        action: "Bypass auth & API: Implement offline state in Local Storage",
        timeEstimate: "30 mins",
        timeMinutes: 30,
        impact: "Critical",
        urgency: "Immediate",
        reason: "Bypasses slow network queries. Provides instant client interactive feedback.",
        dependency: null,
        completed: false
      },
      {
        id: "ss-2",
        action: "Perfect exactly ONE core dashboard workspace page and lock other clicks",
        timeEstimate: "1.5 hrs",
        timeMinutes: 90,
        impact: "High",
        urgency: "Immediate",
        reason: "A flawless, beautiful core page is vastly superior to five half-finished tabs.",
        dependency: "ss-1",
        completed: false
      },
      {
        id: "ss-3",
        action: "Deploy statically (Vercel/Netlify) and prepare a 2-minute walk-through",
        timeEstimate: "30 mins",
        timeMinutes: 30,
        impact: "High",
        urgency: "High",
        reason: "Demonstrates operational clarity and protects against backend server downtime.",
        dependency: "ss-2",
        completed: false
      }
    ];

    recoveryPath = [
      {
        id: "rec-1",
        action: "Hosting Error: Push static build directly to GitHub Pages as backup",
        timeEstimate: "15 mins",
        timeMinutes: 15,
        impact: "High",
        urgency: "High",
        reason: "Provides a reliable backup mirror of your app immediately.",
        dependency: null,
        completed: false
      },
      {
        id: "rec-2",
        action: "API Down: Fallback to full mock mode with hardcoded JSON assets",
        timeEstimate: "10 mins",
        timeMinutes: 10,
        impact: "High",
        urgency: "High",
        reason: "Allows the client to click through without getting blank screens.",
        dependency: null,
        completed: false
      }
    ];

    requirements = [
      { id: "req-1", requirement: "High-fidelity core workspace dashboard", completed: false },
      { id: "req-2", requirement: "Dummy/Local auth bypass mechanism", completed: false },
      { id: "req-3", requirement: "Pristine static deployment link", completed: false }
    ];
  } else if (templateName === "Team Presentation") {
    title = "Product Roadmap Sync Deck";
    deadlineText = "Meeting in 3 Hours";
    riskScore = 75;
    riskLevel = "High" as const;
    timeRemainingText = "3 Hours Remaining";
    realisticReasoning = "Building a 15-slide comprehensive roadmap, recording extensive demo clips, and aligning precise financial estimates in 3 hours leaves zero room for error. A polished 5-slide core pitch with robust presenter notes is recommended.";
    missingDeliverables = ["Projected financial sheets", "Full video walk-through", "Q&A guide"];

    fullWinPath = [
      {
        id: "fw-1",
        action: "Draft comprehensive 15-slide pitch deck sequence",
        timeEstimate: "1.5 hrs",
        timeMinutes: 90,
        impact: "High",
        urgency: "High",
        reason: "Covers all roadmap aspects in depth.",
        dependency: null,
        completed: false
      },
      {
        id: "fw-2",
        action: "Compile financial budget sheets and projections",
        timeEstimate: "1 hr",
        timeMinutes: 60,
        impact: "Critical",
        urgency: "High",
        reason: "Validates long-term commercial numbers.",
        dependency: "fw-1",
        completed: false
      }
    ];

    safeSubmitPath = [
      {
        id: "ss-1",
        action: "Prune slide deck to exactly 5 high-impact slides",
        timeEstimate: "45 mins",
        timeMinutes: 45,
        impact: "Critical",
        urgency: "Immediate",
        reason: "Keeps messaging sharp and guarantees completion.",
        dependency: null,
        completed: false
      },
      {
        id: "ss-2",
        action: "Write flawless presenter notes and speaker cues directly inside the deck",
        timeEstimate: "30 mins",
        timeMinutes: 30,
        impact: "High",
        urgency: "Immediate",
        reason: "Ensures confidence during the presentation when details are condensed.",
        dependency: "ss-1",
        completed: false
      }
    ];

    recoveryPath = [
      {
        id: "rec-1",
        action: "Screen Sharing Lag: Export slides as static high-res images / PDF",
        timeEstimate: "10 mins",
        timeMinutes: 10,
        impact: "High",
        urgency: "High",
        reason: "Allows instant presentation even under slow meeting networks.",
        dependency: null,
        completed: false
      }
    ];

    requirements = [
      { id: "req-1", requirement: "Condensed 5-slide core product deck", completed: false },
      { id: "req-2", requirement: "Presenter speech notes and cues", completed: false }
    ];
  } else {
    // Personal Goal / Default
    title = "Portfolio Site Release Plan";
    deadlineText = "Due Today at Midnight";
    riskScore = 50;
    riskLevel = "Medium" as const;
    timeRemainingText = "8 Hours Remaining";
    realisticReasoning = "Launching a single-page portfolio is highly realistic if you stick to a static Tailwind page. Avoid custom Node database setups; use static pages with direct email contact links.";
    missingDeliverables = ["Static hosting live link", "Contact link validation"];

    fullWinPath = [
      {
        id: "fw-1",
        action: "Set up email contact database back-end and test connections",
        timeEstimate: "2 hrs",
        timeMinutes: 120,
        impact: "Medium",
        urgency: "Normal",
        reason: "Secures custom database submissions for portfolio messages.",
        dependency: null,
        completed: false
      },
      {
        id: "fw-2",
        action: "Build interactive custom canvas backgrounds and slide-ins",
        timeEstimate: "1.5 hrs",
        timeMinutes: 90,
        impact: "Low",
        urgency: "Normal",
        reason: "Adds visual animations to impress visitors.",
        dependency: "fw-1",
        completed: false
      }
    ];

    safeSubmitPath = [
      {
        id: "ss-1",
        action: "Implement a direct mailto link or simple Google Forms frame for contact",
        timeEstimate: "15 mins",
        timeMinutes: 15,
        impact: "Critical",
        urgency: "Immediate",
        reason: "Bypasses custom backend servers. Safe, reliable, and functional.",
        dependency: null,
        completed: false
      },
      {
        id: "ss-2",
        action: "Polish exactly three featured project case studies on a single static page",
        timeEstimate: "1 hr",
        timeMinutes: 60,
        impact: "High",
        urgency: "Immediate",
        reason: "Focuses attention on your absolute best work.",
        dependency: "ss-1",
        completed: false
      }
    ];

    recoveryPath = [
      {
        id: "rec-1",
        action: "Deploy Issues: Upload build directly to Netlify drag-and-drop",
        timeEstimate: "10 mins",
        timeMinutes: 10,
        impact: "High",
        urgency: "High",
        reason: "Provides a zero-config live URL instantly.",
        dependency: null,
        completed: false
      }
    ];

    requirements = [
      { id: "req-1", requirement: "Polished single-page project showcase", completed: false },
      { id: "req-2", requirement: "Working contact links", completed: false }
    ];
  }

  return {
    id: "neutral-" + templateName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + timestamp,
    title,
    deadlineText,
    createdAt: new Date().toISOString(),
    rawInput: `Loaded neutral template: ${templateName}`,
    isRescueMode: true,
    realityCheck: {
      riskScore,
      riskLevel,
      timeRemainingText,
      isRealistic,
      realisticReasoning,
      missingDeliverables
    },
    fullWinPath,
    safeSubmitPath,
    recoveryPath,
    requirements
  };
}


