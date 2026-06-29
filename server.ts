import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

dotenv.config();

// Standard pre-seeded Hackathon Demo Data to bypass API calls instantly when preset is matched
const hackathonDemoData = {
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

// Zod Validation Schemas for Gemini Structured JSON responses
const ZodTask = z.object({
  action: z.string().min(1),
  timeEstimate: z.string().min(1),
  timeMinutes: z.number().int(),
  impact: z.enum(["Critical", "High", "Medium", "Low"]).or(z.string()),
  urgency: z.enum(["Immediate", "High", "Normal", "Low"]).or(z.string()),
  reason: z.string().min(1),
  dependency: z.string().nullable().optional()
});

const ZodRealityCheck = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["High", "Medium", "Low"]).or(z.string()),
  timeRemainingText: z.string().min(1),
  isRealistic: z.boolean(),
  realisticReasoning: z.string().min(1),
  missingDeliverables: z.array(z.string())
});

const ZodWorkbook = z.object({
  title: z.string().min(1),
  deadlineText: z.string().min(1),
  realityCheck: ZodRealityCheck,
  fullWinPath: z.array(ZodTask),
  safeSubmitPath: z.array(ZodTask),
  recoveryPath: z.array(ZodTask),
  requirements: z.array(z.object({
    requirement: z.string().min(1)
  }))
});

