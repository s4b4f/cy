import { timingSafeEqual } from "node:crypto";

export class SheetConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SheetConfigError";
  }
}

export class SheetUnauthorizedError extends Error {
  constructor() {
    super("시트 연동 권한이 없습니다.");
    this.name = "SheetUnauthorizedError";
  }
}

function getSheetIngestSecret() {
  const value = process.env.SHEET_INGEST_SECRET?.trim();
  if (!value) {
    throw new SheetConfigError("SHEET_INGEST_SECRET 환경 변수가 비어 있습니다.");
  }
  return value;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifySheetIngestSecret(secret: string | null | undefined) {
  if (!secret) return false;
  return safeEqual(secret.trim(), getSheetIngestSecret());
}

export function requireSheetIngestAccess(request: Request) {
  const headerSecret = request.headers.get("x-sheet-ingest-secret");
  const bearer = request.headers.get("authorization");
  const bearerSecret = bearer?.startsWith("Bearer ") ? bearer.slice("Bearer ".length).trim() : undefined;
  const querySecret = new URL(request.url).searchParams.get("secret");

  const provided = headerSecret ?? bearerSecret ?? querySecret;
  if (!verifySheetIngestSecret(provided)) {
    throw new SheetUnauthorizedError();
  }
}
