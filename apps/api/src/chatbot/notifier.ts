/**
 * Where a new "contact the administrator" request is announced besides the admin panel.
 * The default does nothing; a Telegram bot (or email) implementation plugs in here later
 * through the CONTACT_NOTIFIER provider. Implementations receive personal data, so they must
 * not log it, and their failures never fail the request (it is already saved).
 */
export interface ContactNotice {
  id: string;
  name: string;
  contact: string;
  message: string;
  page: string | null;
  createdAt: Date;
}

export interface ContactNotifier {
  readonly name: string;
  notify(notice: ContactNotice): Promise<void>;
}

export const CONTACT_NOTIFIER = Symbol('CONTACT_NOTIFIER');

export class NoopContactNotifier implements ContactNotifier {
  readonly name = 'none';
  async notify(): Promise<void> {}
}
