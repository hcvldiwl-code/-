export default function Home() {
  return (
    <div className="flex-grow flex items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Hero Section */}
        <section className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            나만의 <span className="text-blue-600 dark:text-blue-400">교육용 웹앱</span> 만들기
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            이곳은 새로운 교육 서비스를 시작하기 위한 완벽한 출발점입니다.
            원하는 기능을 마음껏 추가하고 전 세계와 공유해 보세요.
          </p>
        </section>

        {/* Call to Action (Placeholder Button) */}
        <section className="pt-8">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
            새로운 학습 시작하기
          </button>
          
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-left">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">개발자 모드</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <code>app/page.tsx</code> 파일을 열어 이 화면을 수정해보세요.
            </p>
            {/* 여기에 새로운 기능이나 컴포넌트를 추가하세요 (예: 코스 목록, 진행률 위젯 등) */}
          </div>
        </section>
        
      </div>
    </div>
  );
}
