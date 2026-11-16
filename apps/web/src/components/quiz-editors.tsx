'use client';

import {
  blankNumbers,
  QUIZ_KIND_LABEL,
  QUIZ_MAX_BLANKS,
  QUIZ_QUESTION_KINDS,
  type QuizQuestion,
  type QuizQuestionKind,
} from '@webdizayn/shared';
import type { ReactNode } from 'react';
import { Icon } from './icons';
import { Button, inputClass } from './ui';

/** Teacher-side editors for every quiz question kind (kept in the stored schema shape). */

export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const item = (prefix: string) => ({ id: newId(prefix), text: '' });

/** An empty question of `kind`, keeping the prompt (and id) when switching kinds. */
export function blankQuestion(
  kind: QuizQuestionKind = 'SINGLE',
  keep?: QuizQuestion,
): QuizQuestion {
  const base = { id: keep?.id ?? newId('q'), prompt: keep?.prompt ?? '' };
  switch (kind) {
    case 'SINGLE':
    case 'MULTIPLE': {
      if (keep && (keep.kind === 'SINGLE' || keep.kind === 'MULTIPLE')) {
        return {
          ...keep,
          kind,
          correct: kind === 'SINGLE' ? keep.correct.slice(0, 1) : keep.correct,
        };
      }
      const a = item('o');
      return { ...base, kind, options: [a, item('o')], correct: [a.id] };
    }
    case 'TRUE_FALSE':
      return { ...base, kind, answer: true };
    case 'FILL_BLANK':
    case 'CODE_FILL':
      if (keep && (keep.kind === 'FILL_BLANK' || keep.kind === 'CODE_FILL'))
        return { ...keep, kind };
      return {
        ...base,
        kind,
        template: kind === 'CODE_FILL' ? '.box {\n  {{1}}: flex;\n}' : 'Matn {{1}} davomi.',
        blanks: [{ accepted: [''], caseSensitive: kind === 'CODE_FILL' }],
      };
    case 'MATCHING': {
      const l1 = item('l');
      const l2 = item('l');
      const r1 = item('r');
      const r2 = item('r');
      return {
        ...base,
        kind,
        left: [l1, l2],
        right: [r1, r2],
        pairs: [
          [l1.id, r1.id],
          [l2.id, r2.id],
        ],
      };
    }
    case 'ORDERING':
      return { ...base, kind, items: [item('i'), item('i'), item('i')] };
    case 'CATEGORIZE': {
      const g1 = item('g');
      const g2 = item('g');
      return {
        ...base,
        kind,
        groups: [g1, g2],
        items: [
          { ...item('i'), group: g1.id },
          { ...item('i'), group: g2.id },
        ],
      };
    }
  }
}

function IconButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: 'x' | 'arrowUp' | 'arrowDown' | 'trash';
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-11 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-canvas hover:text-red-700 disabled:opacity-30 sm:size-9 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <Icon name={icon} className="size-4" />
    </button>
  );
}

function AddButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button variant="secondary" onClick={onClick} disabled={disabled}>
      <Icon name="plus" className="size-4" />
      {children}
    </Button>
  );
}

export function KindSelect({
  value,
  label,
  onChange,
}: {
  value: QuizQuestionKind;
  label: string;
  onChange: (k: QuizQuestionKind) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as QuizQuestionKind)}
      className={`${inputClass} w-auto`}
    >
      {QUIZ_QUESTION_KINDS.map((k) => (
        <option key={k} value={k}>
          {QUIZ_KIND_LABEL[k]}
        </option>
      ))}
    </select>
  );
}

/** Body editor of one question (prompt and kind are edited by the caller). */
export function QuestionBodyEditor({
  q,
  n,
  onChange,
}: {
  q: QuizQuestion;
  /** 1-based question number, for labels. */
  n: number;
  onChange: (q: QuizQuestion) => void;
}) {
  switch (q.kind) {
    case 'SINGLE':
    case 'MULTIPLE':
      return <ChoiceEditor q={q} n={n} onChange={onChange} />;
    case 'TRUE_FALSE':
      return (
        <fieldset className="flex flex-wrap gap-4">
          <legend className="mb-1 text-sm font-medium">To&apos;g&apos;ri javob</legend>
          {(
            [
              [true, "To'g'ri"],
              [false, "Noto'g'ri"],
            ] as const
          ).map(([v, label]) => (
            <label key={label} className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                name={`${q.id}-tf`}
                checked={q.answer === v}
                onChange={() => onChange({ ...q, answer: v })}
              />
              {label}
            </label>
          ))}
        </fieldset>
      );
    case 'FILL_BLANK':
    case 'CODE_FILL':
      return <BlanksEditor q={q} n={n} onChange={onChange} />;
    case 'MATCHING':
      return <MatchingEditor q={q} n={n} onChange={onChange} />;
    case 'ORDERING':
      return <OrderingEditor q={q} n={n} onChange={onChange} />;
    case 'CATEGORIZE':
      return <CategorizeEditor q={q} n={n} onChange={onChange} />;
  }
}

