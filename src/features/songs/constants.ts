export const SONG_TYPES = ["TEAM", "PLAYER", "CUSTOM"] as const;

export const SONG_TYPE_LABEL: Record<(typeof SONG_TYPES)[number], string> = {
  TEAM: "팀",
  PLAYER: "선수",
  CUSTOM: "커스텀"
};

export const SONG_TYPE_BADGE_VARIANT: Record<(typeof SONG_TYPES)[number], "default" | "secondary" | "outline"> = {
  TEAM: "secondary",
  PLAYER: "default",
  CUSTOM: "outline"
};