// Deterministic Local Fallback Generator
function generateRescueWorkbook(rawInput: string): any {
  const text = rawInput ? rawInput.trim() : "";
  const lowercaseText = text.toLowerCase();
  
  let title = "Deadline Rescue Workbook";
  let deadlineText = "Immediate Action Needed";
  let riskScore = 85;
  let riskLevel = "High";
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

  const fullWinPath = [
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

  const safeSubmitPath = [
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

  const recoveryPath = [
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

// Check if error is retryable (HTTP 503 or 429)
function isRetryableError(error: any): boolean {
  const status = error.status || error.statusCode || error.status_code;
  const message = String(error.message || "").toLowerCase();
  
  if (status === 503 || status === 429) {
    return true;
  }
  
  if (
    message.includes("503") || 
    message.includes("429") || 
    message.includes("overloaded") || 
    message.includes("resource exhausted") || 
    message.includes("rate limit") ||
    message.includes("unavailable")
  ) {
    return true;
  }
  
  return false;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase request payload limit for base64 files
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // API Endpoint for deadline analysis
  app.post("/api/analyze-deadline", async (req, res) => {
    const { text, file } = req.body;
    try {
      if (!text && !file) {
        return res.status(400).json({ error: "Please provide either a text description or an attached file." });
      }

      // Detect pre-seeded hackathon demo preset and return instantly with zero API calls (offline/judge demo-safe)
      const isDemoPreset = text && text.toLowerCase().includes("hackathon submission is due today");
      if (isDemoPreset) {
        console.log("[GetSetDone Server] Pre-seeded hackathon demo preset matched. Bypassing Gemini API and returning instant static demo workbook.");
        const result = {
          ...hackathonDemoData,
          id: "analysis-demo-" + Date.now(),
          createdAt: new Date().toISOString(),
        };
        return res.json(result);
      }

      // Lazy initialization of Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("[GetSetDone Server] GEMINI_API_KEY is missing. Activating deterministic rescue plan.");
        console.log("[GetSetDone Server] deterministic rescue plan activated");
        const rescueWorkbook = generateRescueWorkbook(text);
        return res.json(rescueWorkbook);
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      // Prepare parts for multimodal Gemini model
      const contentsParts: any[] = [];

      // Add file attachment if present
      if (file && file.base64 && file.mimeType) {
        let cleanBase64 = file.base64;
        if (cleanBase64.includes(";base64,")) {
          cleanBase64 = cleanBase64.split(";base64,").pop() || "";
        }

        contentsParts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: cleanBase64
          }
        });
      }

      // Add user prompt text
      const systemTimeInfo = `Current time context: 2026-06-29. Use this context if deadlines are described relatively (e.g. "today", "tomorrow").`;
      contentsParts.push({
        text: `Analyze the following deadline crisis and generate a complete GetSetDone mitigation workbook.
        
${systemTimeInfo}

User Input:
${text || "Analyzed attached file content."}

Generate the following:
1. Title: A short, high-impact title describing this specific deadline rescue workbook.
2. DeadlineText: Human-readable deadline and duration context.
3. Reality Check:
   - riskScore: 0 to 100 representing probability of failure if unchanged.
   - riskLevel: "High", "Medium", or "Low" based on the risk score.
   - timeRemainingText: Friendly string of how many hours/days left.
   - isRealistic: true if 100% of the raw scope can be finished perfectly, false if cuts/pivots are needed.
   - realisticReasoning: Honest, brief professional reasoning of why it is/isn't realistic.
   - missingDeliverables: Bullet list of elements at risk, broken, or missing.
4. Full Win Path: A step-by-step sequential path of tasks to finish the original 100% full scope perfectly.
5. Safe Submit Path: A high-impact MVP/survival pivot path. Cut non-critical features, mock broken external dependencies, focus on a single flawless core flow, use local mock data, and write brilliant documentation to salvage the grade or client presentation.
6. Recovery Path: Actionable contingency procedures for emergency situations (e.g., deployment crashes, internet goes down, software is buggy).
7. Requirements: Extracted core requirements to list in a checklist.

Each task in Full Win, Safe Submit, and Recovery paths MUST contain:
- action: Short, direct action statement.
- timeEstimate: String (e.g., "30 mins", "1 hr", "2 hrs").
- timeMinutes: Integer (e.g., 30, 60, 120) for timeline calculations.
- impact: "Critical", "High", "Medium", or "Low".
- urgency: "Immediate", "High", "Normal", or "Low".
- reason: Clear explanation of why this task is in this path and how it saves time or delivers quality.
- dependency: Brief text description of what must happen before this task, or null.
`
      });

      const systemInstructionText = `You are GetSetDone AI, a hyper-focused, elite execution strategist, scrum master, and crisis manager. 
Your job is to stop users from panicking and give them extreme tactical clarity.
Be completely honest. If a deadline is unrealistic, call it out with a high risk score (80-100) and mark isRealistic as false.
In your Safe Submit paths, specialize in brutal scope-trimming: bypass authentication, mock heavy services, use client-side local storage instead of backend DBs, build exactly ONE flawless core experience, and emphasize spectacular documentation (like READMEs or pitch summaries) to offset cut features.
Return a single JSON payload matching the requested schema. Do not output any markdown headers, wrappers, or trailing text. Just the pure JSON object.`;

      const responseSchemaType = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          deadlineText: { type: Type.STRING },
          realityCheck: {
            type: Type.OBJECT,
            properties: {
              riskScore: { type: Type.INTEGER },
              riskLevel: { type: Type.STRING },
              timeRemainingText: { type: Type.STRING },
              isRealistic: { type: Type.BOOLEAN },
              realisticReasoning: { type: Type.STRING },
              missingDeliverables: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["riskScore", "riskLevel", "timeRemainingText", "isRealistic", "realisticReasoning", "missingDeliverables"]
          },
          fullWinPath: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                timeEstimate: { type: Type.STRING },
                timeMinutes: { type: Type.INTEGER },
                impact: { type: Type.STRING },
                urgency: { type: Type.STRING },
                reason: { type: Type.STRING },
                dependency: { type: Type.STRING, nullable: true }
              },
              required: ["action", "timeEstimate", "timeMinutes", "impact", "urgency", "reason"]
            }
          },
          safeSubmitPath: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                timeEstimate: { type: Type.STRING },
                timeMinutes: { type: Type.INTEGER },
                impact: { type: Type.STRING },
                urgency: { type: Type.STRING },
                reason: { type: Type.STRING },
                dependency: { type: Type.STRING, nullable: true }
              },
              required: ["action", "timeEstimate", "timeMinutes", "impact", "urgency", "reason"]
            }
          },
          recoveryPath: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING },
                timeEstimate: { type: Type.STRING },
                timeMinutes: { type: Type.INTEGER },
                impact: { type: Type.STRING },
                urgency: { type: Type.STRING },
                reason: { type: Type.STRING },
                dependency: { type: Type.STRING, nullable: true }
              },
              required: ["action", "timeEstimate", "timeMinutes", "impact", "urgency", "reason"]
            }
          },
          requirements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                requirement: { type: Type.STRING }
              },
              required: ["requirement"]
            }
          }
        },
        required: ["title", "deadlineText", "realityCheck", "fullWinPath", "safeSubmitPath", "recoveryPath", "requirements"]
      };

      let responseText = "";
      let success = false;
      let modelUsed = "gemini-3.5-flash";

      // 1. Primary Model Attempt & Retry Logic (Exponential Backoff: 1s, 2s, 4s)
      console.log(`[GetSetDone Server] primary model attempt: Initializing with ${modelUsed}`);
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          if (attempt > 1) {
            console.log(`[GetSetDone Server] retry attempt #${attempt - 1} using ${modelUsed} after backoff`);
          }
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: contentsParts,
            config: {
              systemInstruction: systemInstructionText,
              responseMimeType: "application/json",
              responseSchema: responseSchemaType,
            }
          });
          responseText = response.text || "";
          if (responseText) {
            success = true;
            break;
          }
        } catch (error: any) {
          console.error(`[GetSetDone Server] Primary attempt #${attempt} with ${modelUsed} failed. Error: ${error.message || error}`);
          
          if (attempt < 4 && isRetryableError(error)) {
            const backoffMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
            console.log(`[GetSetDone Server] Retryable server congestion encountered. Waiting ${backoffMs}ms before retrying...`);
            await delay(backoffMs);
          } else {
            break;
          }
        }
      }

      // 2. Fallback Model Attempt: If primary fails completely, try gemini-2.5-flash
      if (!success) {
        modelUsed = "gemini-2.5-flash";
        console.log(`[GetSetDone Server] fallback model used: Switching to secondary model ${modelUsed}`);
        
        for (let attempt = 1; attempt <= 4; attempt++) {
          try {
            if (attempt > 1) {
              console.log(`[GetSetDone Server] retry attempt #${attempt - 1} using ${modelUsed} after backoff`);
            } else {
              console.log(`[GetSetDone Server] Initial fallback attempt with ${modelUsed}`);
            }
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: contentsParts,
              config: {
                systemInstruction: systemInstructionText,
                responseMimeType: "application/json",
                responseSchema: responseSchemaType,
              }
            });
            responseText = response.text || "";
            if (responseText) {
              success = true;
              break;
            }
          } catch (error: any) {
            console.error(`[GetSetDone Server] Fallback attempt #${attempt} with ${modelUsed} failed. Error: ${error.message || error}`);
            
            if (attempt < 4 && isRetryableError(error)) {
              const backoffMs = Math.pow(2, attempt - 1) * 1000;
              console.log(`[GetSetDone Server] Retryable server congestion encountered on fallback. Waiting ${backoffMs}ms before retrying...`);
              await delay(backoffMs);
            } else {
              break;
            }
          }
        }
      }

      // 3. Fallback Trigger: If both fail, or JSON output is invalid, trigger deterministic offline fallback
      if (!success || !responseText) {
        console.log("[GetSetDone Server] deterministic rescue plan activated: All model queries exhausted or unavailable.");
        const rescueWorkbook = generateRescueWorkbook(text);
        return res.json(rescueWorkbook);
      }

      // 4. Parse & Validate structured JSON using Zod Schema before sending to front-end
      let rawData;
      try {
        rawData = JSON.parse(responseText.trim());
      } catch (e: any) {
        console.error("[GetSetDone Server] Response was not valid JSON. Activating deterministic fallback.");
        console.log("[GetSetDone Server] deterministic rescue plan activated");
        return res.json(generateRescueWorkbook(text));
      }

      const parsedData = ZodWorkbook.safeParse(rawData);
      if (!parsedData.success) {
        console.error("[GetSetDone Server] Gemini JSON output failed Zod schema validation:", parsedData.error);
        console.log("[GetSetDone Server] deterministic rescue plan activated");
        return res.json(generateRescueWorkbook(text));
      }

      const validData = parsedData.data;

      const result = {
        id: "analysis-" + Date.now(),
        title: validData.title,
        deadlineText: validData.deadlineText,
        createdAt: new Date().toISOString(),
        rawInput: text || "multimodal upload",
        isRescueMode: false,
        realityCheck: {
          riskScore: validData.realityCheck.riskScore,
          riskLevel: validData.realityCheck.riskLevel as 'High' | 'Medium' | 'Low',
          timeRemainingText: validData.realityCheck.timeRemainingText,
          isRealistic: validData.realityCheck.isRealistic,
          realisticReasoning: validData.realityCheck.realisticReasoning,
          missingDeliverables: validData.realityCheck.missingDeliverables
        },
        fullWinPath: validData.fullWinPath.map((t: any, index: number) => ({
          ...t,
          id: `fw-${index + 1}`,
          completed: false,
          dependency: t.dependency || null
        })),
        safeSubmitPath: validData.safeSubmitPath.map((t: any, index: number) => ({
          ...t,
          id: `ss-${index + 1}`,
          completed: false,
          dependency: t.dependency || null
        })),
        recoveryPath: validData.recoveryPath.map((t: any, index: number) => ({
          ...t,
          id: `rec-${index + 1}`,
          completed: false,
          dependency: t.dependency || null
        })),
        requirements: validData.requirements.map((req: any, index: number) => ({
          id: `req-${index + 1}`,
          requirement: req.requirement,
          completed: false
        }))
      };

      return res.json(result);
    } catch (error: any) {
      console.error("[GetSetDone Server] Fatal server error. Activating local deterministic rescue fallback:", error);
      console.log("[GetSetDone Server] deterministic rescue plan activated");
      const rescueWorkbook = generateRescueWorkbook(text);
      return res.json(rescueWorkbook);
    }
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GetSetDone Server] Running on http://localhost:${PORT} under ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
