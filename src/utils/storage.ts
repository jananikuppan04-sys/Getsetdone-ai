import { z } from 'zod';

// Zod validation schemas matching TypeScript types
export const TaskSchema = z.object({
  id: z.string(),
  action: z.string(),
  timeEstimate: z.string(),
  timeMinutes: z.number(),
  impact: z.string(),
  urgency: z.string(),
  reason: z.string(),
  dependency: z.string().nullable().optional(),
  completed: z.boolean()
});

export const RealityCheckSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.string(),
  timeRemainingText: z.string(),
  isRealistic: z.boolean(),
  realisticReasoning: z.string(),
  missingDeliverables: z.array(z.string())
});

export const RequirementSchema = z.object({
  id: z.string(),
  requirement: z.string(),
  completed: z.boolean()
});

export const AnalysisResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  deadlineText: z.string(),
  createdAt: z.string(),
  rawInput: z.string(),
  isRescueMode: z.boolean().optional(),
  realityCheck: RealityCheckSchema,
  fullWinPath: z.array(TaskSchema),
  safeSubmitPath: z.array(TaskSchema),
  recoveryPath: z.array(TaskSchema),
  requirements: z.array(RequirementSchema)
});

// Zod schemas for focus & habit tracking
export const ScheduleItemSchema = z.object({
  id: z.string(),
  time: z.string(),
  task: z.string(),
  completed: z.boolean()
});

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  completed: z.boolean(),
  streak: z.number()
});

export const WeeklyGoalSchema = z.object({
  id: z.string(),
  goal: z.string(),
  completed: z.boolean()
});

export const DoneProofSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  type: z.string(),
  value: z.string(),
  fileName: z.string().optional(),
  status: z.string(),
  updatedAt: z.string()
});

export const LocalUserProfileSchema = z.object({
  name: z.string().min(2).max(30),
  purpose: z.enum(["study", "work", "freelance", "personal", "mixed"]).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  hasCompletedOnboarding: z.boolean()
});


/**
 * Validate loaded JSON data against a specific Zod schema.
 */
export function validateStoredData<T>(data: any, schema: z.ZodType<T>): { success: boolean; data?: T; error?: any } {
  try {
    const parsed = schema.safeParse(data);
    if (parsed.success) {
      return { success: true, data: parsed.data };
    } else {
      return { success: false, error: parsed.error };
    }
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Handles backwards compatibility or shape changes.
 */
export function migrateStoredData(key: string, data: any): any {
  if (!data) return data;
  
  // Example Migration: Ensure list keys always exist or match modern formats
  if (key.includes('active_analysis') && data) {
    if (!data.requirements) {
      data.requirements = [];
    }
    if (typeof data.isRescueMode === 'undefined') {
      data.isRescueMode = true;
    }
  }
  return data;
}

/**
 * Fetch and validate data from localStorage. If corrupted, resets and returns default.
 */
export function getLocalData<T>(key: string, schema: z.ZodType<T>, defaultValue: T): { data: T; resetOccurred: boolean } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return { data: defaultValue, resetOccurred: false };
    }

    let parsed = JSON.parse(raw);
    parsed = migrateStoredData(key, parsed);

    const validation = validateStoredData(parsed, schema);
    if (validation.success && validation.data !== undefined) {
      return { data: validation.data, resetOccurred: false };
    } else {
      console.warn(`[GetSetDone Storage] Validation failed for key: ${key}. Clearing corrupt storage section.`);
      localStorage.removeItem(key);
      return { data: defaultValue, resetOccurred: true };
    }
  } catch (err) {
    console.error(`[GetSetDone Storage] LocalStorage is full, unavailable, or corrupted for key: ${key}.`, err);
    return { data: defaultValue, resetOccurred: true };
  }
}

/**
 * Save data to local storage with robust browser capacity check.
 */
export function saveLocalData(key: string, data: any): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.error(`[GetSetDone Storage] Failed to write key: ${key} to localStorage. Storage may be full.`, err);
    // Dispatch a custom event to notify components of storage exhaustion
    window.dispatchEvent(new CustomEvent('getsetdone_storage_error', { 
      detail: { key, message: "Your changes may not be saved in this browser. Try freeing storage or use another browser." } 
    }));
    return false;
  }
}

/**
 * Delete a specific key from local storage.
 */
export function clearLocalData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`[GetSetDone Storage] Failed to delete key: ${key}`, err);
  }
}
