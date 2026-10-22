'use client';

import {
  CHAT_MESSAGE_MAX,
  CHAT_QUICK_QUESTIONS,
  chatContactSchema,
  type ChatAnswer,
} from '@webdizayn/shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { send } from '@/lib/api';
import { loadHistory, paragraphs, safeLinks, saveHistory, type ChatEntry } from '@/lib/chat';
import { Icon } from './icons';
import { Button, ErrorText } from './ui';

/** Full-window pages with their own bottom toolbar: the launcher would cover it. */
const HIDDEN_ON = /^\/kitoblar\/[^/]+$/;
/** Phones: the chat takes the whole screen as a modal dialog. */
const PHONE = '(max-width: 639px)';

const WELCOME =
  'Assalomu alaykum! Men platforma yordamchisiman. Kurslar, yo‘nalishlar va platformadan foydalanish haqida so‘rang — kirill yozuvida ham tushunaman.';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

/**
 * Help chatbot: a floating button bottom-right that opens the chat. Answers come from the
 * server's knowledge base; the conversation is kept in sessionStorage only. Everything shown
 * is plain text and internal links.
 */
export function ChatWidget() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [view, setView] = useState<'chat' | 'contact'>('chat');
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // History lives in sessionStorage, read after mount (not available while rendering on the server).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
    setEntries(loadHistory());
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) saveHistory(entries);
  }, [entries, loaded]);

  const show = useCallback((asModal: boolean) => {
    const d = dialogRef.current;
    if (!d) return;
    if (d.open) d.close();
    setModal(asModal);
    if (asModal) d.showModal();
    else d.show();
  }, []);

  const openChat = () => {
    setOpen(true);
    show(matchMedia(PHONE).matches);
  };

  const closeChat = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  // Rotating a phone or resizing the window switches between full screen and the panel.
  useEffect(() => {
    if (!open) return;
    const mq = matchMedia(PHONE);
    const onChange = () => show(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open, show]);

  // Focus the input when the chat opens or returns from the contact form.
  useEffect(() => {
    if (open && view === 'chat') inputRef.current?.focus();
  }, [open, view]);

  // Keep the newest message in view.
  useEffect(() => {
    if (open) logEndRef.current?.scrollIntoView({ block: 'end' });
  }, [entries, pending, open]);

  // Going to a page where the launcher is hidden closes the chat (the dialog unmounts there).
  const hidden = HIDDEN_ON.test(pathname);
  const [wasHidden, setWasHidden] = useState(hidden);
  if (hidden !== wasHidden) {
    setWasHidden(hidden);
    if (hidden) setOpen(false);
  }

  async function ask(question: string) {
    const text = question.trim().slice(0, CHAT_MESSAGE_MAX);
    if (!text || pending) return;
    setError(null);
    setDraft('');
    setEntries((e) => [...e, { id: newId(), role: 'user', text }]);
    setPending(true);
    // A short pause so the typing indicator does not flicker on fast answers.
    const [res] = await Promise.all([
      send<ChatAnswer>('POST', '/public/chat', { message: text }),
      new Promise((r) => setTimeout(r, 350)),
    ]);
    setPending(false);
    if (!res.ok) {
      setError(
        res.status === 429
          ? 'Juda tez-tez so‘rayapsiz. Bir daqiqadan keyin qayta urinib ko‘ring.'
          : res.message,
      );
      return;
    }
    setEntries((e) => [
      ...e,
      {
        id: newId(),
        role: 'bot',
        text: res.data.answer,
        links: safeLinks(res.data.links),
        suggestions: res.data.suggestions.slice(0, 4),
        matched: res.data.matched,
      },
    ]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(draft);
  }

  function newChat() {
    setEntries([]);
    setError(null);
    setView('chat');
    inputRef.current?.focus();
  }

  const lastUnanswered = [...entries].reverse().find((e, i, arr) => {
    const next = arr[i - 1];
    return e.role === 'user' && next?.role === 'bot' && next.matched === false;
  });
  const last = entries.at(-1);

  if (hidden) return null;

  return (
    <>
      {!(open && modal) && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => (open ? closeChat() : openChat())}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Yordamchi chatni yopish' : 'Yordamchi chatni ochish'}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 grid size-14 place-items-center rounded-full bg-brand-600 text-white shadow-overlay transition hover:bg-brand-700 focus-visible:outline-offset-4"
        >
          <Icon name={open ? 'x' : 'message'} className="size-7" />
        </button>
      )}

      <dialog
        ref={dialogRef}
        id={panelId}
        aria-labelledby={titleId}
        onCancel={(e) => {
          e.preventDefault();
          closeChat();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            closeChat();
          }
        }}
        className={`z-30 m-0 flex-col overflow-hidden bg-panel p-0 text-fg open:flex ${
          modal
            ? 'fixed inset-0 h-dvh max-h-none w-full max-w-none'
            : 'fixed top-auto right-4 bottom-24 left-auto h-[min(36rem,calc(100dvh-8rem))] w-[24rem] max-w-[calc(100vw-2rem)] rounded-panel border border-line shadow-overlay'
        }`}
      >
        <header
          className={`flex items-center gap-2 border-b border-line bg-brand-700 px-4 py-3 text-white ${
            modal ? 'pt-[max(0.75rem,env(safe-area-inset-top))]' : ''
          }`}
        >
          <Icon name="message" className="size-6" />
          <div className="min-w-0 flex-1">
            <h2
              id={titleId}
              className="font-display text-base leading-tight font-semibold text-white"
            >
              Yordamchi
            </h2>
            <p className="truncate text-sm text-white">Platforma bo‘yicha savollar</p>
          </div>
          <button
            type="button"
            onClick={newChat}
            className="grid size-11 place-items-center rounded-control text-white hover:bg-white/15"
            aria-label="Yangi suhbat"
            title="Yangi suhbat"
          >
            <Icon name="refresh" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="grid size-11 place-items-center rounded-control text-white hover:bg-white/15"
            aria-label="Chatni yopish"
            title="Yopish"
          >
            <Icon name="x" />
          </button>
        </header>

        {view === 'contact' ? (
          <ContactForm
            initialMessage={lastUnanswered?.text ?? ''}
            page={pathname}
            onBack={() => setView('chat')}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div role="log" aria-live="polite" aria-label="Suhbat">
                <ol className="space-y-3">
                  <BotBubble text={WELCOME} />
                  {entries.length === 0 && (
                    <li>
                      <Chips items={[...CHAT_QUICK_QUESTIONS]} onPick={ask} disabled={pending} />
                    </li>
                  )}
                  {entries.map((e) =>
                    e.role === 'user' ? (
                      <li key={e.id} className="flex justify-end">
                        <p className="max-w-[85%] rounded-card rounded-br-sm bg-brand-600 px-3.5 py-2 text-sm whitespace-pre-wrap break-words text-white">
                          <span className="sr-only">Siz: </span>
                          {e.text}
                        </p>
                      </li>
                    ) : (
                      <BotBubble
                        key={e.id}
                        text={e.text}
                        links={e.links}
                        onNavigate={() => modal && closeChat()}
                      >
                        {e.matched === false && (
                          <Button
                            variant="secondary"
                            className="mt-2"
                            onClick={() => setView('contact')}
                          >
                            <Icon name="headset" className="size-4" />
                            Administratorga yozish
                          </Button>
                        )}
                        {e === last && !!e.suggestions?.length && (
                          <Chips items={e.suggestions} onPick={ask} disabled={pending} />
                        )}
                      </BotBubble>
                    ),
                  )}
                  {pending && (
                    <li className="flex" role="status">
                      <span className="flex gap-1 rounded-card rounded-bl-sm bg-subtle px-4 py-3">
                        {[0, 200, 400].map((d) => (
                          <span
                            key={d}
                            aria-hidden="true"
                            className="size-2 animate-shimmer rounded-full bg-muted"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                        <span className="sr-only">Javob yozilmoqda…</span>
                      </span>
                    </li>
                  )}
                </ol>
              </div>
              {error && (
                <div className="mt-3">
                  <ErrorText>{error}</ErrorText>
                </div>
              )}
              <div ref={logEndRef} />
            </div>

            <div className="border-t border-line px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <label htmlFor={`${panelId}-q`} className="sr-only">
                  Savolingiz
                </label>
                <input
                  ref={inputRef}
                  id={`${panelId}-q`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={CHAT_MESSAGE_MAX}
                  autoComplete="off"
                  placeholder="Savolingizni yozing…"
                  className="field min-w-0 flex-1"
                />
                <button
                  type="submit"
                  disabled={pending || !draft.trim()}
                  className="btn btn-primary min-w-11 px-3"
                  aria-label="Yuborish"
                >
                  <Icon name="send" className="size-5" />
                </button>
              </form>
              <button
                type="button"
                onClick={() => setView('contact')}
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-medium text-brand-700 underline-offset-4 hover:underline dark:text-brand-300"
              >
                <Icon name="headset" className="size-4" />
                Administratorga yozish
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

function BotBubble({
  text,
  links = [],
  onNavigate,
  children,
}: {
  text: string;
  links?: { label: string; href: string }[];
  onNavigate?: () => void;
  children?: ReactNode;
}) {
  return (
    <li className="max-w-[92%]">
      <div data-chat="bot" className="rounded-card rounded-bl-sm bg-subtle px-3.5 py-2.5 text-sm">
        <span className="sr-only">Yordamchi: </span>
        {paragraphs(text).map((lines, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : undefined}>
            {lines.map((l, j) => (
              <span key={j} className="block">
                {l}
              </span>
            ))}
          </p>
        ))}
        {links.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  className="inline-flex min-h-9 items-center gap-1 rounded-full border border-brand-600 bg-panel px-3 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-200 dark:hover:bg-brand-950"
                >
                  {l.label}
                  <Icon name="arrowRight" className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </li>
  );
}

function Chips({
  items,
  onPick,
  disabled,
}: {
  items: string[];
  onPick: (q: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Tez savollar">
      {items.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onPick(q)}
          className="min-h-11 rounded-full border border-line-strong bg-panel px-3 py-1.5 text-left text-sm hover:border-brand-500 hover:text-brand-700 disabled:opacity-60 dark:hover:text-brand-200"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

function ContactForm({
  initialMessage,
  page,
  onBack,
}: {
  initialMessage: string;
  page: string;
  onBack: () => void;
}) {
  const id = useId();
  const [form, setForm] = useState({ name: '', contact: '', message: initialMessage });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => firstRef.current?.focus(), []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = chatContactSchema.safeParse({ ...form, page: page.slice(0, 200) });
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const i of parsed.error.issues) {
        const k = i.path[0] as keyof typeof form;
        if (k in form && !next[k]) next[k] = i.code === 'too_big' ? 'Juda uzun' : i.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    const res = await send('POST', '/public/chat/contact', parsed.data);
    setPending(false);
    if (!res.ok) {
      setError(
        res.status === 429
          ? 'Ko‘p murojaat yuborildi. Birozdan keyin qayta urinib ko‘ring.'
          : res.message,
      );
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-1 flex-col items-start gap-4 p-5" role="status">
        <Icon name="checkCircle" className="size-8 text-emerald-700 dark:text-emerald-400" />
        <p className="font-semibold">Murojaatingiz yuborildi.</p>
        <p className="text-sm text-muted">
          Administrator siz qoldirgan manzil orqali bog‘lanadi. Shoshilinch bo‘lsa, o‘qituvchingizga
          ham ayting.
        </p>
        <Button variant="secondary" onClick={onBack}>
          <Icon name="arrowLeft" className="size-4" />
          Chatga qaytish
        </Button>
      </div>
    );
  }

  const field = (
    key: keyof typeof form,
    label: string,
    props: { hint?: string; multiline?: boolean; autoComplete?: string } = {},
  ) => {
    const fid = `${id}-${key}`;
    const describedBy = [props.hint && `${fid}-hint`, errors[key] && `${fid}-err`]
      .filter(Boolean)
      .join(' ');
    const common = {
      id: fid,
      value: form[key],
      onChange: (e: { target: { value: string } }) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
      'aria-invalid': errors[key] ? true : undefined,
      'aria-describedby': describedBy || undefined,
      className: 'field w-full',
    };
    return (
      <div className="space-y-1">
        <label htmlFor={fid} className="text-sm font-medium">
          {label}
        </label>
        {props.multiline ? (
          <textarea {...common} rows={4} maxLength={1000} />
        ) : (
          <input
            {...common}
            ref={key === 'name' ? firstRef : undefined}
            autoComplete={props.autoComplete}
            maxLength={key === 'name' ? 100 : 120}
          />
        )}
        {props.hint && (
          <p id={`${fid}-hint`} className="text-xs text-muted">
            {props.hint}
          </p>
        )}
        {errors[key] && (
          <p id={`${fid}-err`} className="text-sm text-red-700 dark:text-red-400">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={submit} noValidate className="flex-1 space-y-4 overflow-y-auto p-5">
      <div className="space-y-1">
        <h3 className="font-semibold">Administratorga yozish</h3>
        <p className="text-sm text-muted">
          Ma’lumotlaringizni faqat platforma administratori ko‘radi.
        </p>
      </div>
      {field('name', 'Ismingiz', { autoComplete: 'name' })}
      {field('contact', 'Bog‘lanish uchun', {
        hint: 'Telefon, Telegram (@username) yoki email',
        autoComplete: 'tel',
      })}
      {field('message', 'Savolingiz', { multiline: true })}
      {error && <ErrorText>{error}</ErrorText>}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          <Icon
            name={pending ? 'loader' : 'send'}
            className={`size-4 ${pending ? 'animate-spin' : ''}`}
          />
          {pending ? 'Yuborilmoqda…' : 'Yuborish'}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Bekor qilish
        </Button>
      </div>
    </form>
  );
}
