'use client';

import type { MeResponse, Role } from '@webdizayn/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CourseList } from '@/components/course-list';
import { Button, LoadState, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useApi } from '@/lib/use-api';

const ROLE_LABEL: Record<Role, string> = {
  STUDENT: 'Talaba',
  TEACHER: "O'qituvchi",
  ORG_ADMIN: 'Administrator',
};

const linkClass = 'text-sm font-semibold text-brand-700 underline dark:text-brand-300';

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useApi<MeResponse>('/auth/me');

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  return (
    <LoadState state={state}>
      {(me) => (
        <>
          <PageHeader
            crumbs={[{ href: '/', label: 'Bosh sahifa' }]}
            title={`Xush kelibsiz, ${me.fullName}`}
            subtitle="O'qishni davom ettiring yoki yangi kursni tanlang."
            actions={
              <>
                <Link href="/analytics" className="btn btn-accent">
                  Natijalarim
                </Link>
                <Link href="/portfolio" className="btn btn-accent">
                  Portfolio
                </Link>
                <Button
                  variant="secondary"
                  onClick={logout}
                  className="border-white/60 bg-transparent text-white hover:border-white hover:text-white dark:bg-transparent"
                >
                  Chiqish
                </Button>
              </>
            }
          />
          <div className="space-y-12">
            {me.memberships.map((m) => (
              <section key={m.organizationId} className="space-y-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-2xl font-bold">{m.organizationName}</h2>
                  <span className="section-eyebrow">{ROLE_LABEL[m.role]}</span>
                  {m.role === 'ORG_ADMIN' && (
                    <>
                      <Link href={`/orgs/${m.organizationId}/analytics`} className={linkClass}>
                        Tashkilot analitikasi
                      </Link>
                      <Link href={`/orgs/${m.organizationId}/admin/groups`} className={linkClass}>
                        Guruhlar va talabalar
                      </Link>
                      <Link href={`/orgs/${m.organizationId}/admin/teachers`} className={linkClass}>
                        O‘qituvchilar
                      </Link>
                    </>
                  )}
                  {(m.role === 'TEACHER' || m.role === 'ORG_ADMIN') && (
                    <Link href={`/orgs/${m.organizationId}/groups`} className={linkClass}>
                      Guruh paneli
                    </Link>
                  )}
                </div>
                <CourseList orgId={m.organizationId} role={m.role} />
              </section>
            ))}
          </div>
        </>
      )}
    </LoadState>
  );
}
