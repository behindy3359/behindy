"use client";

import React from 'react';
import Image from 'next/image';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function BackendPage() {
  return (
    <AboutLayout
      title="백엔드"
      description="Spring Boot 기반 백엔드 시스템의 구조와 주요 기능을 설명합니다."
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
              <div className="tech">Spring Boot 3.4</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Language</div>
              <div className="tech">Java 17</div>
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
              <div className="category">Security</div>
              <div className="tech">Spring Security</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Auth</div>
              <div className="tech">JWT</div>
            </TechStackItem>
          </TechStackGrid>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">주요 기능</h2>
        <div className="section-content">
          <p>백엔드 시스템의 주요 기능과 API 구조를 설명합니다.</p>
          <ImagePlaceholder>
            {/* API 구조 이미지를 추가하려면:
            <Image
              src="/images/backend-api.png"
              alt="Backend API Structure"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">API 구조 다이어그램 이미지 영역</p>
              <p className="description">
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
        <h2 className="section-title">데이터베이스 설계</h2>
        <div className="section-content">
          <p>주요 시스템인 게임 시스템에 관여하는 ERD와 테이블 구조를 묘사합니다.</p>
          <ImagePlaceholder>
            <Image
              src="/images/backend-erd.png"
              alt="Backend ERD"
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
