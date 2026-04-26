import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 text-sm text-zinc-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
