"use client";

import React from 'react';
import Image from 'next/image';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';
import { ProjectStructureDiagram } from '@/features/about/components/ProjectStructureDiagram';

export default function FrontendPage() {
  return (
    <AboutLayout
      title="프론트엔드"
      description="사용자가 직접 상호작용하는 클라이언트 애플리케이션을 제공하는 서버로, 서비스 로직은 Spring Boot에 위임하고 렌더링 성능과 인터페이스 구현에 집중하도록 작성했습니다."
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
          <p>Feature-based 아키텍처를 채택하여 기능별로 작업하기 용이하게 설계했습니다.</p>
          <ProjectStructureDiagram />
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="section-title">주요 기능</h2>
        <div className="section-content">
          <p>렌더링 성능과 서비스의 일관성을 위해 SSR과 CSR 을 혼합해 사용하게 되면서 각각의 경우에 다른 상태관리 방식을 사용했습니다.</p>
          <div className="placeholder-content">
            <p className="title">클라이언트 상태</p>
            <p className="description">
              비교적 가벼운 Zustand를 사용해 클라이언트 렌더링의 영향을 최소화 합니다.<br/>
              UI/로컬 상태, 폼 데이터를 관리합니다.
            </p>
            <p className="title">서버 상태</p>
            <p className="description">
              React Query 사용해 자동 로딩, 업데이트를 수행하고 에러를 관리합니다.<br/>
              API 를 통해 서버로부터 받아온 데이터를 캐싱합니다.
            </p>
          </div>
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
