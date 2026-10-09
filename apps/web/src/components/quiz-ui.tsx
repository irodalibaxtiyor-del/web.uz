import type { QuizStatus } from '@webdizayn/shared';

const QUIZ: Record<QuizStatus, { label: string; icon: string; tone: string }> = {
  NOT_STARTED: { label: 'Boshlanmagan', icon: '○', tone: 'text-slate-500' },
  FAILED: { label: 'O‘tilmadi', icon: '!', tone: 'text-amber-700 dark:text-amber-400' },
  PASSED: { label: 'O‘tdi', icon: '✓', tone: 'text-emerald-700 dark:text-emerald-400' },
};

export function QuizStatusBadge({
  status,
  bestScore,
}: {
  status: QuizStatus;
  bestScore: number | null;
}) {
  const s = QUIZ[status];
  return (
    <span className={`text-sm ${s.tone}`}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
      {bestScore !== null && ` · eng yaxshi natija ${bestScore}%`}
    </span>
  );
}
