import type { Metadata } from "next";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { SiteNav } from "@/components/layout/site-nav";
import { buttonClassName } from "@/components/ui/button";
import { isAdminSession } from "@/features/auth/server";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "응원가 DB",
  description: "로블록스 야구게임 응원가 DB 관리자"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdminSession();

  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body className={cn("min-h-screen")}>
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

          <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
            <div className="app-shell">
              <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/" className="space-y-1">
                    <div className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">Roblox Baseball</div>
                    <div className="text-lg font-semibold tracking-tight text-zinc-50">응원가 DB</div>
                  </Link>

                  <div className="hidden h-10 w-px bg-zinc-800 lg:block" />
                  <div className="hidden text-sm text-zinc-500 lg:block">조회, 신청, 승인 흐름을 한 화면에서 관리합니다.</div>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <SiteNav />

                  <div className="flex flex-wrap items-center gap-2">
                    {admin ? (
                      <>
                        <span className="inline-flex items-center rounded-full border border-emerald-900/60 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-200">
                          관리자 로그인 상태
                        </span>
                        <Link href="/songs/new" className={buttonClassName({ variant: "default", size: "sm" })}>
                          응원가 등록
                        </Link>
                        <LogoutButton />
                      </>
                    ) : (
                      <>
                        <Link href="/requests/new" className={buttonClassName({ variant: "outline", size: "sm" })}>
                          응원가 신청
                        </Link>
                        <Link href="/admin/login" className={buttonClassName({ variant: "secondary", size: "sm" })}>
                          관리자 로그인
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="app-shell py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
