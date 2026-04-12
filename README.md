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

## 공개 배포

다른 사람에게 보이게 하려면 로컬 DB가 아니라 공용 PostgreSQL을 연결해야 합니다.

배포 순서는 [DEPLOY.md](./DEPLOY.md) 를 보면 됩니다.

