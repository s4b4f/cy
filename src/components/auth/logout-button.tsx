"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function logout() {
    setSubmitting(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      router.push("/songs");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Button type="button" variant="secondary" onClick={logout} disabled={submitting}>
      {submitting ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}

