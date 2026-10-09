import { checkRulesSchema, type CheckRule } from '@webdizayn/shared';

export const EXAMPLE_RULES = [
  {
    id: 'has-h1',
    title: 'Sahifada bitta asosiy sarlavha (h1) bor',
    hint: 'Sarlavha uchun <h1> tegidan foydalaning',
    assert: { type: 'count', selector: 'h1', min: 1, max: 1 },
  },
  {
    id: 'h1-text',
    title: 'Sarlavhada ismingiz yozilgan',
    hidden: true,
    assert: { type: 'text', selector: 'h1', match: 'contains', value: 'Salom' },
  },
  {
    id: 'mobile-font',
    title: 'Mobil ekranda sarlavha kichrayadi',
    viewport: { width: 375, height: 667 },
    assert: { type: 'style', selector: 'h1', property: 'font-size', value: '24px' },
  },
  {
    id: 'button-click',
    title: 'Tugma bosilganda xabar chiqadi',
    actions: [{ type: 'click', selector: 'button' }],
    assert: { type: 'text', selector: '#message', value: 'Bosildi' },
  },
];

export type ParsedRules = { ok: true; rules: CheckRule[] } | { ok: false; errors: string[] };

export function parseRules(text: string): ParsedRules {
  let json: unknown;
  try {
    json = text.trim() === '' ? [] : JSON.parse(text);
  } catch {
    return { ok: false, errors: ['JSON formati noto‘g‘ri'] };
  }
  const parsed = checkRulesSchema.safeParse(json);
  if (parsed.success) return { ok: true, rules: parsed.data };
  return {
    ok: false,
    errors: parsed.error.issues
      .slice(0, 6)
      .map((i) => `${i.path.length ? i.path.join('.') + ': ' : ''}${i.message}`),
  };
}
