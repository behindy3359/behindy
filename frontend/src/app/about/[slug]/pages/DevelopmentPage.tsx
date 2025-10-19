"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, AboutCard, ImagePlaceholder } from '@/features/about/styles';

const ClickableCard = styled(AboutCard)`
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
  }
`;

export default function DevelopmentPage() {
  const router = useRouter();

  const handleCardClick = (troubleshootingId: string) => {
    router.push(`/about/troubleshooting/${troubleshootingId}`);
  };

  return (
    <AboutLayout
      title="개발 과정"
      description="프로젝트 개발 중 겪었던 문제와 해결 과정을 공유합니다."
    >
      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">주요 기술적 도전</h2>
        <div className="section-content">
          <p>개발 과정에서 마주한 기술적 과제와 해결 방법을 설명합니다.</p>
          <ImagePlaceholder>
            {/* 기술적 도전 이미지를 추가하려면:
            <Image
              src="/images/dev-challenges.png"
              alt="Development Challenges"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">기술적 도전 과제 이미지 영역</p>
              <p className="description">
              </p>
            </div>
          </ImagePlaceholder>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">트러블슈팅</h2>
        <div className="section-content">
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            카드를 클릭하면 자세한 내용을 확인할 수 있습니다.
          </p>
          <ClickableCard onClick={() => handleCardClick('realtime-data')}>
            <h3 className="card-title">실시간 데이터 처리</h3>
            <p className="card-content">서울시 OpenAPI와의 연동 및 최적화 과정</p>
          </ClickableCard>
          <ClickableCard onClick={() => handleCardClick('performance')}>
            <h3 className="card-title">성능 최적화</h3>
            <p className="card-content">지하철 맵 렌더링 성능 개선 과정</p>
          </ClickableCard>
          <ClickableCard onClick={() => handleCardClick('ai-optimization')}>
            <h3 className="card-title">AI 응답 최적화</h3>
            <p className="card-content">LLM 응답 속도 및 품질 개선 과정</p>
          </ClickableCard>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="section-title">설계 결정 과정</h2>
        <div className="section-content">
          <p>아키텍처 선택과 기술 스택 결정 과정에서의 고민들을 공유합니다.</p>
          {/* 상세 내용 추가 */}
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
