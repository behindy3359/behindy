"use client";

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { isValidAboutSlug } from '@/features/about/utils';
import { AboutSection } from '@/features/about/styles';

// Dynamic Import: About 서브 페이지는 선택된 페이지만 로드 (번들 크기 최적화)
const LoadingComponent = () => (
  <AboutSection>
    <p style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
      로딩 중...
    </p>
  </AboutSection>
);

const OverviewPage = dynamic(() => import('./pages/OverviewPage'), {
  loading: LoadingComponent,
  ssr: true,
});

const BackendPage = dynamic(() => import('./pages/BackendPage'), {
  loading: LoadingComponent,
  ssr: true,
});

const FrontendPage = dynamic(() => import('./pages/FrontendPage'), {
  loading: LoadingComponent,
  ssr: true,
});

const AIServerPage = dynamic(() => import('./pages/AIServerPage'), {
  loading: LoadingComponent,
  ssr: true,
});

const DevOpsPage = dynamic(() => import('./pages/DevOpsPage'), {
  loading: LoadingComponent,
  ssr: true,
});

const DevelopmentPage = dynamic(() => import('./pages/DevelopmentPage'), {
  loading: LoadingComponent,
  ssr: true,
});

export default function AboutDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // 유효하지 않은 slug인 경우
  if (!isValidAboutSlug(slug)) {
    return (
      <AboutLayout title="페이지를 찾을 수 없습니다">
        <AboutSection>
          <p className="section-content">
            요청하신 페이지를 찾을 수 없습니다.
          </p>
        </AboutSection>
      </AboutLayout>
    );
  }

  // slug에 따라 적절한 컴포넌트 렌더링
  const renderPage = () => {
    switch (slug) {
      case 'overview':
        return <OverviewPage />;
      case 'backend':
        return <BackendPage />;
      case 'frontend':
        return <FrontendPage />;
      case 'aiserver':
        return <AIServerPage />;
      case 'devops':
        return <DevOpsPage />;
      case 'development':
        return <DevelopmentPage />;
      default:
        return null;
    }
  };

  return renderPage();
}
