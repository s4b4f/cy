import { notFound } from "next/navigation";

import { SongForm } from "@/components/songs/song-form";
import { redirectIfNotAdmin } from "@/features/auth/server";
import { getSong } from "@/features/songs/service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSongPage({ params }: PageProps) {
  const { id } = await params;
  await redirectIfNotAdmin(`/songs/${id}/edit`);

  const song = await getSong(id);
  if (!song) notFound();

  return <SongForm mode="edit" song={song} />;
}

