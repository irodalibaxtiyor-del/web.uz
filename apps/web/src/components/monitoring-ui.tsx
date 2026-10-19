import type { StruggleKind, StruggleStatus } from '@webdizayn/shared';

export const STRUGGLE: Record<StruggleStatus, { label: string; icon: string; tone: string }> = {
  OK: { label: 'Muammo aniqlanmagan', icon: '✓', tone: 'text-emerald-700 dark:text-emerald-400' },
  STRUGGLING: { label: 'Qiynalmoqda', icon: '!', tone: 'text-amber-700 dark:text-amber-400' },
  INSUFFICIENT_DATA: {
    label: 'Ma’lumot yetarli emas',
    icon: '…',
    tone: 'text-slate-600 dark:text-slate-400',
  },
};

export const STRUGGLE_KIND: Record<StruggleKind, string> = {
  REPEATED_CHECK_FAILURES: 'CHECK bir necha marta o‘tmadi',
  NEEDS_IMPROVEMENT: 'Tuzatish kerak',
  QUIZ_NOT_PASSED: 'Test o‘tilmadi',
  REVISION_REQUESTED: 'Qayta ishlash so‘ralgan',
};

export function StruggleBadge({ status, count }: { status: StruggleStatus; count?: number }) {
  const st = STRUGGLE[status];
  return (
    <span className={st.tone}>
      <span aria-hidden="true">{st.icon}</span> {st.label}
      {count ? ` (${count})` : ''}
    </span>
  );
}
