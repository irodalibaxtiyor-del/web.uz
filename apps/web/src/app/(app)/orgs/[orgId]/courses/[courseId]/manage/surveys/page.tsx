'use client';

import { SURVEY_PHASE_LABEL, surveyTemplate, type SurveyAdmin } from '@webdizayn/shared';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icons';
import { Button, EmptyState, ErrorText, LoadState, PageHeader } from '@/components/ui';
import { send } from '@/lib/api';
import { useApi } from '@/lib/use-api';

export default function SurveysPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const router = useRouter();
  const { state } = useApi<SurveyAdmin[]>(`${base}/surveys`);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function create(fromTemplate: boolean) {
    setPending(true);
    setError(null);
    const body = fromTemplate ? surveyTemplate() : { title: 'Yangi so‘rovnoma', items: [] };
    const res = await send<SurveyAdmin>('POST', `${base}/surveys`, body);
    setPending(false);
    if (!res.ok) return setError(res.message);
    router.push(`${base}/manage/surveys/${res.data.id}`);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
        ]}
        title="So'rovnomalar"
        subtitle="Motivatsiya, qoniqish va o'zini baholash bo'yicha Likert so'rovnomalari: subshkalalar, teskari bandlar, Cronbach α va guruhlar taqqoslovi."
        actions={
          <>
            <Button onClick={() => create(true)} disabled={pending}>
              <Icon name="sparkles" className="size-4" />
              Tayyor shablondan
            </Button>
            <Button variant="secondary" onClick={() => create(false)} disabled={pending}>
              <Icon name="plus" className="size-4" />
              Bo&apos;sh so&apos;rovnoma
            </Button>
          </>
        }
      />
      {error && <ErrorText>{error}</ErrorText>}
      <LoadState state={state}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState title="Hali so'rovnoma yo'q">
              &quot;Tayyor shablondan&quot; — o&apos;quv motivatsiyasi, platformadan qoniqish va
              o&apos;z-o&apos;ziga ishonch bo&apos;yicha 11 ta Likert bandi va bitta ochiq savol.
            </EmptyState>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {list.map((s) => (
                <li key={s.id} className="card card-hover relative p-5">
                  <h2 className="text-lg font-semibold">
                    <Link
                      href={`${base}/manage/surveys/${s.id}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {s.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {SURVEY_PHASE_LABEL[s.phase]} · {s.items.length} ta savol · {s.responses} ta
                    javob · {s.isOpen ? 'ochiq' : 'yopiq'}
                  </p>
                </li>
              ))}
            </ul>
          )
        }
      </LoadState>
    </>
  );
}
