import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { isAdminSession } from "@/features/auth/server";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function coerceFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const admin = await isAdminSession();
  if (admin) {
    redirect("/songs");
  }

  const params = await searchParams;
  const nextPath = coerceFirst(params.next) ?? "/songs";

  return <AdminLoginForm nextPath={nextPath} />;
}

