'use client';

import type { MeResponse, Role } from '@webdizayn/shared';
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
              <Button
                variant="secondary"
                onClick={logout}
                className="border-white/40 bg-white/10 text-white hover:border-white hover:text-white dark:bg-white/10"
              >
                Chiqish
              </Button>
            }
          />
          <div className="space-y-12">
            {me.memberships.map((m) => (
              <section key={m.organizationId} className="space-y-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-2xl font-bold">{m.organizationName}</h2>
                  <span className="section-eyebrow">{ROLE_LABEL[m.role]}</span>
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
