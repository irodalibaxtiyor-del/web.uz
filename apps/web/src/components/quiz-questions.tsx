'use client';

import { BLANK_RE, type QuizAnswer, type QuizItem, type QuizViewQuestion } from '@webdizayn/shared';
import { useId, useState, type DragEvent } from 'react';
import { Icon } from './icons';
import { OptionText } from './markdown';

/**
 * Student inputs for every quiz question kind. Each one works with a mouse, a keyboard and a
 * touch screen: drag & drop is an extra on top of buttons and selects, never the only way.
 */

export type AnswerPatch = Partial<Omit<QuizAnswer, 'questionId'>>;

export function QuestionInput({
  q,
  answer,
  onChange,
}: {
  q: QuizViewQuestion;
  answer: QuizAnswer | undefined;
  onChange: (patch: AnswerPatch) => void;
}) {
  switch (q.kind) {
    case 'SINGLE':
    case 'MULTIPLE':
      return <Choice q={q} answer={answer} onChange={onChange} />;
    case 'TRUE_FALSE':
      return <TrueFalse q={q} answer={answer} onChange={onChange} />;
    case 'FILL_BLANK':
    case 'CODE_FILL':
      return <Blanks q={q} answer={answer} onChange={onChange} />;
    case 'MATCHING':
      return <Matching q={q} answer={answer} onChange={onChange} />;
    case 'ORDERING':
      return <Ordering q={q} answer={answer} onChange={onChange} />;
    case 'CATEGORIZE':
      return <Categorize q={q} answer={answer} onChange={onChange} />;
  }
}

export const KIND_HINT: Partial<Record<QuizViewQuestion['kind'], string>> = {
  MULTIPLE: "Bir nechta to'g'ri javob bo'lishi mumkin",
  TRUE_FALSE: "Fikr to'g'rimi yoki noto'g'ri?",
  FILL_BLANK: "Bo'sh joylarga javobni yozing",
  CODE_FILL: "Kodning bo'sh joylarini to'ldiring",
  MATCHING: 'Chapdagi har bir elementga mos javobni tanlang',
  ORDERING: "Elementlarni to'g'ri tartibga qo'ying: sudrang yoki strelkalarni bosing",
  CATEGORIZE:
    "Har bir elementni o'z guruhiga joylang: sudrang yoki elementni, so'ng guruhni bosing",
};

type Props<K extends QuizViewQuestion['kind']> = {
  q: Extract<QuizViewQuestion, { kind: K }>;
  answer: QuizAnswer | undefined;
  onChange: (patch: AnswerPatch) => void;
};

const optionRow =
  'flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-canvas dark:hover:bg-slate-800/60';

function Choice({ q, answer, onChange }: Props<'SINGLE' | 'MULTIPLE'>) {
  const multiple = q.kind === 'MULTIPLE';
  const chosen = answer?.optionIds ?? [];
  return (
    <div className="space-y-1">
      {q.options.map((o) => (
        <label key={o.id} className={optionRow}>
          <input
            type={multiple ? 'checkbox' : 'radio'}
            name={q.id}
            value={o.id}
            checked={chosen.includes(o.id)}
            onChange={(e) =>
              onChange({
                optionIds: multiple
                  ? e.target.checked
                    ? [...chosen, o.id]
                    : chosen.filter((x) => x !== o.id)
                  : [o.id],
              })
            }
            className="mt-1 size-4"
          />
          <span className="quiz-option">
            <OptionText>{o.text}</OptionText>
          </span>
        </label>
      ))}
    </div>
  );
}

