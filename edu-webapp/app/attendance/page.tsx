import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function getAttendance() {
  try {
    // 1. 테이블 생성
    await sql`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT '출석',
        attendance_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // 2. 오늘의 출석 목록 가져오기
    return await sql`
      SELECT * FROM attendance 
      WHERE attendance_date = CURRENT_DATE 
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error('Attendance Database Error:', error);
    return [];
  }
}

export default async function AttendancePage() {
  const records = await getAttendance();

  // 요약 정보 계산
  const summary = {
    total: records.length,
    present: records.filter((r: any) => r.status === '출석').length,
    late: records.filter((r: any) => r.status === '지각').length,
    absent: records.filter((r: any) => r.status === '결석').length,
  };

  // Server Action: 출석 체크
  async function markAttendance(formData: FormData) {
    'use server';
    const studentName = formData.get('studentName') as string;
    const status = formData.get('status') as string || '출석';
    if (!studentName) return;
    await sql`INSERT INTO attendance (student_name, status) VALUES (${studentName}, ${status})`;
    revalidatePath('/attendance');
  }

  // Server Action: 기록 삭제
  async function deleteRecord(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await sql`DELETE FROM attendance WHERE id = ${id}`;
    revalidatePath('/attendance');
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      <section className="flex justify-between items-end border-b pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600">출석 관리 시스템</h1>
          <p className="text-gray-500 font-medium">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        {/* 요약 카드 */}
        <div className="flex gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
            <p className="text-[10px] text-blue-600 font-bold uppercase">전체</p>
            <p className="text-xl font-black">{summary.total}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800 text-center">
            <p className="text-[10px] text-green-600 font-bold uppercase">출석</p>
            <p className="text-xl font-black">{summary.present}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-800 text-center">
            <p className="text-[10px] text-red-600 font-bold uppercase">결석</p>
            <p className="text-xl font-black">{summary.absent}</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 출석 입력 섹션 */}
        <section className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              신규 출석 체크
            </h2>
            <form action={markAttendance} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">학생 성명</label>
                <input 
                  name="studentName" 
                  required 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all" 
                  placeholder="예: 홍길동"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">상태 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {['출석', '지각', '조퇴', '결석'].map((s) => (
                    <label key={s} className="relative cursor-pointer">
                      <input type="radio" name="status" value={s} defaultChecked={s === '출석'} className="peer sr-only" />
                      <div className="px-4 py-2 text-center bg-gray-50 dark:bg-gray-800 border-2 border-transparent peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 rounded-xl transition-all text-sm font-medium">
                        {s}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
              >
                기록하기
              </button>
            </form>
          </div>
        </section>

        {/* 출석 목록 섹션 */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 px-2">
            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
            오늘의 출석 명단
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">성명</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">상태</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center">
                      <p className="text-gray-400 font-medium">아직 기록된 출석 정보가 없습니다.</p>
                    </td>
                  </tr>
                ) : (
                  records.map((record: any) => (
                    <tr key={record.id} className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/20 transition-all">
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-800 dark:text-gray-200">{record.student_name}</p>
                        <p className="text-[10px] text-gray-400 tabular-nums">
                          {new Date(record.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black ${
                          record.status === '출석' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          record.status === '결석' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <form action={deleteRecord}>
                          <input type="hidden" name="id" value={record.id} />
                          <button 
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                            title="삭제"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
