
import { AuthGuard } from '@/components/auth/AuthGuard';
import type { Metadata } from 'next'

// 🔥 메타데이터 설정 (브라우저 탭 제목)
export const metadata: Metadata = {
  title: {
    default: 'Behindy - 지하철 텍스트 어드벤처',
    template: '%s | Behindy'
  },
  description: '지하철 노선도 기반 텍스트 어드벤처 게임. 실시간 지하철 정보와 창의적인 스토리텔링이 만나는 특별한 경험.',
  keywords: ['지하철', '게임', '텍스트 어드벤처', '서울', '노선도', 'behindy'],
  authors: [{ name: 'Behindy Team' }],
  creator: 'Behindy',
  publisher: 'Behindy',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://behindy.me',
    siteName: 'Behindy',
    title: 'Behindy - 지하철 텍스트 어드벤처',
    description: '지하철 노선도 기반 텍스트 어드벤처 게임',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behindy - 지하철 텍스트 어드벤처',
    description: '지하철 노선도 기반 텍스트 어드벤처 게임',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="ko">
      <body>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}

