"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import type { SongListQuery, SongType } from "@/features/songs/types";
import { SONG_TYPES, SONG_TYPE_LABEL } from "@/features/songs/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  initialQuery: SongListQuery;
};

function buildQueryString(query: SongListQuery) {
  const params = new URLSearchParams();
  if (query.name) params.set("name", query.name);
  if (query.teamName) params.set("teamName", query.teamName);
  if (query.playerName) params.set("playerName", query.playerName);
  if (query.type) params.set("type", query.type);
  if (query.customTypeName) params.set("customTypeName", query.customTypeName);
  const queryString = params.toString();
  return queryString.length > 0 ? `?${queryString}` : "";
}

export function SongFilter({ initialQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = React.useState(initialQuery.name ?? "");
  const [teamName, setTeamName] = React.useState(initialQuery.teamName ?? "");
  const [playerName, setPlayerName] = React.useState(initialQuery.playerName ?? "");
  const [type, setType] = React.useState<SongType | "">((initialQuery.type as SongType | undefined) ?? "");
  const [customTypeName, setCustomTypeName] = React.useState(initialQuery.customTypeName ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const nextQuery: SongListQuery = {
      name: name.trim() || undefined,
      teamName: teamName.trim() || undefined,
      playerName: playerName.trim() || undefined,
      type: type || undefined,
      customTypeName: customTypeName.trim() || undefined
    };
    router.push(`${pathname}${buildQueryString(nextQuery)}`);
  }

  function reset() {
    setName("");
    setTeamName("");
    setPlayerName("");
    setType("");
    setCustomTypeName("");
    router.push(pathname);
  }

  const showCustomTypeName = type === "CUSTOM" || customTypeName.trim().length > 0;

  return (
    <Card>
      <CardContent className="pt-5">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-6">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">응원가 이름</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="예) 승리를 위하여" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">팀 이름</label>
            <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="예) 서울" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">선수 이름</label>
            <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="예) 홍길동" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">타입</label>
            <Select value={type} onChange={(e) => setType(e.target.value as SongType | "")}>
              <option value="">전체</option>
              {SONG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {SONG_TYPE_LABEL[t]}
                </option>
              ))}
            </Select>
          </div>

          {showCustomTypeName ? (
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-zinc-400">기타 타입 이름 (CUSTOM)</label>
              <Input
                value={customTypeName}
                onChange={(e) => setCustomTypeName(e.target.value)}
                placeholder="예) 이벤트 / 콜앤리스폰스"
              />
            </div>
          ) : (
            <div className="hidden md:block md:col-span-2" />
          )}

          <div className="flex items-end gap-2 md:col-span-2">
            <Button type="submit">검색</Button>
            <Button type="button" variant="secondary" onClick={reset}>
              초기화
            </Button>
          </div>
        </form>

        <div className="mt-3 text-xs text-zinc-500">정렬: 최신순</div>
      </CardContent>
    </Card>
  );
}

