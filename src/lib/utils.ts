import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function toTrimmedString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function toOptionalTrimmedString(value: unknown) {
  const trimmed = toTrimmedString(value);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normalizeAssetId(value: unknown) {
  const trimmed = toTrimmedString(value);
  return trimmed;
}