function TrueFalse({ q, answer, onChange }: Props<'TRUE_FALSE'>) {
  const chosen = answer?.optionIds[0];
  return (
    <div className="flex flex-wrap gap-3">
      {(
        [
          ['true', "To'g'ri", 'checkCircle'],
          ['false', "Noto'g'ri", 'circleX'],
        ] as const
      ).map(([value, label, icon]) => (
        <label
          key={value}
          className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 px-5 py-2 font-semibold transition-colors ${
            chosen === value
              ? 'border-brand-600 bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
              : 'border-line hover:border-brand-400'
          }`}
        >
          <input
            type="radio"
            name={q.id}
            value={value}
            checked={chosen === value}
            onChange={() => onChange({ optionIds: [value] })}
            className="sr-only"
          />
          <Icon name={icon} className="size-5" />
          {label}
        </label>
      ))}
    </div>
  );
}

/** Splits a template into text parts and gap numbers. */
export function templateParts(template: string): (string | number)[] {
  const out: (string | number)[] = [];
  let last = 0;
  for (const m of template.matchAll(BLANK_RE)) {
    out.push(template.slice(last, m.index));
    out.push(Number(m[1]));
    last = m.index! + m[0].length;
  }
  out.push(template.slice(last));
  return out;
}

function Blanks({ q, answer, onChange }: Props<'FILL_BLANK' | 'CODE_FILL'>) {
  const texts = answer?.texts ?? Array.from({ length: q.blankCount }, () => '');
  const code = q.kind === 'CODE_FILL';
  const set = (n: number, value: string) => {
    const next = Array.from({ length: q.blankCount }, (_, i) => texts[i] ?? '');
    next[n - 1] = value;
    onChange({ texts: next });
  };
  const parts = templateParts(q.template).map((p, i) =>
    typeof p === 'number' ? (
      <input
        key={i}
        aria-label={`${p}-bo'sh joy`}
        value={texts[p - 1] ?? ''}
        onChange={(e) => set(p, e.target.value)}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={200}
        size={Math.max(6, (texts[p - 1] ?? '').length + 2)}
        className={`mx-1 inline-block min-h-9 rounded-md border-2 border-dashed border-brand-400 bg-white px-2 py-0.5 align-baseline text-ink focus:border-solid focus:border-brand-600 focus:outline-none dark:bg-slate-900 dark:text-white ${
          code ? 'font-mono text-sm' : ''
        }`}
      />
    ) : (
      <span key={i}>{p}</span>
    ),
  );
  return code ? (
    <pre className="overflow-x-auto rounded-xl bg-ink p-4 font-mono text-sm leading-9 whitespace-pre-wrap text-slate-100">
      {parts}
    </pre>
  ) : (
    <p className="leading-10 whitespace-pre-wrap">{parts}</p>
  );
}

function Matching({ q, answer, onChange }: Props<'MATCHING'>) {
  const pairs = new Map((answer?.pairs ?? []).map(([l, r]) => [l, r]));
  const used = new Set(pairs.values());
  const set = (left: string, right: string) => {
    const next = new Map(pairs);
    if (right) next.set(left, right);
    else next.delete(left);
    onChange({ pairs: [...next.entries()] });
  };
  return (
    <ul className="space-y-3">
      {q.left.map((l) => {
        const value = pairs.get(l.id) ?? '';
        return (
          <li
            key={l.id}
            className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
          >
            <span className="quiz-option font-medium">
              <OptionText>{l.text}</OptionText>
            </span>
            <Icon name="arrowRight" className="hidden size-5 text-brand-600 sm:block" />
            <select
              aria-label={`${l.text} uchun mos javob`}
              value={value}
              onChange={(e) => set(l.id, e.target.value)}
              className="field"
            >
              <option value="">Tanlang…</option>
              {q.right.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.text}
                  {used.has(r.id) && r.id !== value ? ' (tanlangan)' : ''}
                </option>
              ))}
            </select>
          </li>
        );
      })}
    </ul>
  );
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x!);
  return next;
}

function Ordering({ q, answer, onChange }: Props<'ORDERING'>) {
  const byId = new Map(q.items.map((x) => [x.id, x]));
  const order = (answer?.order?.length === q.items.length ? answer.order : q.items.map((x) => x.id))
    .map((id) => byId.get(id))
    .filter((x): x is QuizItem => !!x);
  const [dragged, setDragged] = useState<number | null>(null);
  const [said, setSaid] = useState('');
  const shift = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    const next = move(order, from, to);
    onChange({ order: next.map((x) => x.id) });
    setSaid(`«${order[from]!.text}» ${to + 1}-o'ringa ko'chirildi`);
  };
  return (
    <>
      <ol className="space-y-2">
        {order.map((x, i) => (
          <li
            key={x.id}
            draggable
            onDragStart={(e) => {
              setDragged(i);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragged !== null) shift(dragged, i);
              setDragged(null);
            }}
            onDragEnd={() => setDragged(null)}
            className={`flex items-center gap-2 rounded-xl border bg-panel p-2 pl-3 ${
              dragged === i ? 'border-brand-500 opacity-60' : 'border-line'
            } cursor-grab active:cursor-grabbing`}
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {i + 1}
            </span>
            <span className="quiz-option min-w-0 flex-1">
              <OptionText>{x.text}</OptionText>
            </span>
            <button
              type="button"
              onClick={() => shift(i, i - 1)}
              disabled={i === 0}
              aria-label={`«${x.text}» ni yuqoriga`}
              className="grid size-11 place-items-center rounded-lg text-brand-700 hover:bg-brand-50 disabled:opacity-30 sm:size-9 dark:text-brand-300 dark:hover:bg-brand-950"
            >
              <Icon name="arrowUp" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => shift(i, i + 1)}
              disabled={i === order.length - 1}
              aria-label={`«${x.text}» ni pastga`}
              className="grid size-11 place-items-center rounded-lg text-brand-700 hover:bg-brand-50 disabled:opacity-30 sm:size-9 dark:text-brand-300 dark:hover:bg-brand-950"
            >
              <Icon name="arrowDown" className="size-5" />
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </>
  );
}

