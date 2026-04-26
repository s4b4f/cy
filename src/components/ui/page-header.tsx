import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, meta, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="space-y-3">
        {eyebrow ? (
          <span className="inline-flex w-fit items-center rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs font-medium text-zinc-300">
            {eyebrow}
          </span>
        ) : null}

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">{description}</p> : null}
        </div>

        {meta ? <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">{meta}</div> : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
