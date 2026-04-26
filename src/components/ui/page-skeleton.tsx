export function PageSkeleton({ title }: { title: string }) {
  return (
    <div className="page-grid">
      <div className="space-y-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-zinc-900" />
        <div className="h-10 w-52 animate-pulse rounded-xl bg-zinc-900" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-xl bg-zinc-900" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="app-surface h-32 animate-pulse bg-zinc-900/70" />
        ))}
      </div>

      <div className="app-surface p-5">
        <div className="text-lg font-semibold text-zinc-50">{title}</div>
        <div className="mt-4 grid gap-3">
          <div className="h-12 animate-pulse rounded-xl bg-zinc-900" />
          <div className="h-72 animate-pulse rounded-2xl bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}
