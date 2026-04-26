"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SONG_TYPES, SONG_TYPE_LABEL } from "@/features/songs/constants";
import type { SongListQuery, SongType } from "@/features/songs/types";

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

  function submit(event: React.FormEvent) {
    event.preventDefault();

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
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Field label="응원가 이름" className="xl:col-span-2">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 승리를 위하여" />
        </Field>

        <Field label="팀 이름">
          <Input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="예: 서울" />
        </Field>

        <Field label="선수 이름">
          <Input value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="예: 홍길동" />
        </Field>

        <Field label="타입">
          <Select value={type} onChange={(event) => setType(event.target.value as SongType | "")}>
            <option value="">전체</option>
            {SONG_TYPES.map((item) => (
              <option key={item} value={item}>
                {SONG_TYPE_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>

        {showCustomTypeName ? (
          <Field label="기타 타입 이름" className="xl:col-span-2">
            <Input
              value={customTypeName}
              onChange={(event) => setCustomTypeName(event.target.value)}
              placeholder="예: 이벤트, 콜앤리스폰스"
            />
          </Field>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit">검색 적용</Button>
        <Button type="button" variant="secondary" onClick={reset}>
          필터 초기화
        </Button>
        <span className="text-xs text-zinc-500">정렬은 최신 등록순으로 고정됩니다.</span>
      </div>
    </form>
  );
}
