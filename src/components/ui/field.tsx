import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, required, optional, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-200">
        <span>{label}</span>
        {required ? <span className="text-rose-300">*</span> : null}
        {!required && optional ? <span className="text-xs font-normal text-zinc-500">선택</span> : null}
      </label>

      {children}

      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}
