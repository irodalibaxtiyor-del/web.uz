'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Icon } from './icons';
import { Button } from './ui';

/**
 * Modal dialog built on the native <dialog> element: `showModal()` gives focus containment,
 * Esc to close, an inert page behind it and focus restoration for free. Full screen on phones,
 * a centred panel from `sm` up. Clicking the backdrop closes it.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      // React's autoFocus is not an attribute, so showModal() cannot see it; focus explicitly.
      el.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the <dialog> element itself (not its content) is a backdrop click.
        if (e.target === e.currentTarget) onClose();
      }}
      className={`m-0 h-dvh max-h-none w-full max-w-none bg-panel p-0 text-fg backdrop:bg-slate-950/55 sm:m-auto sm:h-fit sm:max-h-[85dvh] sm:rounded-panel sm:border sm:border-line sm:shadow-overlay ${
        size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg'
      }`}
    >
      {open && (
        <div className="flex h-full flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-4">
            <div className="min-w-0 space-y-1">
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              {description && (
                <p id={descId} className="text-sm text-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Yopish"
              className="-mr-2 grid size-11 shrink-0 place-items-center rounded-control text-muted hover:bg-subtle hover:text-ink dark:hover:text-white"
            >
              <Icon name="x" />
            </button>
          </header>
          {children && <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>}
          {footer && (
            <footer className="mt-auto flex flex-col-reverse gap-2 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6 sm:pb-4">
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}

type ConfirmOptions = {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` styles the confirm button red and focuses Cancel first. */
  tone?: 'primary' | 'danger';
};

type PromptOptions = {
  title: string;
  label: string;
  message?: ReactNode;
  defaultValue?: string;
  confirmLabel?: string;
  multiline?: boolean;
  required?: boolean;
};

type Request =
  | { id: number; kind: 'confirm'; opts: ConfirmOptions; resolve: (v: boolean) => void }
  | { id: number; kind: 'prompt'; opts: PromptOptions; resolve: (v: string | null) => void };

let current: Request | null = null;
let nextId = 1;
let hostMounted = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function settle(value: boolean | string | null) {
  const req = current;
  current = null;
  emit();
  if (!req) return;
  if (req.kind === 'confirm') req.resolve(value === true);
  else req.resolve(typeof value === 'string' ? value : null);
}

/** Asks the user to confirm an action. Resolves `false` on Cancel, Esc or backdrop click. */
export function confirmDialog(opts: ConfirmOptions | string): Promise<boolean> {
  const o = typeof opts === 'string' ? { message: opts } : opts;
  if (!hostMounted) return Promise.resolve(window.confirm(String(o.message)));
  settle(null);
  return new Promise((resolve) => {
    current = { id: nextId++, kind: 'confirm', opts: o, resolve };
    emit();
  });
}

/** Asks for a line (or a paragraph) of text. Resolves `null` when dismissed. */
export function promptDialog(opts: PromptOptions): Promise<string | null> {
  if (!hostMounted) return Promise.resolve(window.prompt(opts.label, opts.defaultValue));
  settle(null);
  return new Promise((resolve) => {
    current = { id: nextId++, kind: 'prompt', opts, resolve };
    emit();
  });
}

/** Renders the dialogs requested through `confirmDialog` / `promptDialog`. Mounted once. */
export function DialogHost() {
  const req = useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

  useEffect(() => {
    hostMounted = true;
    return () => {
      hostMounted = false;
    };
  }, []);

  if (!req) return null;
  return req.kind === 'confirm' ? (
    <ConfirmView key={req.id} opts={req.opts} />
  ) : (
    <PromptView key={req.id} opts={req.opts} />
  );
}

function ConfirmView({ opts }: { opts: ConfirmOptions }) {
  const danger = opts.tone === 'danger';
  return (
    <Dialog
      open
      onClose={() => settle(false)}
      title={opts.title ?? 'Tasdiqlang'}
      footer={
        <>
          <Button
            variant="secondary"
            data-autofocus={danger ? '' : undefined}
            onClick={() => settle(false)}
          >
            {opts.cancelLabel ?? 'Bekor qilish'}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            data-autofocus={danger ? undefined : ''}
            onClick={() => settle(true)}
          >
            {opts.confirmLabel ?? 'Davom etish'}
          </Button>
        </>
      }
    >
      <div className="leading-relaxed">{opts.message}</div>
    </Dialog>
  );
}

function PromptView({ opts }: { opts: PromptOptions }) {
  const [value, setValue] = useState(opts.defaultValue ?? '');
  const id = useId();
  const formId = useId();
  const blocked = opts.required && !value.trim();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!blocked) settle(value);
  }

  return (
    <Dialog
      open
      onClose={() => settle(null)}
      title={opts.title}
      description={opts.message}
      footer={
        <>
          <Button variant="secondary" onClick={() => settle(null)}>
            Bekor qilish
          </Button>
          <Button type="submit" form={formId} disabled={blocked}>
            {opts.confirmLabel ?? 'Saqlash'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} className="space-y-1.5">
        <label htmlFor={id} className="text-sm font-medium">
          {opts.label}
        </label>
        {opts.multiline ? (
          <textarea
            id={id}
            data-autofocus
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="field"
          />
        ) : (
          <input
            id={id}
            data-autofocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="field"
          />
        )}
      </form>
    </Dialog>
  );
}
