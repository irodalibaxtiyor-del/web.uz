import type { AssignmentStatus, SubmissionStatus, SubmitBlocker } from '@webdizayn/shared';

export const ASSIGNMENT_STATUS: Record<AssignmentStatus, { label: string; tone: string }> = {
  DRAFT: {
    label: 'Qoralama',
    tone: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  PUBLISHED: {
    label: 'E’lon qilingan',
    tone: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  },
  CLOSED: {
    label: 'Yopilgan',
    tone: 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
};

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  const s = ASSIGNMENT_STATUS[status];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.tone}`}>{s.label}</span>
  );
}

const SUBMISSION: Record<SubmissionStatus, { label: string; icon: string; tone: string }> = {
  DRAFT: { label: 'Qoralama', icon: '○', tone: 'text-slate-600 dark:text-slate-400' },
  SUBMITTED: { label: 'Topshirildi', icon: '↑', tone: 'text-brand-700 dark:text-brand-300' },
  IN_REVIEW: { label: 'Ko‘rib chiqilmoqda', icon: '◐', tone: 'text-brand-700 dark:text-brand-300' },
  REVISION_REQUESTED: {
    label: 'Qayta ishlash so‘raldi',
    icon: '!',
    tone: 'text-amber-700 dark:text-amber-400',
  },
  GRADED: { label: 'Baholandi', icon: '★', tone: 'text-emerald-700 dark:text-emerald-400' },
  FINALIZED: { label: 'Yakunlandi', icon: '✓', tone: 'text-emerald-700 dark:text-emerald-400' },
};

/** `null` means the learner has not started the assignment. */
export function SubmissionStatusBadge({ status }: { status: SubmissionStatus | null }) {
  const s = status
    ? SUBMISSION[status]
    : { label: 'Boshlanmagan', icon: '○', tone: 'text-slate-500' };
  return (
    <span className={`text-sm ${s.tone}`}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}

export const BLOCKER_TEXT: Record<SubmitBlocker, string> = {
  ASSIGNMENT_CLOSED: 'Topshiriq yopilgan. Yangi javob qabul qilinmaydi.',
  SUBMISSION_LOCKED: 'Javobingiz o‘qituvchida. Hozircha o‘zgartirib bo‘lmaydi.',
  ATTEMPTS_EXHAUSTED: 'Barcha urinishlar ishlatildi.',
  DEADLINE_PASSED: 'Topshirish muddati o‘tgan.',
};
