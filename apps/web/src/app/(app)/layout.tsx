export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-surface/70 dark:bg-slate-950">
      <div className="container-page max-w-6xl py-10">{children}</div>
    </div>
  );
}
