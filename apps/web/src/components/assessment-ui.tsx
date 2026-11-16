'use client';

import { ASSESSMENT_SLUG, type AssessmentSummary, type SurveySummary } from '@webdizayn/shared';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Icon } from './icons';

/**
 * Course-map notices for the open pre-/post-test and unanswered questionnaires. Silent when there is nothing to show (or the
 * request fails): the map itself must never break because of it.
 */
export function AssessmentsBanner({ base }: { base: string }) {
  const [list, setList] = useState<AssessmentSummary[]>([]);
  const [surveys, setSurveys] = useState<SurveySummary[]>([]);
  useEffect(() => {
    let alive = true;
    void api<AssessmentSummary[]>(`${base}/assessments/mine`).then((r) => {
      if (alive && r.ok) setList(r.data);
    });
    void api<SurveySummary[]>(`${base}/surveys/mine`).then((r) => {
      if (alive && r.ok) setSurveys(r.data.filter((x) => !x.answered));
    });
    return () => {
      alive = false;
    };
  }, [base]);
  if (list.length === 0 && surveys.length === 0) return null;
  return (
    <ul className="space-y-3" aria-label="Testlar va so‘rovnomalar">
      {list.map((a) => {
        const done = a.status === 'SUBMITTED';
        return (
          <li
            key={a.kind}
            className={`card flex flex-wrap items-center justify-between gap-3 border-l-4 p-5 ${
              done ? 'border-l-emerald-600' : 'border-l-accent-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <Icon
                name={done ? 'checkCircle' : 'clipboard'}
                className={`mt-0.5 size-6 ${done ? 'text-emerald-700 dark:text-emerald-400' : 'text-brand-700 dark:text-brand-300'}`}
              />
              <div>
                <p className="font-semibold text-ink dark:text-white">{a.title}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {done
                    ? `Topshirilgan · natija ${a.score}%`
                    : a.status === 'IN_PROGRESS'
                      ? 'Boshlangan — yakunlashni unutmang'
                      : 'Bitta urinish · natija bilim o‘sishini o‘lchash uchun'}
                </p>
              </div>
            </div>
            {!done && (
              <Link
                href={`${base}/assessments/${ASSESSMENT_SLUG[a.kind]}`}
                className="btn btn-primary"
              >
                {a.status === 'IN_PROGRESS' ? 'Davom ettirish' : 'Testni topshirish'}
                <Icon name="arrowRight" className="size-4" />
              </Link>
            )}
          </li>
        );
      })}
      {surveys.map((sv) => (
        <li
          key={sv.id}
          className="card flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-brand-500 p-5"
        >
          <div className="flex items-start gap-3">
            <Icon name="message" className="mt-0.5 size-6 text-brand-700 dark:text-brand-300" />
            <div>
              <p className="font-semibold text-ink dark:text-white">{sv.title}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Qisqa so&apos;rovnoma · 3–5 daqiqa · ilmiy tadqiqot uchun
              </p>
            </div>
          </div>
          <Link href={`${base}/surveys/${sv.id}`} className="btn btn-outline">
            Javob berish
            <Icon name="arrowRight" className="size-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
