'use client';

import {
  ASSESSMENT_LABEL,
  alphaLabel,
  ITEM_FLAG_LABEL,
  ITEM_MIN_RESPONDENTS,
  QUIZ_KIND_LABEL,
  round,
  type ItemAnalysisReport,
} from '@webdizayn/shared';
import { useParams } from 'next/navigation';
import { Icon } from '@/components/icons';
import { EmptyState, LoadState, PageHeader, TableScroll } from '@/components/ui';
import { useApi } from '@/lib/use-api';

const fmt = (x: number | null, digits = 2) => (x === null ? '—' : String(round(x, digits)));
const SOURCE = { QUIZ: 'Dars testi', ...ASSESSMENT_LABEL } as const;

export default function ItemAnalysisPage() {
  const { orgId, courseId } = useParams<{ orgId: string; courseId: string }>();
  const base = `/orgs/${orgId}/courses/${courseId}`;
  const { state } = useApi<ItemAnalysisReport>(`${base}/item-analysis`);
  return (
    <>
      <PageHeader
        crumbs={[
          { href: '/dashboard', label: 'Kabinet' },
          { href: `${base}/manage`, label: 'Kursni boshqarish' },
        ]}
        title="Test savollari tahlili"
        subtitle="Klassik test nazariyasi: qiyinlik (p), ajrata olish (D, yuqori va quyi 27%), nuqtali-biserial korrelyatsiya va testning ishonchliligi (KR-20). Dars testlarida har talabaning birinchi urinishi olinadi."
        actions={
          <a href={`/api${base}/item-analysis/report.xlsx`} className="btn btn-outline">
            Excel yuklab olish
          </a>
        }
      />
      <LoadState state={state}>
        {(r) =>
          r.instruments.length === 0 ? (
            <EmptyState title="Hali tahlil uchun javoblar yo'q">
              Talabalar dars testlari yoki kirish/yakuniy testni topshirgach, shu yerda savollar
              sifati ko&apos;rinadi.
            </EmptyState>
          ) : (
            <div className="space-y-8">
              <section className="card space-y-3 p-6" aria-labelledby="turlar">
                <h2 id="turlar" className="text-xl font-bold">
                  Savol turlari bo&apos;yicha
                </h2>
                {r.byKind.length === 0 ? (
                  <p className="text-slate-600 dark:text-slate-400">
                    Har savolga kamida {ITEM_MIN_RESPONDENTS} ta javob kerak.
                  </p>
                ) : (
                  <TableScroll label="Savol turlari">
                    <table className="w-full min-w-[34rem] text-left text-sm">
                      <thead>
                        <tr className="border-b border-line">
                          <th className="py-2 pr-3">Tur</th>
                          <th className="py-2 pr-3 text-right">Savollar</th>
                          <th className="py-2 pr-3 text-right">Javoblar</th>
                          <th className="py-2 pr-3 text-right">O&apos;rtacha qiyinlik p</th>
                          <th className="py-2 text-right">O&apos;rtacha ajratish D</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.byKind.map((k) => (
                          <tr key={k.kind} className="border-b border-line last:border-0">
                            <th scope="row" className="py-2 pr-3 font-medium">
                              {QUIZ_KIND_LABEL[k.kind]}
                            </th>
                            <td className="py-2 pr-3 text-right tabular-nums">{k.questions}</td>
                            <td className="py-2 pr-3 text-right tabular-nums">{k.answers}</td>
                            <td className="py-2 pr-3 text-right tabular-nums">
                              {fmt(k.meanDifficulty)}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              {fmt(k.meanDiscrimination)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableScroll>
                )}
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  p — to&apos;g&apos;ri javob berganlar ulushi (0,3–0,8 — maqbul). D ≥ 0,3 — yaxshi
                  ajratadi, 0,2–0,3 — qoniqarli, &lt; 0,2 — qayta ko&apos;rib chiqing. KR-20 ≥ 0,7 —
                  test ishonchli.
                </p>
              </section>
              <ul className="space-y-4">
                {r.instruments.map((x) => {
                  const flagged = x.questions.filter((q) => q.flag).length;
                  return (
                    <li key={x.id} className="card">
                      <details>
                        <summary className="flex min-h-11 cursor-pointer flex-wrap items-center justify-between gap-3 p-5">
                          <span>
                            <span className="block font-semibold text-ink dark:text-white">
                              {x.title}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {SOURCE[x.source]}
                              {x.lessonTitle ? ` · ${x.lessonTitle}` : ''} · {x.respondents} ta
                              javob · o&apos;rtacha {fmt(x.meanScore, 1)}%
                            </span>
                          </span>
                          <span className="flex flex-wrap items-center gap-3 text-sm">
                            <span>
                              KR-20: <strong>{fmt(x.reliability, 3)}</strong> (
                              {alphaLabel(x.reliability)})
                            </span>
                            {flagged > 0 && (
                              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                                <Icon name="alert" className="size-4" />
                                {flagged} ta savolni ko&apos;rib chiqing
                              </span>
                            )}
                          </span>
                        </summary>
                        <div className="border-t border-line p-5">
                          <TableScroll label={`${x.title} savollari`}>
                            <table className="w-full min-w-[44rem] text-left text-sm">
                              <thead>
                                <tr className="border-b border-line">
                                  <th className="py-2 pr-3">Savol</th>
                                  <th className="py-2 pr-3">Tur</th>
                                  <th className="py-2 pr-3 text-right">n</th>
                                  <th className="py-2 pr-3 text-right">p</th>
                                  <th className="py-2 pr-3 text-right">D</th>
                                  <th className="py-2 pr-3 text-right">r</th>
                                  <th className="py-2">Belgi</th>
                                </tr>
                              </thead>
                              <tbody>
                                {x.questions.map((q) => (
                                  <tr key={q.id} className="border-b border-line last:border-0">
                                    <td className="max-w-md py-2 pr-3">{q.prompt}</td>
                                    <td className="py-2 pr-3">{QUIZ_KIND_LABEL[q.kind]}</td>
                                    <td className="py-2 pr-3 text-right tabular-nums">{q.n}</td>
                                    <td className="py-2 pr-3 text-right tabular-nums">
                                      {fmt(q.difficulty)}
                                    </td>
                                    <td className="py-2 pr-3 text-right tabular-nums">
                                      {fmt(q.discrimination)}
                                    </td>
                                    <td className="py-2 pr-3 text-right tabular-nums">
                                      {fmt(q.pointBiserial)}
                                    </td>
                                    <td className="py-2">
                                      {q.flag ? (
                                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                                          <Icon name="alertCircle" className="size-4" />
                                          {ITEM_FLAG_LABEL[q.flag]}
                                        </span>
                                      ) : (
                                        '—'
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </TableScroll>
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        }
      </LoadState>
    </>
  );
}
