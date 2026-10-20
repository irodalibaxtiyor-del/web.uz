/**
 * Public catalogue (no login): directions ("yo'nalishlar") and published courses of the
 * platform organization. Only titles, descriptions and counts — never lesson content,
 * exercises, CHECK rules or anything about learners.
 */

/** URL slug of a direction or a public course. */
export const CATALOG_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface CourseCounts {
  modules: number;
  lessons: number;
  exercises: number;
  quizzes: number;
}

export interface PublicCourseSummary {
  slug: string;
  title: string;
  description: string;
  counts: CourseCounts;
}

export interface DirectionSummary {
  slug: string;
  title: string;
  summary: string;
  courseCount: number;
}

export interface DirectionDetail {
  slug: string;
  title: string;
  summary: string;
  /** Plain paragraphs separated by blank lines. */
  description: string;
  courses: PublicCourseSummary[];
}

export interface PublicCourseDetail extends PublicCourseSummary {
  /** Needed for "Kursni boshlash": the course map lives at /orgs/:org/courses/:id. */
  id: string;
  organizationId: string;
  directions: { slug: string; title: string }[];
  modules: { title: string; lessons: string[] }[];
}

/** Response for a slug that was renamed: the page answers with a permanent redirect. */
export interface CourseMoved {
  movedTo: string;
}
