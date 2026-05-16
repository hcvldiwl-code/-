# Edu WebApp Boilerplate

이 프로젝트는 Next.js(App Router)와 Tailwind CSS, 그리고 Neon Postgres를 기반으로 한 교육용 웹 서비스의 뼈대입니다.

## 🛠 기술 스택
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Database**: Neon Postgres
- **Client**: @neondatabase/serverless

## 🗄 데이터베이스 설정
이 프로젝트는 `lib/db.ts`를 통해 데이터베이스에 연결됩니다. Vercel 배포 시 환경 변수(`DATABASE_URL`)가 자동으로 적용되도록 설계되었습니다.

### 데이터베이스 사용법
어디서든 다음과 같이 SQL을 사용할 수 있습니다:
```typescript
import { sql } from '@/lib/db';

// 예시: 데이터 조회
const data = await sql`SELECT * FROM your_table`;
```

## 🚀 시작하기
1. **의존성 설치**: `npm install`
2. **로컬 환경 설정**: `.env.local` 파일에 `DATABASE_URL` 추가
3. **개발 모드 실행**: `npm run dev`

## 📁 폴더 구조
- `app/`: Next.js 앱 라우터 및 페이지
- `lib/`: 공통 유틸리티 (DB 연결 등)
- `components/`: 재사용 가능한 UI 컴포넌트 (추가 예정)