type EditorProps<K extends QuizQuestionKind> = {
  q: Extract<QuizQuestion, { kind: K }>;
  n: number;
  onChange: (q: QuizQuestion) => void;
};

function ChoiceEditor({ q, n, onChange }: EditorProps<'SINGLE' | 'MULTIPLE'>) {
  const toggle = (id: string, checked: boolean) =>
    onChange({
      ...q,
      correct:
        q.kind === 'SINGLE'
          ? [id]
          : checked
            ? [...q.correct, id]
            : q.correct.filter((c) => c !== id),
    });
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-sm font-medium">
        Variantlar (to&apos;g&apos;risini belgilang)
      </legend>
      {q.options.map((o, oi) => (
        <div key={o.id} className="flex items-center gap-2">
          <input
            type={q.kind === 'SINGLE' ? 'radio' : 'checkbox'}
            name={`${q.id}-correct`}
            aria-label={`${oi + 1}-variant to'g'ri`}
            checked={q.correct.includes(o.id)}
            onChange={(e) => toggle(o.id, e.target.checked)}
            className="size-4"
          />
          <input
            aria-label={`${n}-savol, ${oi + 1}-variant`}
            value={o.text}
            onChange={(e) =>
              onChange({
                ...q,
                options: q.options.map((x) => (x.id === o.id ? { ...x, text: e.target.value } : x)),
              })
            }
            placeholder={`${oi + 1}-variant`}
            className={inputClass}
          />
          <IconButton
            label={`${oi + 1}-variantni o'chirish`}
            icon="x"
            disabled={q.options.length <= 2}
            onClick={() =>
              onChange({
                ...q,
                options: q.options.filter((x) => x.id !== o.id),
                correct: q.correct.filter((c) => c !== o.id),
              })
            }
          />
        </div>
      ))}
      <AddButton
        disabled={q.options.length >= 8}
        onClick={() => onChange({ ...q, options: [...q.options, item('o')] })}
      >
        Variant
      </AddButton>
    </fieldset>
  );
}

function BlanksEditor({ q, n, onChange }: EditorProps<'FILL_BLANK' | 'CODE_FILL'>) {
  const code = q.kind === 'CODE_FILL';
  // Keep one answer row per gap marker found in the template.
  const setTemplate = (template: string) => {
    const count = Math.min(QUIZ_MAX_BLANKS, Math.max(0, ...blankNumbers(template)));
    const blanks = Array.from(
      { length: count },
      (_, i) => q.blanks[i] ?? { accepted: [''], caseSensitive: code },
    );
    onChange({ ...q, template, blanks });
  };
  const addGap = () => setTemplate(`${q.template}{{${q.blanks.length + 1}}}`);
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor={`${q.id}-tpl`} className="text-sm font-medium">
          {code ? 'Kod' : 'Matn'} — bo&apos;sh joylar <code>{'{{1}}'}</code>, <code>{'{{2}}'}</code>{' '}
          … ko&apos;rinishida
        </label>
        <textarea
          id={`${q.id}-tpl`}
          value={q.template}
          onChange={(e) => setTemplate(e.target.value)}
          rows={code ? 5 : 3}
          spellCheck={!code}
          className={`${inputClass} ${code ? 'font-mono text-sm' : ''}`}
        />
        <AddButton disabled={q.blanks.length >= QUIZ_MAX_BLANKS} onClick={addGap}>
          Bo&apos;sh joy
        </AddButton>
      </div>
      <ol className="space-y-2">
        {q.blanks.map((b, i) => (
          <li key={i} className="grid gap-2 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
            <span className="text-sm font-semibold">{`{{${i + 1}}}`}</span>
            <input
              aria-label={`${n}-savol, ${i + 1}-bo'sh joy javoblari`}
              value={b.accepted.join(' | ')}
              onChange={(e) =>
                onChange({
                  ...q,
                  blanks: q.blanks.map((x, j) =>
                    j === i
                      ? { ...x, accepted: e.target.value.split('|').map((s) => s.trim()) }
                      : x,
                  ),
                })
              }
              placeholder="To'g'ri javob | boshqa yozilishi"
              className={`${inputClass} ${code ? 'font-mono text-sm' : ''}`}
            />
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={b.caseSensitive}
                onChange={(e) =>
                  onChange({
                    ...q,
                    blanks: q.blanks.map((x, j) =>
                      j === i ? { ...x, caseSensitive: e.target.checked } : x,
                    ),
                  })
                }
              />
              Katta-kichik harf muhim
            </label>
          </li>
        ))}
      </ol>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Bir nechta to&apos;g&apos;ri yozilishini <code>|</code> bilan ajrating. Javob boshidagi va
        oxiridagi bo&apos;sh joylar hisobga olinmaydi
        {code ? ', koddagi bo‘sh joylar umuman e’tiborga olinmaydi' : ''}.
      </p>
    </div>
  );
}

