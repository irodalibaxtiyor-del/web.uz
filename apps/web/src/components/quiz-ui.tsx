import type { QuizStatus, QuizSummary } from '@webdizayn/shared';
import Link from 'next/link';
import { Icon, type IconName } from './icons';

const QUIZ: Record<QuizStatus, { label: string; icon: IconName; tone: string }> = {
  NOT_STARTED: {
    label: 'Boshlanmagan',
    icon: 'circleDashed',
    tone: 'text-slate-500 dark:text-slate-400',
  },
  FAILED: { label: 'O‘tilmadi', icon: 'alertCircle', tone: 'text-amber-700 dark:text-amber-400' },
  PASSED: { label: 'O‘tdi', icon: 'checkCircle', tone: 'text-emerald-700 dark:text-emerald-400' },
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
      <Icon name={s.icon} className="inline size-4 align-[-0.2em]" /> {s.label}
      {bestScore !== null && ` · eng yaxshi natija ${bestScore}%`}
    </span>
  );
}

/** An exercise's self-check mini-tests (optional; they never gate the lesson). */
export function MiniQuizLinks({
  quizzes,
  courseBase,
  compact = false,
}: {
  quizzes: QuizSummary[] | undefined;
  courseBase: string;
  compact?: boolean;
}) {
  if (!quizzes?.length) return null;
  return (
    <ul className={compact ? 'w-full space-y-1' : 'space-y-2'}>
      {quizzes.map((m) => (
        <li key={m.id} className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`${courseBase}/quizzes/${m.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
          >
            <Icon name="checkCircle" className="size-4" />
            {compact ? `Mini-test: ${m.title}` : m.title}
          </Link>
          <QuizStatusBadge status={m.status} bestScore={m.bestScore} />
        </li>
      ))}
    </ul>
  );
}
