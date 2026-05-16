import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';

async function getAttendance() {
  try {
    // 1. 출석부 테이블 생성
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

  // Server Action: 출석 체크
  async function markAttendance(formData: FormData) {
    'use server';
    
    const studentName = formData.get('studentName') as string;
    const status = formData.get('status') as string || '출석';

    if (!studentName) return;

    try {
      await sql`
        INSERT INTO attendance (student_name, status) 
        VALUES (${studentName}, ${status})
      `;
      revalidatePath('/attendance');
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">출석부</h1>
        <p className="text-gray-600 dark:text-gray-400">
          오늘의 출석 현황을 기록하고 관리하세요. ({new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })})
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* 출석 입력 섹션 */}
        <section className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold mb-4">출석 체크하기</h2>
            <form action={markAttendance} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">학생 이름</label>
                <input 
                  name="studentName" 
                  required 
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  placeholder="이름 입력"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">상태</label>
                <select 
                  name="status"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="출석">출석</option>
                  <option value="지각">지각</option>
                  <option value="조퇴">조퇴</option>
                  <option value="결석">결석</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                체크 완료
              </button>
            </form>
          </div>
        </section>

        {/* 출석 목록 섹션 */}
        <section className="md:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400">학생명</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400">상태</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400">시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      오늘 출석한 학생이 없습니다.
                    </td>
                  </tr>
                ) : (
                  records.map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{record.student_name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          record.status === '출석' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          record.status === '결석' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 tabular-nums">
                        {new Date(record.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
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
