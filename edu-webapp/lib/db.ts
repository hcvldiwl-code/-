import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  // 로컬 개발 환경에서는 .env.local 파일에 DATABASE_URL을 추가하세요.
  // Vercel 배포 시에는 Neon 통합을 통해 자동으로 설정됩니다.
  console.warn('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL || '');
