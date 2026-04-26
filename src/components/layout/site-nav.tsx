"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "대시보드" },
  { href: "/songs", label: "응원가 목록" },
  { href: "/requests", label: "신청 게시판" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonClassName({
                variant: active ? "secondary" : "ghost",
                size: "sm"
              }),
              active && "text-zinc-50"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
