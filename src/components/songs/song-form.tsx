"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button, buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SONG_TYPES, SONG_TYPE_LABEL } from "@/features/songs/constants";
import { songUpsertSchema } from "@/features/songs/schemas";
import type { SongDto, SongRecord, SongType } from "@/features/songs/types";

type FieldErrors = Partial<Record<keyof z.infer<typeof songUpsertSchema>, string>>;

type FormValues = {
  name: string;
  teamName: string;
  playerName: string;
  type: SongType;
  customTypeName: string;
  assetId: string;
};

function toFormValues(song?: SongRecord): FormValues {
  return {
    name: song?.name ?? "",
    teamName: song?.teamName ?? "",
    playerName: song?.playerName ?? "",
    type: (song?.type as SongType) ?? "TEAM",
    customTypeName: song?.customTypeName ?? "",
    assetId: song?.assetId ?? ""
  };
}

function toFieldErrors(zodError: z.ZodError): FieldErrors {
  const flattened = zodError.flatten().fieldErrors;
  const errors: FieldErrors = {};

  (Object.keys(flattened) as Array<keyof typeof flattened>).forEach((key) => {
    const message = flattened[key]?.[0];
    if (message) errors[key as keyof FieldErrors] = message;
  });

  return errors;
}

async function safeJson(response: Response) {
  try {
    return (await response.json()) as {
      success?: boolean;
      data?: {
        fieldErrors?: Record<string, string[]>;
      } & SongDto;
      message?: string;
      error?: string;
    };
  } catch {
    return null;
  }
}

export function SongForm({ mode, song }: { mode: "create" | "edit"; song?: SongRecord }) {
  const router = useRouter();
  const [values, setValues] = React.useState<FormValues>(() => toFormValues(song));
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const isEdit = mode === "edit";
  const nextPath = isEdit && song ? `/songs/${song.id}/edit` : "/songs/new";

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onChangeType(next: SongType) {
    set("type", next);
    if (next !== "CUSTOM") set("customTypeName", "");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = songUpsertSchema.safeParse({
      name: values.name,
      teamName: values.teamName,
      playerName: values.playerName,
      type: values.type,
      customTypeName: values.customTypeName,
      assetId: values.assetId
    });

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch(isEdit ? `/api/songs/${song!.id}` : "/api/songs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data)
      });

      const result = await safeJson(response);

      if (response.status === 401 || result?.error === "UNAUTHORIZED") {
        router.push(`/admin/login?next=${encodeURIComponent(nextPath)}`);
        return;
      }

      if (!response.ok || !result?.success) {
        const serverFieldErrors = (result?.data?.fieldErrors ?? {}) as Record<string, string[]>;
        const merged: FieldErrors = {};

        for (const key of Object.keys(serverFieldErrors)) {
          const message = serverFieldErrors[key]?.[0];
          if (message) merged[key as keyof FieldErrors] = message;
        }

        setErrors(merged);
        setFormError(result?.message ?? "요청에 실패했습니다.");
        return;
      }

      const saved = result.data as SongDto;
      router.push(`/songs/${saved.id}?toast=${isEdit ? "updated" : "created"}`);
      router.refresh();
    } catch {
      setFormError("요청에 실패했습니다. 네트워크 상태를 확인해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  const showCustomTypeName = values.type === "CUSTOM";
  const playerNameRequired = values.type === "PLAYER";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>{isEdit ? "응원가 수정" : "응원가 등록"}</CardTitle>
        <Link href={isEdit ? `/songs/${song!.id}` : "/songs"} className={buttonClassName({ variant: "secondary" })}>
          취소
        </Link>
      </CardHeader>

      <CardContent>
        {formError ? (
          <div className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-sm text-red-200">
            {formError}
          </div>
        ) : null}

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">
              응원가 이름 <span className="text-red-300">*</span>
            </label>
            <Input value={values.name} onChange={(event) => set("name", event.target.value)} />
            {errors.name ? <p className="mt-1 text-xs text-red-300">{errors.name}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              팀 이름 <span className="text-red-300">*</span>
            </label>
            <Input value={values.teamName} onChange={(event) => set("teamName", event.target.value)} />
            {errors.teamName ? <p className="mt-1 text-xs text-red-300">{errors.teamName}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              선수 이름{" "}
              {playerNameRequired ? <span className="text-red-300">*</span> : <span className="text-zinc-500">(선택)</span>}
            </label>
            <Input value={values.playerName} onChange={(event) => set("playerName", event.target.value)} />
            {errors.playerName ? <p className="mt-1 text-xs text-red-300">{errors.playerName}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              타입 <span className="text-red-300">*</span>
            </label>
            <Select value={values.type} onChange={(event) => onChangeType(event.target.value as SongType)}>
              {SONG_TYPES.map((type) => (
                <option key={type} value={type}>
                  {SONG_TYPE_LABEL[type]}
                </option>
              ))}
            </Select>
            {errors.type ? <p className="mt-1 text-xs text-red-300">{errors.type}</p> : null}
          </div>

          {showCustomTypeName ? (
            <div>
              <label className="mb-1 block text-xs text-zinc-400">
                기타 타입 이름 <span className="text-red-300">*</span>
              </label>
              <Input value={values.customTypeName} onChange={(event) => set("customTypeName", event.target.value)} />
              {errors.customTypeName ? <p className="mt-1 text-xs text-red-300">{errors.customTypeName}</p> : null}
            </div>
          ) : (
            <div className="hidden md:block" />
          )}

          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              로블록스 assetId <span className="text-red-300">*</span>
            </label>
            <Input value={values.assetId} onChange={(event) => set("assetId", event.target.value)} inputMode="numeric" />
            {errors.assetId ? <p className="mt-1 text-xs text-red-300">{errors.assetId}</p> : null}
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? (isEdit ? "저장 중..." : "등록 중...") : isEdit ? "저장" : "등록"}
            </Button>
            <Link href="/songs" className={buttonClassName({ variant: "ghost" })}>
              목록으로
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