function Categorize({ q, answer, onChange }: Props<'CATEGORIZE'>) {
  const id = useId();
  const placed = new Map((answer?.placements ?? []).map(([item, group]) => [item, group]));
  const [selected, setSelected] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [said, setSaid] = useState('');
  const textOf = (itemId: string) => q.items.find((x) => x.id === itemId)?.text ?? '';

  const place = (itemId: string, groupId: string | null) => {
    const next = new Map(placed);
    if (groupId) next.set(itemId, groupId);
    else next.delete(itemId);
    onChange({ placements: [...next.entries()] });
    setSelected(null);
    const g = q.groups.find((x) => x.id === groupId);
    setSaid(
      g ? `«${textOf(itemId)}» «${g.text}» guruhiga qo'yildi` : `«${textOf(itemId)}» qaytarildi`,
    );
  };

  const drop = (groupId: string | null) => (e: DragEvent) => {
    e.preventDefault();
    setOver(null);
    const itemId = e.dataTransfer.getData('text/plain');
    if (q.items.some((x) => x.id === itemId)) place(itemId, groupId);
  };

  const chip = (x: QuizItem, inGroup: boolean) => (
    <li key={x.id} className="flex items-stretch">
      <button
        type="button"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', x.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onClick={() => setSelected(selected === x.id ? null : x.id)}
        aria-pressed={selected === x.id}
        className={`quiz-option min-h-11 cursor-grab rounded-lg border-2 px-3 py-1.5 text-left text-sm font-medium transition-colors active:cursor-grabbing ${
          selected === x.id
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-line bg-panel hover:border-brand-400'
        } ${inGroup ? 'rounded-r-none' : ''}`}
      >
        <OptionText>{x.text}</OptionText>
      </button>
      {inGroup && (
        <button
          type="button"
          onClick={() => place(x.id, null)}
          aria-label={`«${x.text}» ni qaytarish`}
          className="grid min-h-11 w-9 place-items-center rounded-r-lg border-2 border-l-0 border-line bg-panel text-slate-600 hover:text-red-700 dark:text-slate-400"
        >
          <Icon name="x" className="size-4" />
        </button>
      )}
    </li>
  );

  const pool = q.items.filter((x) => !placed.has(x.id));
  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver('pool');
        }}
        onDragLeave={() => setOver(null)}
        onDrop={drop(null)}
        className={`rounded-xl border-2 border-dashed p-3 ${over === 'pool' ? 'border-brand-500 bg-brand-50 dark:bg-brand-950' : 'border-line-strong'}`}
      >
        <p id={`${id}-pool`} className="mb-2 text-sm font-semibold text-muted">
          Joylanmagan elementlar ({pool.length})
        </p>
        {pool.length ? (
          <ul aria-labelledby={`${id}-pool`} className="flex flex-wrap gap-2">
            {pool.map((x) => chip(x, false))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Hammasi joylandi.</p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.groups.map((g) => {
          const items = q.items.filter((x) => placed.get(x.id) === g.id);
          return (
            <section
              key={g.id}
              aria-labelledby={`${id}-${g.id}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(g.id);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={drop(g.id)}
              className={`min-h-32 rounded-xl border-2 p-3 transition-colors ${
                over === g.id
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                  : 'border-brand-200 bg-canvas dark:border-brand-900 dark:bg-slate-900'
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 id={`${id}-${g.id}`} className="font-semibold">
                  {g.text}
                </h4>
                {selected && (
                  <button
                    type="button"
                    onClick={() => place(selected, g.id)}
                    className="btn btn-primary min-h-9 px-3 py-1 text-xs"
                  >
                    Shu yerga qo&apos;yish
                  </button>
                )}
              </div>
              {items.length > 0 && (
                <ul className="flex flex-wrap gap-2">{items.map((x) => chip(x, true))}</ul>
              )}
            </section>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {said}
      </p>
    </div>
  );
}
