'use client';

import type { MeResponse, Role } from '@webdizayn/shared';
import Link from 'next/link';
import { CourseList } from '@/components/course-list';
import { LoadState, PageHeader } from '@/components/ui';
import { useApi } from '@/lib/use-api';

const ROLE_LABEL: Record<Role, string> = {
  STUDENT: 'Talaba',
  TEACHER: "O'qituvchi",
  ORG_ADMIN: 'Administrator',
};

const linkClass = 'text-sm font-semibold text-brand-700 underline dark:text-brand-300';

export default function DashboardPage() {
  const { state } = useApi<MeResponse>('/auth/me');

  return (
    <LoadState state={state}>
      {(me) => (
        <>
          <PageHeader
            crumbs={[{ href: '/', label: 'Bosh sahifa' }]}
            title={`Xush kelibsiz, ${me.fullName}`}
            subtitle="O'qishni davom ettiring yoki yangi kursni tanlang."
          />
          <div className="space-y-12">
            {me.memberships.map((m) => (
              <section key={m.organizationId} className="space-y-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-2xl font-bold">{m.organizationName}</h2>
                  <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">
                    {ROLE_LABEL[m.role]}
                  </span>
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
