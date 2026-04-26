import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("app-surface border-dashed p-8 text-center", className)}>
      <div className="mx-auto max-w-xl">
        <h3 className="text-lg font-semibold text-zinc-50">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
