import "dotenv/config";

const botToken = process.env.DISCORD_BOT_TOKEN?.trim();
const applicationId = process.env.DISCORD_APPLICATION_ID?.trim();
const guildId = process.env.DISCORD_GUILD_ID?.trim();
const commandName = (process.env.DISCORD_COMMAND_NAME?.trim() || "songrequest").toLowerCase();

if (!botToken || !applicationId) {
  console.error("DISCORD_BOT_TOKEN, DISCORD_APPLICATION_ID 환경변수가 필요합니다.");
  process.exit(1);
}

const endpoint = guildId
  ? `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`
  : `https://discord.com/api/v10/applications/${applicationId}/commands`;

const payload = {
  name: commandName,
  description: "응원가 신청을 DB에 등록합니다.",
  options: [
    {
      type: 3,
      name: "name",
      description: "응원가 이름",
      required: true
    },
    {
      type: 3,
      name: "asset_id",
      description: "로블록스 assetId",
      required: true
    },
    {
      type: 3,
      name: "team_name",
      description: "팀 이름",
      required: true
    },
    {
      type: 3,
      name: "type",
      description: "응원가 타입",
      required: true,
      choices: [
        { name: "TEAM", value: "TEAM" },
        { name: "PLAYER", value: "PLAYER" },
        { name: "CUSTOM", value: "CUSTOM" }
      ]
    },
    {
      type: 3,
      name: "player_name",
      description: "선수 이름 (PLAYER 타입 필수)",
      required: false
    },
    {
      type: 3,
      name: "custom_type_name",
      description: "기타 타입 이름 (CUSTOM 타입 필수)",
      required: false
    },
    {
      type: 3,
      name: "note",
      description: "신청 메모",
      required: false,
      max_length: 500
    }
  ]
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bot ${botToken}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

const data = await response.json();

if (!response.ok) {
  console.error("디스코드 명령 등록 실패:", data);
  process.exit(1);
}

console.log("디스코드 명령 등록 완료:", {
  id: data.id,
  name: data.name,
  scope: guildId ? "guild" : "global"
});
