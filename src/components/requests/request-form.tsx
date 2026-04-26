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

  const showCustomTypeName = values.type === "CUSTOM";

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="응원가 신청"
        title="신규 응원가 요청"
        description="누구나 신청할 수 있지만 바로 공개되지는 않습니다. 관리자가 검토 후 승인하면 실제 응원가 목록에 반영됩니다."
        actions={
          <>
            <Link href="/requests" className={buttonClassName({ variant: "secondary" })}>
              게시판으로
            </Link>
            <Button type="submit" form="request-form" disabled={submitting}>
              {submitting ? "신청 중..." : "신청 등록"}
            </Button>
          </>
        }
      />

      {formError ? (
        <div className="rounded-2xl border border-rose-900/60 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{formError}</div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form id="request-form" onSubmit={submit} className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>신청자 정보</CardTitle>
              <CardDescription>연락 수단이 없기 때문에 이름은 선택 입력입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Field label="신청자 이름" optional error={errors.requesterName}>
                <Input value={values.requesterName} onChange={(event) => set("requesterName", event.target.value)} placeholder="익명 가능" />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>응원가 정보</CardTitle>
              <CardDescription>관리자가 바로 검토할 수 있도록 가능한 한 정확히 입력합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="응원가 이름" required error={errors.name} className="md:col-span-2">
                <Input value={values.name} onChange={(event) => set("name", event.target.value)} placeholder="예: 승리를 위하여" />
              </Field>

              <Field label="팀 이름" required error={errors.teamName}>
                <Input value={values.teamName} onChange={(event) => set("teamName", event.target.value)} placeholder="예: 서울" />
              </Field>

              <Field label="선수 이름" optional error={errors.playerName}>
                <Input value={values.playerName} onChange={(event) => set("playerName", event.target.value)} placeholder="선수 응원가일 때 입력" />
              </Field>

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
              >
                <Input
                  value={values.customTypeName}
                  onChange={(event) => set("customTypeName", event.target.value)}
                  placeholder="예: 이벤트"
                  disabled={!showCustomTypeName}
                />
              </Field>

              <Field label="Roblox assetId" required error={errors.assetId} className="md:col-span-2">
                <Input value={values.assetId} onChange={(event) => set("assetId", event.target.value)} inputMode="numeric" placeholder="예: 1234567890" />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추가 메모</CardTitle>
              <CardDescription>관리자가 참고해야 할 정보가 있으면 적어주세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <Field label="신청 메모" optional error={errors.requestNote} hint="최대 500자">
                <Textarea
                  value={values.requestNote}
                  onChange={(event) => set("requestNote", event.target.value)}
                  placeholder="예: 특정 선수 등장 시 사용되는 곡입니다."
                />
              </Field>
            </CardContent>
          </Card>
        </form>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>처리 기준</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-zinc-400">
              <p>신청은 바로 공개되지 않고 대기 상태로 저장됩니다.</p>
              <p>관리자가 승인하면 실제 Song 데이터가 생성됩니다.</p>
              <p>반려된 경우 반려 사유가 게시판에 표시됩니다.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>입력 팁</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-zinc-400">
              <p>팀 이름과 선수 이름은 현재 문자열 기준으로 검색되므로 표기를 일정하게 맞추는 편이 좋습니다.</p>
              <p>assetId를 알고 있다면 함께 입력해야 승인 처리 속도가 빨라집니다.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