function MatchingEditor({ q, n, onChange }: EditorProps<'MATCHING'>) {
  const rightOf = new Map(q.pairs.map(([l, r]) => [l, r]));
  const paired = new Set(rightOf.values());
  const distractors = q.right.filter((r) => !paired.has(r.id));
  const setText = (list: 'left' | 'right', id: string, text: string) =>
    onChange({ ...q, [list]: q[list].map((x) => (x.id === id ? { ...x, text } : x)) });
  const addPair = () => {
    const l = item('l');
    const r = item('r');
    onChange({
      ...q,
      left: [...q.left, l],
      right: [...q.right, r],
      pairs: [...q.pairs, [l.id, r.id]],
    });
  };
  const removePair = (leftId: string) => {
    const r = rightOf.get(leftId);
    onChange({
      ...q,
      left: q.left.filter((x) => x.id !== leftId),
      right: q.right.filter((x) => x.id !== r),
      pairs: q.pairs.filter(([l]) => l !== leftId),
    });
  };
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">To&apos;g&apos;ri juftliklar</p>
      <ul className="space-y-2">
        {q.left.map((l, i) => {
          const r = q.right.find((x) => x.id === rightOf.get(l.id));
          return (
            <li key={l.id} className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto]">
              <input
                aria-label={`${n}-savol, ${i + 1}-juftlik chap tomoni`}
                value={l.text}
                onChange={(e) => setText('left', l.id, e.target.value)}
                placeholder="Chap (masalan, <ul>)"
                className={inputClass}
              />
              <Icon name="arrowRight" className="hidden size-5 text-brand-600 sm:block" />
              <input
                aria-label={`${n}-savol, ${i + 1}-juftlik o'ng tomoni`}
                value={r?.text ?? ''}
                onChange={(e) => r && setText('right', r.id, e.target.value)}
                placeholder="Mos javob"
                className={inputClass}
              />
              <IconButton
                label={`${i + 1}-juftlikni o'chirish`}
                icon="x"
                disabled={q.left.length <= 2}
                onClick={() => removePair(l.id)}
              />
            </li>
          );
        })}
      </ul>
      <AddButton disabled={q.left.length >= 8 || q.right.length >= 10} onClick={addPair}>
        Juftlik
      </AddButton>
      <p className="pt-2 text-sm font-medium">Chalg&apos;ituvchi javoblar (ixtiyoriy)</p>
      <ul className="space-y-2">
        {distractors.map((r, i) => (
          <li key={r.id} className="flex items-center gap-2">
            <input
              aria-label={`${n}-savol, ${i + 1}-chalg'ituvchi javob`}
              value={r.text}
              onChange={(e) => setText('right', r.id, e.target.value)}
              className={inputClass}
            />
            <IconButton
              label={`${i + 1}-chalg'ituvchi javobni o'chirish`}
              icon="x"
              onClick={() => onChange({ ...q, right: q.right.filter((x) => x.id !== r.id) })}
            />
          </li>
        ))}
      </ul>
      <AddButton
        disabled={q.right.length >= 10}
        onClick={() => onChange({ ...q, right: [...q.right, item('r')] })}
      >
        Chalg&apos;ituvchi javob
      </AddButton>
    </div>
  );
}

