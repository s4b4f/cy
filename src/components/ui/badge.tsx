import * as React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        variant === "default" && "bg-zinc-100 text-zinc-950",
        variant === "secondary" && "bg-zinc-800 text-zinc-100",
        variant === "outline" && "border border-zinc-700 text-zinc-100",
        variant === "destructive" && "bg-red-950 text-red-200",
        className
      )}
      {...props}
    />
  );
}

