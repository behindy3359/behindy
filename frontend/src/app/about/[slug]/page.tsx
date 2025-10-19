"use client";

import { useParams } from 'next/navigation';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { isValidAboutSlug } from '@/features/about/utils';
import { AboutSection } from '@/features/about/styles';

// 각 페이지별 컴포넌트
import OverviewPage from './pages/OverviewPage';
import BackendPage from './pages/BackendPage';
import FrontendPage from './pages/FrontendPage';
import AIServerPage from './pages/AIServerPage';
import DevOpsPage from './pages/DevOpsPage';
import DevelopmentPage from './pages/DevelopmentPage';

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
