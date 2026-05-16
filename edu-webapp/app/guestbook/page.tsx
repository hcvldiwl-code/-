import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function getEntries() {
  try {
    // 1. 테이블이 없는 경우를 대비해 생성 (최초 1회 실행)
    await sql`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // 2. 방명록 목록 가져오기
    return await sql`SELECT * FROM guestbook ORDER BY created_at DESC LIMIT 50`;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export default async function GuestbookPage() {
  const entries = await getEntries();

  // Server Action: 방명록 등록
  async function addEntry(formData: FormData) {
    'use server';
    
    const name = formData.get('name') as string;
    const message = formData.get('message') as string;

    if (!name || !message) return;

    try {
      await sql`INSERT INTO guestbook (name, message) VALUES (${name}, ${message})`;
      revalidatePath('/guestbook');
    } catch (error) {
      console.error('Failed to add entry:', error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">방명록</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Neon Postgres를 연동한 실시간 방명록입니다. 메시지를 남겨주세요!
        </p>
      </section>

      {/* 방명록 작성 폼 */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <form action={addEntry} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">이름</label>
            <input 
              name="name" 
              required 
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="표시될 이름을 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">메시지</label>
            <textarea 
              name="message" 
              required 
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
              placeholder="따뜻한 한마디를 남겨주세요"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            방명록 등록하기
          </button>
        </form>
      </section>

      {/* 방명록 목록 */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-100 dark:border-gray-800 pb-2">최근 남겨진 메시지</h2>
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500">아직 등록된 메시지가 없습니다. 첫 번째 주인공이 되어보세요!</p>
            </div>
          ) : (
            entries.map((entry: any) => (
              <div key={entry.id} className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{entry.name}</span>
                  <span className="text-[11px] text-gray-400 tabular-nums">
                    {new Date(entry.created_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
