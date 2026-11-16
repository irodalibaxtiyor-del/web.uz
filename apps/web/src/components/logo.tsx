import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-display text-xl font-bold text-ink dark:text-white ${className}`}
      aria-label="WEBDIZAYN.UZ bosh sahifa"
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-xl bg-brand-600 font-mono text-sm text-white shadow-[0_6px_16px_-6px_rgb(0_113_220/0.7)]"
      >
        &lt;/&gt;
      </span>
      <span>
        WEBDIZAYN<span className="text-brand-600 dark:text-brand-400">.UZ</span>
      </span>
    </Link>
  );
}
