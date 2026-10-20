import type { QuizStatus } from '@webdizayn/shared';
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
