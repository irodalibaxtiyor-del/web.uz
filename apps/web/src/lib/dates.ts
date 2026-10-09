const MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Local date and time in Uzbek, e.g. "9-oktabr 2026, 16:31". Browsers' `uz` locale data
 * is incomplete (Chrome prints "2026 M10 9"), so the format is built by hand.
 */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()}-${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** ISO timestamp → value for `<input type="datetime-local">` in the browser's time zone. */
export function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** `datetime-local` value (local time) → ISO timestamp with offset, or null when empty. */
export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
