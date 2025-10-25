
import { AuthGuard } from '@/features/auth/components/AuthGuard/AuthGuard';
import type { Metadata } from 'next'
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import '@/shared/styles/globalTheme.css';

export const metadata: Metadata = {
  title: {
    default: 'Behindy.me',
    template: '%s | Behindy'
  },
  description: '포트폴리오용 페이지',
  keywords: ['지하철', '게임', '텍스트 어드벤처', '서울', '노선도', 'behindy'],
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
    siteName: 'Behindy',
    title: 'Behindy',
    description: '포트폴리오용 페이지',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behindy',
    description: '포트폴리오용 페이지',
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

