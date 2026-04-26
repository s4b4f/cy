import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "default" | "blue" | "emerald" | "amber";

const toneClassName: Record<Tone, string> = {
  default: "from-zinc-900/80 to-zinc-950/80",
  blue: "from-sky-950/50 to-zinc-950/80",
  emerald: "from-emerald-950/50 to-zinc-950/80",
  amber: "from-amber-950/50 to-zinc-950/80"
};

type StatCardProps = {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  tone?: Tone;
};

export function StatCard({ label, value, description, tone = "default" }: StatCardProps) {
  return (
    <div
      className={cn(
        "app-surface bg-gradient-to-br p-5",
        toneClassName[tone]
      )}
    >
      <div className="text-sm font-medium text-zinc-300">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">{value}</div>
      {description ? <div className="mt-2 text-sm leading-6 text-zinc-400">{description}</div> : null}
    </div>
  );
}
