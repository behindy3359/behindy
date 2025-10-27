
import { AuthGuard } from '@/features/auth/components/AuthGuard/AuthGuard';
import type { Metadata } from 'next'
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import '@/shared/styles/globalTheme.css';

export const metadata: Metadata = {
  title: {
    default: 'Behindy - 포트폴리오 프로젝트 (데모)',
    template: '%s | Behindy 포트폴리오'
  },
  description: '풀스택 개발 포트폴리오 프로젝트 - 서울 지하철 테마 텍스트 어드벤처 게임 데모. Next.js, Spring Boot, AI(LLM) 통합 기술 스택 시연용 사이트입니다. 실제 서비스가 아닌 학습 및 시연 목적의 데모 사이트입니다.',
  keywords: [
    '포트폴리오',
    '풀스택 개발',
    'Next.js',
    'Spring Boot',
    '데모 프로젝트',
    '지하철 게임',
    '텍스트 어드벤처',
    'AI 통합',
    'LLM',
    'behindy'
  ],
  authors: [{ name: 'Behindy' }],
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
    siteName: 'Behindy 포트폴리오',
    title: 'Behindy - 풀스택 개발 포트폴리오 (데모 사이트)',
    description: '서울 지하철 테마 텍스트 어드벤처 게임 - Next.js, Spring Boot, AI 통합 기술 스택 시연용 포트폴리오 프로젝트입니다.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behindy - 포트폴리오 프로젝트',
    description: '풀스택 개발 포트폴리오 - 서울 지하철 테마 게임 데모',
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
        <ThemeProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}

