import { SongForm } from "@/components/songs/song-form";
import { redirectIfNotAdmin } from "@/features/auth/server";

export default async function NewSongPage() {
  await redirectIfNotAdmin("/songs/new");
  return <SongForm mode="create" />;
}

