import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE_NAME, ADMIN_SESSION_MAX_AGE } from "@/features/auth/constants";

type SessionPayload = {
  role: "admin";
  exp: number;
};

export class AdminUnauthorizedError extends Error {
  constructor() {
    super("관리자 권한이 필요합니다.");
    this.name = "AdminUnauthorizedError";
  }
}

export class AdminConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminConfigError";
  }
}

function getRequiredEnv(name: "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET") {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new AdminConfigError(`${name} 환경 변수가 비어 있습니다.`);
  }
  return value;
}

function sign(value: string) {
  return createHmac("sha256", getRequiredEnv("ADMIN_SESSION_SECRET")).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string) {
  const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;
  return parsed;
}

export function normalizeNextPath(next: string | null | undefined) {
  if (!next) return "/songs";
  if (!next.startsWith("/")) return "/songs";
  if (next.startsWith("//")) return "/songs";
  if (next.startsWith(ADMIN_LOGIN_PATH)) return "/songs";
  return next;
}

export function verifyAdminPassword(password: string) {
  const expected = getRequiredEnv("ADMIN_PASSWORD");
  return safeEqual(password, expected);
}

export function createAdminSessionToken() {
  const payload: SessionPayload = {
    role: "admin",
    exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000
  };
  const encodedPayload = encodePayload(payload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;
  if (!safeEqual(signature, sign(encodedPayload))) return false;

  const payload = decodePayload(encodedPayload);
  if (payload.role !== "admin") return false;
  if (payload.exp <= Date.now()) return false;
  return true;
}

export function getAdminSessionCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: createAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE
  };
}

export function getAdminSessionClearCookieOptions() {
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  };
}

export async function isAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyAdminSessionToken(token);
  } catch {
    return false;
  }
}

export async function requireAdminSession() {
  const allowed = await isAdminSession();
  if (!allowed) throw new AdminUnauthorizedError();
}

export async function redirectIfNotAdmin(nextPath: string) {
  const allowed = await isAdminSession();
  if (!allowed) {
    redirect(`${ADMIN_LOGIN_PATH}?next=${encodeURIComponent(normalizeNextPath(nextPath))}`);
  }
}

