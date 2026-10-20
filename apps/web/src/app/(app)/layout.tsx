import { cookies } from 'next/headers';
import { AppShell } from '@/components/app-shell';
import { SIDEBAR_COOKIE } from '@/lib/shell';

/** Signed-in area: full-window app shell (top bar + sidebar + scrolling content). */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Read on the server so the sidebar renders in its saved state without a flash.
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === 'collapsed';
  return <AppShell initialCollapsed={collapsed}>{children}</AppShell>;
}
