"use client";

import React from 'react';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function FrontendPage() {
  return (
    <AboutLayout
      title="프론트엔드"
      description="Next.js 기반 프론트엔드의 구조와 주요 기능을 설명합니다."
    >
      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">기술 스택</h2>
        <div className="section-content">
          <TechStackGrid>
            <TechStackItem>
              <div className="category">Framework</div>
              <div className="tech">Next.js 15</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Library</div>
              <div className="tech">React 18</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Language</div>
              <div className="tech">TypeScript</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Styling</div>
              <div className="tech">Styled-Components</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Animation</div>
              <div className="tech">Framer Motion</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">State</div>
              <div className="tech">Zustand</div>
            </TechStackItem>
          </TechStackGrid>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">프로젝트 구조</h2>
        <div className="section-content">
          <p>Feature-based 아키텍처를 채택하여 확장 가능한 구조로 설계했습니다.</p>
          <ImagePlaceholder>
            {/* 디렉토리 구조 이미지를 추가하려면:
            <Image
              src="/images/frontend-structure.png"
              alt="Frontend Project Structure"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">프로젝트 구조 다이어그램 이미지 영역</p>
              <p className="description">
                /public/images/frontend-structure.png 파일을 추가하고<br />
                위 주석의 Image 컴포넌트를 활성화하세요
              </p>
            </div>
          </ImagePlaceholder>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="section-title">주요 기능</h2>
        <div className="section-content">
          <p>실시간 지하철 맵, 게임 시스템, 커뮤니티 등의 기능을 구현했습니다.</p>
          <ImagePlaceholder>
            {/* 주요 기능 이미지를 추가하려면:
            <Image
              src="/images/frontend-features.png"
              alt="Frontend Key Features"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">주요 기능 이미지 영역</p>
              <p className="description">
                /public/images/frontend-features.png 파일을 추가하고<br />
                위 주석의 Image 컴포넌트를 활성화하세요
              </p>
            </div>
          </ImagePlaceholder>
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
