# 로블록스 야구게임 응원가 DB

Next.js(App Router) + Prisma + PostgreSQL + Zod 기반 관리자 사이트입니다.

## 로컬 실행

`.env` 예시:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/roblox_cheering_song_db?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/roblox_cheering_song_db?schema=public"
ADMIN_PASSWORD="roblox-song-admin-2026!"
ADMIN_SESSION_SECRET="roblox-song-db-local-session-secret-2026"
```

실행:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

관리자 로그인:

- 경로: `/admin/login`
- 비밀번호: `.env`의 `ADMIN_PASSWORD`

## Discord 연동 (슬래시 명령으로 신청 등록)

디스코드에서 `/songrequest` 명령으로 입력하면 `SongRequest`에 자동 등록됩니다.

필수 환경변수:

```env
DISCORD_PUBLIC_KEY="디스코드 앱 Public Key"
DISCORD_COMMAND_NAME="songrequest"
```

명령 등록(한 번 실행):

```bash
npm run discord:register-command
```

명령 등록용 추가 환경변수:

```env
DISCORD_BOT_TOKEN="봇 토큰"
DISCORD_APPLICATION_ID="애플리케이션 ID"
DISCORD_GUILD_ID="개발 서버 ID(선택, 있으면 길드 명령으로 즉시 반영)"
```

디스코드 개발자 포털 `Interactions Endpoint URL`:

```text
https://<배포도메인>/api/discord/interactions
```

## Google Sheets 연동 (관리자 로그인 없이 등록)

시트에서 바로 응원가를 반영하려면 아래 API를 사용합니다.

- 엔드포인트: `POST /api/sheets/songs`
- 인증: `x-sheet-ingest-secret` 헤더
- 동작: `assetId` 기준 업서트 (있으면 수정, 없으면 등록)

필수 환경변수:

```env
SHEET_INGEST_SECRET="강한랜덤문자열"
```

Apps Script 예시:

```javascript
const API_URL = "https://<배포도메인>/api/sheets/songs";
const SECRET = "SHEET_INGEST_SECRET 값";

function sendPendingRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("시트1");
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const rows = sheet.getRange(2, 1, lastRow - 1, 8).getValues();

  rows.forEach((row) => {
    const payload = {
      name: String(row[0] || "").trim(),
      assetId: String(row[1] || "").trim(),
      teamName: String(row[2] || "").trim(),
      type: String(row[3] || "TEAM").trim().toUpperCase(),
      playerName: String(row[4] || "").trim(),
      customTypeName: String(row[5] || "").trim(),
      requesterName: String(row[6] || "").trim(),
      requestNote: String(row[7] || "").trim()
    };

    UrlFetchApp.fetch(API_URL, {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-sheet-ingest-secret": SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  });
}
```

## 공개 배포

다른 사람에게 보이게 하려면 로컬 DB가 아니라 공용 PostgreSQL을 연결해야 합니다.

배포 순서는 [DEPLOY.md](./DEPLOY.md) 를 보면 됩니다.
