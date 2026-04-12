import { RequestList } from "@/components/requests/request-list";
import { isAdminSession } from "@/features/auth/server";
import { listSongRequests, parseSongRequestSearchParams } from "@/features/requests/service";
import type { SongRequestListQuery } from "@/features/requests/types";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function coerceFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function RequestsPage({ searchParams }: PageProps) {
  const [params, admin] = await Promise.all([searchParams, isAdminSession()]);

  let query: SongRequestListQuery = {};
  try {
    query = parseSongRequestSearchParams(params);
  } catch {
    query = {};
  }

  const submitted = coerceFirst(params.submitted) === "1";
  const requests = await listSongRequests(query);

  return <RequestList requests={requests} query={query} canManage={admin} submitted={submitted} />;
}

