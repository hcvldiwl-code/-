import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "나만의 교육용 웹앱",
  description: "교육용 웹 서비스를 위한 기본 뼈대 앱입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                EduApp
              </div>
              <nav>
                <ul className="flex space-x-6 text-sm font-medium">
                  <li><a href="#" className="hover:text-blue-600 transition-colors">홈</a></li>
                  <li><a href="#" className="hover:text-blue-600 transition-colors">학습하기</a></li>
                  {/* 여기에 새로운 네비게이션 아이템을 추가하세요 */}
                </ul>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} EduApp. All rights reserved.</p>
              {/* 여기에 푸터 링크나 추가 정보를 입력하세요 */}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
