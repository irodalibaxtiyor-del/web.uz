import { slugify } from '@webdizayn/shared';

/**
 * Normalizes a slug while it is being typed: the same rules as `slugify`, except that one
 * trailing "-" is kept so the next word can still be typed ("html " → "html-").
 */
export function typedSlug(value: string): string {
  const slug = slugify(value);
  return slug && /[\s\-_.]$/.test(value) ? `${slug}-` : slug;
}

/** State of the slug field: generated from the title until the person edits it. */
export interface SlugDraft {
  slug: string;
  /** True once edited by hand; the title then no longer overwrites it. */
  manual: boolean;
}

export function slugFromTitle(draft: SlugDraft, title: string): SlugDraft {
  return draft.manual ? draft : { slug: slugify(title), manual: false };
}

/** Clearing the field hands it back to the title. */
export function slugEdited(value: string, title: string): SlugDraft {
  const slug = typedSlug(value);
  return slug ? { slug, manual: true } : { slug: slugify(title), manual: false };
}
