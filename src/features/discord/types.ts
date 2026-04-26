export type DiscordInteractionOption = {
  name: string;
  type: number;
  value?: string | number | boolean;
  options?: DiscordInteractionOption[];
};

export type DiscordInteractionUser = {
  id: string;
  username: string;
  global_name?: string | null;
};

export type DiscordInteraction = {
  id: string;
  application_id: string;
  type: number;
  data?: {
    id: string;
    name: string;
    type: number;
    options?: DiscordInteractionOption[];
  };
  member?: {
    user: DiscordInteractionUser;
  };
  user?: DiscordInteractionUser;
  token: string;
  version: number;
};

export type DiscordInteractionResponse = {
  type: 1 | 4;
  data?: {
    content: string;
    flags?: number;
  };
};
