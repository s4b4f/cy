"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AssetIdCopy({ assetId, className }: { assetId: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(assetId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      alert("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-zinc-200",
          "hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        )}
        aria-label="assetId 복사"
        title="클릭하여 복사"
      >
        {assetId}
      </button>
      <Button type="button" size="sm" variant="secondary" onClick={copy}>
        {copied ? "복사됨" : "복사"}
      </Button>
    </div>
  );
}
