import { NextResponse } from "next/server";

import {
  DiscordConfigError,
  DiscordRequestError,
  handleDiscordSongRequest,
  isApplicationCommandInteraction,
  isPingInteraction,
  parseDiscordInteraction,
  responseMessage,
  responsePong,
  verifyDiscordRequest
} from "@/features/discord/service";

function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function serverError(message: string) {
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const rawBody = await request.text();

  if (!signature || !timestamp) {
    return unauthorized("디스코드 서명 헤더가 없습니다.");
  }

  try {
    const valid = verifyDiscordRequest(signature, timestamp, rawBody);
    if (!valid) {
      return unauthorized("디스코드 서명 검증에 실패했습니다.");
    }
  } catch (error) {
    if (error instanceof DiscordConfigError) {
      return serverError(error.message);
    }

    return serverError("서명 검증 중 오류가 발생했습니다.");
  }

  let interaction;
  try {
    interaction = parseDiscordInteraction(rawBody);
  } catch (error) {
    if (error instanceof DiscordRequestError) {
      return badRequest(error.message);
    }

    return badRequest("요청 본문을 읽지 못했습니다.");
  }

  if (isPingInteraction(interaction)) {
    return NextResponse.json(responsePong());
  }

  if (!isApplicationCommandInteraction(interaction)) {
    return NextResponse.json(responseMessage("지원하지 않는 인터랙션 타입입니다."));
  }

  try {
    const response = await handleDiscordSongRequest(interaction);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(responseMessage("신청 등록 중 서버 오류가 발생했습니다."));
  }
}
