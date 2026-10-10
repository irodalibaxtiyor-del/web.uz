import { z } from 'zod';
import type { ProjectFile } from './exercises';

/**
 * Student portfolio (13B). Nothing is public until the owner explicitly publishes; the public
 * view carries only what the owner chose to show (no email, ids of other records, scores or
 * teacher feedback).
 */

export const PORTFOLIO_MAX_ITEMS = 20;
export const PORTFOLIO_MAX_SKILLS = 20;

/** 3–40 chars, lowercase letters, digits and inner hyphens. */
export const PORTFOLIO_SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38})[a-z0-9]$/;

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(PORTFOLIO_SLUG_RE)
  .refine((s) => !s.includes('--'), { message: 'double hyphen' });

const skill = z.string().trim().min(1).max(40);

export const updatePortfolioSchema = z
  .object({
    slug: slug.nullable().optional(),
    displayName: z.string().trim().min(2).max(80).optional(),
    headline: z.string().trim().max(120).optional(),
    bio: z.string().trim().max(2000).optional(),
    skills: z
      .array(skill)
      .max(PORTFOLIO_MAX_SKILLS)
      .refine((s) => new Set(s.map((x) => x.toLowerCase())).size === s.length, {
        message: 'duplicate skill',
      })
      .optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;

export const PORTFOLIO_ITEM_KINDS = ['EXERCISE', 'ASSIGNMENT'] as const;
export type PortfolioItemKind = (typeof PORTFOLIO_ITEM_KINDS)[number];

const itemTitle = z.string().trim().min(2).max(120);
const itemDescription = z.string().trim().max(2000);

export const addPortfolioItemSchema = z.object({
  kind: z.enum(PORTFOLIO_ITEM_KINDS),
  sourceId: z.uuid(),
  title: itemTitle.optional(),
  description: itemDescription.optional(),
});
export type AddPortfolioItemInput = z.infer<typeof addPortfolioItemSchema>;

export const updatePortfolioItemSchema = z
  .object({
    title: itemTitle.optional(),
    description: itemDescription.optional(),
    position: z.number().int().min(0).max(1000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'empty' });
export type UpdatePortfolioItemInput = z.infer<typeof updatePortfolioItemSchema>;

/** Derived from learning data on the server; never stored or set by the client. */
export const ACHIEVEMENTS = [
  'FIRST_EXERCISE',
  'TEN_EXERCISES',
  'QUIZ_MASTER',
  'FIRST_GRADED_ASSIGNMENT',
  'COURSE_COMPLETED',
] as const;
export type Achievement = (typeof ACHIEVEMENTS)[number];

export interface CompletedCourse {
  title: string;
  completedAt: string;
}

export interface PortfolioItemSummary {
  id: string;
  kind: PortfolioItemKind;
  title: string;
  description: string;
  courseTitle: string;
  position: number;
  addedAt: string;
}

export interface PortfolioItemDetail extends PortfolioItemSummary {
  /** Snapshot taken when the item was added; later edits to the source do not change it. */
  files: ProjectFile[];
}

/** Finished work the owner may add. */
export interface PortfolioCandidate {
  kind: PortfolioItemKind;
  sourceId: string;
  title: string;
  courseTitle: string;
  finishedAt: string | null;
}

export interface PortfolioProfile {
  slug: string | null;
  displayName: string;
  headline: string;
  bio: string;
  skills: string[];
  isPublished: boolean;
  publishedAt: string | null;
}

export interface MyPortfolio {
  profile: PortfolioProfile;
  items: PortfolioItemSummary[];
  candidates: PortfolioCandidate[];
  achievements: Achievement[];
  completedCourses: CompletedCourse[];
}

export interface PublicPortfolio {
  slug: string;
  displayName: string;
  headline: string;
  bio: string;
  skills: string[];
  achievements: Achievement[];
  completedCourses: CompletedCourse[];
  items: PortfolioItemSummary[];
  publishedAt: string;
}