function OrderingEditor({ q, n, onChange }: EditorProps<'ORDERING'>) {
  const shift = (from: number, to: number) => {
    const items = [...q.items];
    const [x] = items.splice(from, 1);
    items.splice(to, 0, x!);
    onChange({ ...q, items });
  };
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Elementlar to&apos;g&apos;ri tartibda (talabaga aralashtirib ko&apos;rsatiladi)
      </p>
      <ol className="space-y-2">
        {q.items.map((x, i) => (
          <li key={x.id} className="flex items-center gap-2">
            <span className="w-6 text-right text-sm font-semibold">{i + 1}.</span>
            <input
              aria-label={`${n}-savol, ${i + 1}-element`}
              value={x.text}
              onChange={(e) =>
                onChange({
                  ...q,
                  items: q.items.map((y) => (y.id === x.id ? { ...y, text: e.target.value } : y)),
                })
              }
              className={inputClass}
            />
            <IconButton
              label="Yuqoriga"
              icon="arrowUp"
              disabled={i === 0}
              onClick={() => shift(i, i - 1)}
            />
            <IconButton
              label="Pastga"
              icon="arrowDown"
              disabled={i === q.items.length - 1}
              onClick={() => shift(i, i + 1)}
            />
            <IconButton
              label={`${i + 1}-elementni o'chirish`}
              icon="x"
              disabled={q.items.length <= 2}
              onClick={() => onChange({ ...q, items: q.items.filter((y) => y.id !== x.id) })}
            />
          </li>
        ))}
      </ol>
      <AddButton
        disabled={q.items.length >= 10}
        onClick={() => onChange({ ...q, items: [...q.items, item('i')] })}
      >
        Element
      </AddButton>
    </div>
  );
}

function CategorizeEditor({ q, n, onChange }: EditorProps<'CATEGORIZE'>) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Guruhlar</p>
      <ul className="space-y-2">
        {q.groups.map((g, i) => (
          <li key={g.id} className="flex items-center gap-2">
            <input
              aria-label={`${n}-savol, ${i + 1}-guruh nomi`}
              value={g.text}
              onChange={(e) =>
                onChange({
                  ...q,
                  groups: q.groups.map((x) => (x.id === g.id ? { ...x, text: e.target.value } : x)),
                })
              }
              placeholder={`${i + 1}-guruh`}
              className={inputClass}
            />
            <IconButton
              label={`${i + 1}-guruhni o'chirish`}
              icon="x"
              disabled={q.groups.length <= 2}
              onClick={() => {
                const groups = q.groups.filter((x) => x.id !== g.id);
                onChange({
                  ...q,
                  groups,
                  items: q.items.map((x) =>
                    x.group === g.id ? { ...x, group: groups[0]!.id } : x,
                  ),
                });
              }}
            />
          </li>
        ))}
      </ul>
      <AddButton
        disabled={q.groups.length >= 5}
        onClick={() => onChange({ ...q, groups: [...q.groups, item('g')] })}
      >
        Guruh
      </AddButton>
      <p className="pt-2 text-sm font-medium">Elementlar va ularning guruhi</p>
      <ul className="space-y-2">
        {q.items.map((x, i) => (
          <li key={x.id} className="grid items-center gap-2 sm:grid-cols-[1fr_14rem_auto]">
            <input
              aria-label={`${n}-savol, ${i + 1}-element`}
              value={x.text}
              onChange={(e) =>
                onChange({
                  ...q,
                  items: q.items.map((y) => (y.id === x.id ? { ...y, text: e.target.value } : y)),
                })
              }
              className={inputClass}
            />
            <select
              aria-label={`${i + 1}-element guruhi`}
              value={x.group}
              onChange={(e) =>
                onChange({
                  ...q,
                  items: q.items.map((y) => (y.id === x.id ? { ...y, group: e.target.value } : y)),
                })
              }
              className={inputClass}
            >
              {q.groups.map((g, gi) => (
                <option key={g.id} value={g.id}>
                  {g.text || `${gi + 1}-guruh`}
                </option>
              ))}
            </select>
            <IconButton
              label={`${i + 1}-elementni o'chirish`}
              icon="x"
              disabled={q.items.length <= 2}
              onClick={() => onChange({ ...q, items: q.items.filter((y) => y.id !== x.id) })}
            />
          </li>
        ))}
      </ul>
      <AddButton
        disabled={q.items.length >= 12}
        onClick={() =>
          onChange({ ...q, items: [...q.items, { ...item('i'), group: q.groups[0]!.id }] })
        }
      >
        Element
      </AddButton>
    </div>
  );
}
