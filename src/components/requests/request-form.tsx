"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button, buttonClassName } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requestCreateSchema } from "@/features/requests/schemas";
import { SONG_TYPES, SONG_TYPE_LABEL } from "@/features/songs/constants";
import type { SongType } from "@/features/songs/types";

type FieldErrors = Partial<Record<keyof z.infer<typeof requestCreateSchema>, string>>;

type FormValues = {
  requesterName: string;
  requestNote: string;
  name: string;
  teamName: string;
  playerName: string;
  type: SongType;
  customTypeName: string;
  assetId: string;
};

const initialValues: FormValues = {
  requesterName: "",
  requestNote: "",
  name: "",
  teamName: "",
  playerName: "",
  type: "TEAM",
  customTypeName: "",
  assetId: ""
};

function toFieldErrors(zodError: z.ZodError): FieldErrors {
  const flattened = zodError.flatten().fieldErrors;
  const errors: FieldErrors = {};

  (Object.keys(flattened) as Array<keyof typeof flattened>).forEach((key) => {
    const message = flattened[key]?.[0];
    if (message) {
      errors[key as keyof FieldErrors] = message;
    }
  });

  return errors;
}

export function RequestForm() {
  const router = useRouter();
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onChangeType(next: SongType) {
    set("type", next);
    if (next !== "CUSTOM") {
      set("customTypeName", "");
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = requestCreateSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(parsed.data)
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: { fieldErrors?: Record<string, string[]> };
      };

      if (!response.ok || !result.success) {
        const serverFieldErrors = result.data?.fieldErrors ?? {};
        const merged: FieldErrors = {};

        for (const key of Object.keys(serverFieldErrors)) {
          const message = serverFieldErrors[key]?.[0];
          if (message) {
            merged[key as keyof FieldErrors] = message;
          }
        }

        setErrors(merged);
        setFormError(result.message ?? "신청 등록에 실패했습니다.");
        return;
      }

      router.push("/requests?submitted=1");
      router.refresh();
    } catch {
      setFormError("신청 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>응원가 신청</CardTitle>
        <Link href="/requests" className={buttonClassName({ variant: "secondary" })}>
          목록으로
        </Link>
      </CardHeader>
      <CardContent>
        {formError ? (
          <div className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 p-3 text-sm text-red-200">
            {formError}
          </div>
        ) : null}

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">신청자 이름 (선택)</label>
            <Input value={values.requesterName} onChange={(event) => set("requesterName", event.target.value)} />
            {errors.requesterName ? <p className="mt-1 text-xs text-red-300">{errors.requesterName}</p> : null}
          </div>

          <div>
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
            <label className="mb-1 block text-xs text-zinc-400">선수 이름 (선택)</label>
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

          {values.type === "CUSTOM" ? (
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

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">
              로블록스 assetId <span className="text-red-300">*</span>
            </label>
            <Input value={values.assetId} onChange={(event) => set("assetId", event.target.value)} inputMode="numeric" />
            {errors.assetId ? <p className="mt-1 text-xs text-red-300">{errors.assetId}</p> : null}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-zinc-400">신청 메모 (선택)</label>
            <Textarea
              value={values.requestNote}
              onChange={(event) => set("requestNote", event.target.value)}
              placeholder="추가 설명이나 참고 내용을 적어주세요."
            />
            {errors.requestNote ? <p className="mt-1 text-xs text-red-300">{errors.requestNote}</p> : null}
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "신청 중..." : "신청 등록"}
            </Button>
            <Link href="/songs" className={buttonClassName({ variant: "ghost" })}>
              응원가 목록 보기
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
