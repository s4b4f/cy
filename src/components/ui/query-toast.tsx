"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const TOAST_MESSAGE: Record<string, string> = {
  created: "등록되었습니다.",
  updated: "수정되었습니다."
};

export function QueryToast({ toast }: { toast?: string }) {
  const pathname = usePathname();
  const [message, setMessage] = React.useState<string | undefined>(() => (toast ? TOAST_MESSAGE[toast] : undefined));
  const [open, setOpen] = React.useState(Boolean(message));

  React.useEffect(() => {
    const next = toast ? TOAST_MESSAGE[toast] : undefined;
    if (!next) return;
    setMessage(next);
    setOpen(true);
    const t = window.setTimeout(() => setOpen(false), 2200);
    window.history.replaceState(null, "", pathname);
    return () => {
      window.clearTimeout(t);
    };
  }, [toast, pathname]);

  React.useEffect(() => {
    if (!message) return;
    if (open) return;
    const t = window.setTimeout(() => setMessage(undefined), 200);
    return () => window.clearTimeout(t);
  }, [message, open]);

  if (!message || !open) return null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
      )}
      role="status"
    >
      {message}
    </div>
  );
}
