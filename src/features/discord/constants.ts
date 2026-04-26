export const DISCORD_INTERACTION_TYPE = {
  PING: 1,
  APPLICATION_COMMAND: 2
} as const;

export const DISCORD_RESPONSE_TYPE = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4
} as const;

export const DISCORD_FLAG = {
  EPHEMERAL: 64
} as const;
