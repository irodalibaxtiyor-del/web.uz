import type { LessonState } from './courses';

export type ProgressStatus = 'IN_PROGRESS' | 'COMPLETED';

/**
 * Strict sequential unlocking. Given lessons in course order and the student's progress,
 * a lesson is accessible iff it is completed or it is the first lesson not yet completed.
 * Lessons inserted later before already-completed ones therefore become the next target
 * without re-locking work the student has already finished.
 */
export function computeLessonStates(
  orderedLessonIds: readonly string[],
  progress: ReadonlyMap<string, ProgressStatus>,
): Map<string, LessonState> {
  const states = new Map<string, LessonState>();
  let frontierFound = false;
  for (const id of orderedLessonIds) {
    const p = progress.get(id);
    if (p === 'COMPLETED') {
      states.set(id, 'COMPLETED');
    } else if (!frontierFound) {
      frontierFound = true;
      states.set(id, p === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'AVAILABLE');
    } else {
      states.set(id, 'LOCKED');
    }
  }
  return states;
}

export function progressPercent(completed: number, total: number): number {
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}
