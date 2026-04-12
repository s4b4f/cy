# 공개 배포 가이드

이 프로젝트는 현재 로컬 PostgreSQL에 저장되도록 만들어져 있습니다.
다른 사람에게 보이게 하려면 `공용 PostgreSQL`과 `배포된 Next.js 앱`이 필요합니다.

권장 조합:

- 앱 배포: Vercel
- 공용 DB: Neon PostgreSQL

## 1. 공용 DB 만들기

Neon에서 새 프로젝트를 만든 뒤 연결 문자열 2개를 준비합니다.

- `DATABASE_URL`: 풀링 주소
- `DIRECT_URL`: 마이그레이션용 직결 주소

예시:

```env
DATABASE_URL="postgresql://USER:PASSWORD@EP-XXXX-pooler.ap-northeast-2.aws.neon.tech/neondb?sslmode=require&schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@EP-XXXX.ap-northeast-2.aws.neon.tech/neondb?sslmode=require&schema=public"
ADMIN_PASSWORD="강한관리자비밀번호"
ADMIN_SESSION_SECRET="충분히긴랜덤문자열"
```

## 2. GitHub에 코드 올리기

이 프로젝트를 GitHub 저장소에 push 합니다.

## 3. Vercel에 프로젝트 연결

Vercel에서 GitHub 저장소를 Import 합니다.

프로젝트 환경 변수에 아래 4개를 넣습니다.

- `DATABASE_URL`
- `DIRECT_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

이 저장소에는 배포 설정이 이미 들어 있습니다.

- `vercel.json`
- `prisma.config.ts`
- `scripts/vercel-build.mjs`

그래서 Vercel 프로덕션 배포 시 아래가 자동으로 실행됩니다.

1. Prisma Client 생성
2. Prisma 마이그레이션 배포
3. Next.js 빌드

## 4. 배포 주소 확인

배포가 끝나면 Vercel이 발급한 주소로 누구나 접속할 수 있습니다.

예:

```text
https://your-project.vercel.app
```

## 5. 지금 로컬 데이터를 공개 DB로 옮기기

중요:
현재 로컬 PostgreSQL에 들어 있는 데이터는 자동으로 공용 DB로 올라가지 않습니다.

데이터가 적으면 직접 다시 등록하는 게 가장 빠릅니다.
데이터를 그대로 옮기고 싶으면 SQL 덤프를 사용하면 됩니다.

```powershell
$env:PGPASSWORD='postgres'
& 'C:\Program Files\PostgreSQL\18\bin\pg_dump.exe' -U postgres -h localhost -p 5432 -d roblox_cheering_song_db --data-only --inserts -f songs-data.sql
```

그 다음 공용 DB에 넣습니다.

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' "DIRECT_URL_실제값" -f songs-data.sql
```

