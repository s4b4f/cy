import { notFound } from "next/navigation";

import { SongDetail } from "@/components/songs/song-detail";
import { QueryToast } from "@/components/ui/query-toast";
import { isAdminSession } from "@/features/auth/server";
import { getSong } from "@/features/songs/service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function coerceFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SongDetailPage({ params, searchParams }: PageProps) {
  const [{ id }, sp, admin] = await Promise.all([params, searchParams, isAdminSession()]);
  const toast = coerceFirst(sp.toast);

  const song = await getSong(id);
  if (!song) notFound();

  return (
    <div className="grid gap-4">
      <QueryToast toast={toast} />
      <SongDetail song={song} canManage={admin} />
    </div>
  );
}

