import { createPublicKey, verify } from "crypto";
import { ZodError } from "zod";

import { DISCORD_FLAG, DISCORD_INTERACTION_TYPE, DISCORD_RESPONSE_TYPE } from "@/features/discord/constants";
import { discordInteractionSchema } from "@/features/discord/schemas";
import type { DiscordInteraction, DiscordInteractionOption, DiscordInteractionResponse } from "@/features/discord/types";
import { SongRequestValidationError, createSongRequest } from "@/features/requests/service";

export class DiscordConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiscordConfigError";
  }
}

export class DiscordRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiscordRequestError";
  }
}

const DISCORD_OPTION_KEYS = {
  name: ["name", "song_name", "응원가이름"] as const,
  assetId: ["asset_id", "code", "assetid", "응원가코드"] as const,
  teamName: ["team_name", "team", "팀이름"] as const,
  type: ["type", "song_type", "타입"] as const,
  playerName: ["player_name", "player", "선수이름"] as const,
  customTypeName: ["custom_type_name", "custom_type", "기타타입이름"] as const,
  requestNote: ["note", "memo", "request_note", "메모"] as const
};

function getDiscordPublicKey() {
  const value = process.env.DISCORD_PUBLIC_KEY?.trim() ?? "";
  if (!value) {
    throw new DiscordConfigError("DISCORD_PUBLIC_KEY가 설정되지 않았습니다.");
  }

  if (!/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new DiscordConfigError("DISCORD_PUBLIC_KEY 형식이 올바르지 않습니다.");
  }

  return value;
}

export function getDiscordCommandName() {
  return (process.env.DISCORD_COMMAND_NAME?.trim() || "songrequest").toLowerCase();
}

function buildEd25519PublicKey(publicKeyHex: string) {
  const raw = Buffer.from(publicKeyHex, "hex");
  const ed25519Prefix = Buffer.from("302a300506032b6570032100", "hex");
  return createPublicKey({
    key: Buffer.concat([ed25519Prefix, raw]),
    format: "der",
    type: "spki"
  });
}

export function verifyDiscordRequest(signatureHex: string, timestamp: string, rawBody: string) {
  const publicKey = buildEd25519PublicKey(getDiscordPublicKey());
  const message = Buffer.from(`${timestamp}${rawBody}`);
  const signature = Buffer.from(signatureHex, "hex");
  return verify(null, message, publicKey, signature);
}

export function parseDiscordInteraction(rawBody: string): DiscordInteraction {
  let payload: unknown;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    throw new DiscordRequestError("JSON 파싱에 실패했습니다.");
  }

  const parsed = discordInteractionSchema.safeParse(payload);
  if (!parsed.success) {
    throw new DiscordRequestError(formatZodIssue(parsed.error));
  }

  return parsed.data;
}

function formatZodIssue(error: ZodError) {
  const issue = error.issues[0];
  if (!issue) return "요청 형식이 올바르지 않습니다.";
  return `필드 검증 실패: ${issue.path.join(".") || "unknown"}`;
}

function flattenOptions(options: DiscordInteractionOption[] | undefined, map: Map<string, string>) {
  if (!options) return;

  for (const option of options) {
    if (option.value !== undefined) {
      map.set(option.name.toLowerCase(), String(option.value).trim());
    }
    if (option.options && option.options.length > 0) {
      flattenOptions(option.options, map);
    }
  }
}

function pickValue(optionMap: Map<string, string>, keys: readonly string[]) {
  for (const key of keys) {
    const found = optionMap.get(key.toLowerCase());
    if (found && found.length > 0) return found;
  }
  return undefined;
}

function requesterNameFromInteraction(interaction: DiscordInteraction) {
  const user = interaction.member?.user ?? interaction.user;
  if (!user) return undefined;
  return user.global_name?.trim() || user.username.trim();
}

function toSongRequestInput(interaction: DiscordInteraction) {
  const optionMap = new Map<string, string>();
  flattenOptions(interaction.data?.options, optionMap);

  const type = (pickValue(optionMap, DISCORD_OPTION_KEYS.type) ?? "TEAM").toUpperCase();

  return {
    name: pickValue(optionMap, DISCORD_OPTION_KEYS.name),
    assetId: pickValue(optionMap, DISCORD_OPTION_KEYS.assetId),
    teamName: pickValue(optionMap, DISCORD_OPTION_KEYS.teamName),
    playerName: pickValue(optionMap, DISCORD_OPTION_KEYS.playerName),
    type,
    customTypeName: pickValue(optionMap, DISCORD_OPTION_KEYS.customTypeName),
    requestNote: pickValue(optionMap, DISCORD_OPTION_KEYS.requestNote),
    requesterName: requesterNameFromInteraction(interaction)
  };
}

export function isPingInteraction(interaction: DiscordInteraction) {
  return interaction.type === DISCORD_INTERACTION_TYPE.PING;
}

export function isApplicationCommandInteraction(interaction: DiscordInteraction) {
  return interaction.type === DISCORD_INTERACTION_TYPE.APPLICATION_COMMAND;
}

export function responsePong(): DiscordInteractionResponse {
  return {
    type: DISCORD_RESPONSE_TYPE.PONG
  };
}

export function responseMessage(content: string, ephemeral = true): DiscordInteractionResponse {
  return {
    type: DISCORD_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
      flags: ephemeral ? DISCORD_FLAG.EPHEMERAL : undefined
    }
  };
}

function formatFieldErrors(fieldErrors: Record<string, string[] | undefined>) {
  const first = Object.entries(fieldErrors).find(([, value]) => value && value.length > 0);
  if (!first) return "입력값이 올바르지 않습니다.";
  const [field, messages] = first;
  const message = messages?.[0] ?? "검증 실패";
  return `${field}: ${message}`;
}

export async function handleDiscordSongRequest(interaction: DiscordInteraction) {
  const commandName = interaction.data?.name?.toLowerCase();
  const expected = getDiscordCommandName();
  if (!commandName || commandName !== expected) {
    return responseMessage(`지원하지 않는 명령어입니다. \`/${expected}\` 명령을 사용해주세요.`);
  }

  try {
    const created = await createSongRequest(toSongRequestInput(interaction));
    return responseMessage(`신청이 등록되었습니다. (${created.name} / ${created.assetId})`);
  } catch (error) {
    if (error instanceof SongRequestValidationError) {
      const fieldError = formatFieldErrors(error.cause.flatten().fieldErrors);
      return responseMessage(`신청 등록 실패: ${fieldError}`);
    }

    throw error;
  }
}
