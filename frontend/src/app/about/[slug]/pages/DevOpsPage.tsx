"use client";

import React from 'react';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function DevOpsPage() {
  return (
    <AboutLayout
      title="DevOps"
      description="CI/CD 파이프라인과 인프라 구성을 설명합니다."
    >
      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">인프라 구성</h2>
        <div className="section-content">
          <TechStackGrid>
            <TechStackItem>
              <div className="category">Cloud</div>
              <div className="tech">AWS EC2</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Container</div>
              <div className="tech">Docker</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Orchestration</div>
              <div className="tech">Docker Compose</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Proxy</div>
              <div className="tech">Nginx</div>
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
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">CI/CD 파이프라인</h2>
        <div className="section-content">
          <p>GitHub Actions을 활용한 자동화된 배포 프로세스를 설명합니다.</p>
          <ImagePlaceholder>
            {/* CI/CD 파이프라인 이미지를 추가하려면:
            <Image
              src="/images/devops-pipeline.png"
              alt="CI/CD Pipeline"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">CI/CD 파이프라인 다이어그램 이미지 영역</p>
              <p className="description">
                /public/images/devops-pipeline.png 파일을 추가하고<br />
                위 주석의 Image 컴포넌트를 활성화하세요
              </p>
            </div>
          </ImagePlaceholder>
        </div>
      </AboutSection>

    </AboutLayout>
  );
}
