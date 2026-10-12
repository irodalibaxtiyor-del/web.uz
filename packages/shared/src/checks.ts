import { z } from 'zod';

/**
 * CHECK rules are authored by staff and stored on the exercise. They are hidden: the student
 * only ever receives a {@link CheckRunView} (titles of visible checks, pass/fail, hints).
 */

export const CHECK_MAX_RULES = 30;
export const CHECK_MAX_ACTIONS = 10;

const selector = z.string().trim().min(1).max(300);
const shortText = z.string().max(1000);

export const checkActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'), selector }),
  z.object({ type: z.literal('hover'), selector }),
  z.object({ type: z.literal('fill'), selector, value: shortText }),
  z.object({
    type: z.literal('press'),
    selector,
    key: z.string().regex(/^[A-Za-z0-9+]{1,30}$/),
  }),
  z.object({ type: z.literal('wait'), ms: z.number().int().min(0).max(2000) }),
]);
export type CheckAction = z.infer<typeof checkActionSchema>;

/** Standard (`color`, `-webkit-…`) or custom (`--brand`) CSS property name. */
export const CSS_PROPERTY_RE = /^(?:-?[a-z][a-z-]{0,60}|--[A-Za-z0-9_-]{1,60})$/;

export const CHECK_PSEUDO_ELEMENTS = [
  '::before',
  '::after',
  '::first-letter',
  '::first-line',
  '::marker',
  '::placeholder',
] as const;
export type CheckPseudoElement = (typeof CHECK_PSEUDO_ELEMENTS)[number];

export const checkAssertionSchema = z.discriminatedUnion('type', [
  /** Number of matching elements is within [min, max]. `max: 0` asserts absence. */
  z
    .object({
      type: z.literal('count'),
      selector,
      min: z.number().int().min(0).max(1000).default(1),
      max: z.number().int().min(0).max(1000).optional(),
    })
    .refine((a) => a.max === undefined || a.max >= a.min, { message: 'max < min' }),
  /** Text content of the first match (whitespace collapsed). */
  z.object({
    type: z.literal('text'),
    selector,
    match: z.enum(['contains', 'equals']).default('contains'),
    value: shortText,
    caseSensitive: z.boolean().default(false),
  }),
  /** Attribute of the first match. Without `value` only presence is required. */
  z.object({
    type: z.literal('attribute'),
    selector,
    name: z.string().regex(/^[A-Za-z_:][A-Za-z0-9_:.-]{0,60}$/),
    value: shortText.optional(),
  }),
  /**
   * Computed style of the first match equals `value` once both are normalized by the browser.
   * `property` may be a custom property (`--brand`); `pseudo` reads a pseudo-element's style.
   */
  z.object({
    type: z.literal('style'),
    selector,
    property: z.string().regex(CSS_PROPERTY_RE),
    value: z.string().trim().min(1).max(200),
    pseudo: z.enum(CHECK_PSEUDO_ELEMENTS).optional(),
  }),
  /** No uncaught exceptions and no console.error during load and actions. */
  z.object({ type: z.literal('noConsoleErrors') }),
]);
export type CheckAssertion = z.infer<typeof checkAssertionSchema>;

export const CHECK_ID_RE = /^[a-z0-9_-]{1,40}$/;

export const checkRuleSchema = z.object({
  id: z.string().regex(CHECK_ID_RE),
  /** Shown to the student for visible checks. Must not reveal the hidden expectation. */
  title: z.string().trim().min(2).max(200),
  /** Shown to the student only when this visible check fails. */
  hint: z.string().trim().max(500).optional(),
  /** Hidden checks are reported to the student only as an aggregate count. */
  hidden: z.boolean().default(false),
  viewport: z
    .object({
      width: z.number().int().min(240).max(2560),
      height: z.number().int().min(240).max(2000),
    })
    .optional(),
  actions: z.array(checkActionSchema).max(CHECK_MAX_ACTIONS).default([]),
  assert: checkAssertionSchema,
});
export type CheckRule = z.infer<typeof checkRuleSchema>;
export type CheckRuleInput = z.input<typeof checkRuleSchema>;

export const checkRulesSchema = z
  .array(checkRuleSchema)
  .max(CHECK_MAX_RULES)
  .superRefine((rules, ctx) => {
    const seen = new Set<string>();
    for (const r of rules) {
      if (seen.has(r.id)) ctx.addIssue({ code: 'custom', message: `duplicate check id: ${r.id}` });
      seen.add(r.id);
    }
  });

// ---- Results ---------------------------------------------------------------

export const CHECK_RESULT_STATUSES = ['PASSED', 'FAILED', 'ERROR', 'TIMEOUT'] as const;
export type CheckResultStatus = (typeof CHECK_RESULT_STATUSES)[number];

export const CHECK_RUN_STATUSES = ['QUEUED', 'RUNNING', ...CHECK_RESULT_STATUSES] as const;
export type CheckRunStatus = (typeof CHECK_RUN_STATUSES)[number];

/**
 * Why a run did not produce a normal verdict. Codes are safe to show; details never are.
 * NO_ENTRY: project has no index.html. LOAD_TIMEOUT / BUDGET: page or run took too long.
 * PAGE_CRASHED: renderer died (e.g. memory). ENGINE: infrastructure failure, not the student.
 */
export const CHECK_ERROR_CODES = [
  'NO_ENTRY',
  'LOAD_TIMEOUT',
  'BUDGET',
  'PAGE_CRASHED',
  'ENGINE',
] as const;
export type CheckErrorCode = (typeof CHECK_ERROR_CODES)[number];

/** Full engine output. Staff-only: it is keyed by rule id and stored for teacher review. */
export interface CheckEngineResult {
  status: CheckResultStatus;
  errorCode: CheckErrorCode | null;
  results: { id: string; passed: boolean }[];
  durationMs: number;
}

/** Student-safe summary of a run. Contains no selectors, expected values or hidden titles. */
export interface CheckRunView {
  id: string;
  status: CheckRunStatus;
  errorCode: CheckErrorCode | null;
  createdAt: string;
  finishedAt: string | null;
  passedCount: number;
  total: number;
  checks: { title: string; passed: boolean; hint: string | null }[];
  hidden: { passed: number; total: number };
}

/** Staff dry-run output: full detail including hidden checks. */
export interface CheckPreviewResult {
  status: CheckResultStatus;
  errorCode: CheckErrorCode | null;
  durationMs: number;
  checks: { id: string; title: string; hidden: boolean; passed: boolean }[];
}
