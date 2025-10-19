"use client";

import React from 'react';
import Image from 'next/image';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function OverviewPage() {
  return (
    <AboutLayout
      title="프로젝트 소개"
      description="Behindy 프로젝트를 소개합니다."
    >
      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">프로젝트 개요</h2>
        <div className="section-content">
          <p>
            Behindy는 서울시 지하철 노선도를 기반으로 한 텍스트 어드벤처 게임입니다.
            실시간 지하철 정보와 AI 생성 스토리를 활용하여 게임 시스템을 표현합니다.
          </p>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">사용 가이드</h2>
        <div className="section-content">
          <p>게임 플레이 방법과 주요 기능을 소개합니다.</p>
          <ImagePlaceholder>
            <Image
              src="/images/user-guide.png"
              alt="User Guide"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </ImagePlaceholder>
          <div className="p[laceholder-content">
            <p className="description">
              로그인 상태에서 노선도의 역 아이콘과 상호작용하면 게임으로 진입합니다.<br />
              제시된 선택지중 하나를 선택해 모험을 진행하다 보면 돌아올 수 있습니다.
            </p>
          </div>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="section-title">기술 스택</h2>
        <div className="section-content">
          <TechStackGrid>
            <TechStackItem>
              <div className="category">Frontend</div>
              <div className="tech">Next.js 15</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Backend</div>
              <div className="tech">Spring Boot 3.4</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Database</div>
              <div className="tech">PostgreSQL</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Cache</div>
              <div className="tech">Redis</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">AI</div>
              <div className="tech">FastAPI</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">DevOps</div>
              <div className="tech">Docker</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Cloud</div>
              <div className="tech">AWS EC2</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">CI/CD</div>
              <div className="tech">GitHub Actions</div>
            </TechStackItem>
          </TechStackGrid>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="section-title">시스템 아키텍처</h2>
        <div className="section-content">
          <p>전체 시스템 구조도와 각 컴포넌트 간의 관계를 묘사합니다.</p>
          <ImagePlaceholder>
            <Image
              src="/images/architecture.png"
              alt="System Architecture"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </ImagePlaceholder>
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
