"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button, buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
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
    <div className="page-grid">
      <PageHeader
        eyebrow={isEdit ? "응원가 수정" : "응원가 등록"}
        title={isEdit ? "기존 응원가 수정" : "신규 응원가 등록"}
        description="DB 구조는 그대로 유지하고 입력 경험만 다시 구성했습니다. 클라이언트와 서버는 같은 Zod 스키마를 사용합니다."
        actions={
          <>
            <Link href={isEdit ? `/songs/${song!.id}` : "/songs"} className={buttonClassName({ variant: "secondary" })}>
              취소
            </Link>
            <Button type="submit" form="song-form" disabled={submitting}>
              {submitting ? (isEdit ? "수정 중..." : "등록 중...") : isEdit ? "수정 저장" : "응원가 등록"}
            </Button>
          </>
        }
      />

      {formError ? (
        <div className="rounded-2xl border border-rose-900/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{formError}</div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form id="song-form" onSubmit={submit} className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>응원가 이름과 팀, 선수 이름을 입력합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="응원가 이름" required error={errors.name} className="md:col-span-2">
                <Input value={values.name} onChange={(event) => set("name", event.target.value)} placeholder="예: 승리를 위하여" />
              </Field>

              <Field label="팀 이름" required error={errors.teamName}>
                <Input value={values.teamName} onChange={(event) => set("teamName", event.target.value)} placeholder="예: 서울" />
              </Field>

              <Field label="선수 이름" required={playerNameRequired} optional={!playerNameRequired} error={errors.playerName}>
                <Input value={values.playerName} onChange={(event) => set("playerName", event.target.value)} placeholder="예: 홍길동" />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>분류 정보</CardTitle>
              <CardDescription>타입에 따라 필수 입력 항목이 달라집니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="타입" required error={errors.type}>
                <Select value={values.type} onChange={(event) => onChangeType(event.target.value as SongType)}>
                  {SONG_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {SONG_TYPE_LABEL[type]}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="기타 타입 이름"
                required={showCustomTypeName}
                optional={!showCustomTypeName}
                error={errors.customTypeName}
                hint="CUSTOM 타입일 때만 실제 저장됩니다."
              >
                <Input
                  value={values.customTypeName}
                  onChange={(event) => set("customTypeName", event.target.value)}
                  placeholder="예: 이벤트"
                  disabled={!showCustomTypeName}
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로블록스 정보</CardTitle>
              <CardDescription>assetId는 문자열로 일관되게 저장됩니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="Roblox assetId" required error={errors.assetId}>
                <Input value={values.assetId} onChange={(event) => set("assetId", event.target.value)} inputMode="numeric" placeholder="예: 1234567890" />
              </Field>
            </CardContent>
          </Card>
        </form>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>입력 기준</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-zinc-400">
              <p>모든 문자열은 trim 처리 후 저장됩니다.</p>
              <p>PLAYER 타입은 선수 이름이 필수입니다.</p>
              <p>CUSTOM 타입은 기타 타입 이름이 필수입니다.</p>
              <p>서버에서도 같은 스키마로 재검증하므로 클라이언트 우회 입력은 저장되지 않습니다.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 메모</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-zinc-400">
              <p>현재는 Song 단일 테이블 중심 구조입니다.</p>
              <p>추후 Team, Player를 분리하더라도 이 폼은 서비스 계층 매핑만 바꾸면 재사용 가능합니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
