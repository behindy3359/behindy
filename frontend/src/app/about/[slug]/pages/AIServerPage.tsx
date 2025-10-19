"use client";

import React from 'react';
import Image from 'next/image';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function AIServerPage() {
  return (
    <AboutLayout
      title="AI 서버"
      description="FastAPI 기반 AI 서버의 구조와 LLM 통합 방식을 설명합니다."
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
              <div className="tech">FastAPI</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Language</div>
              <div className="tech">Python</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">LLM</div>
              <div className="tech">OpenAI API</div>
            </TechStackItem>
            <TechStackItem>
              <div className="category">Prompts</div>
              <div className="tech">Custom Design</div>
            </TechStackItem>
          </TechStackGrid>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">스토리 생성 시스템</h2>
        <div className="section-content">
          <p>AI를 활용한 동적 스토리 생성 방식을 설명합니다.</p>
          <ImagePlaceholder>
            {/* 스토리 생성 시스템 이미지를 추가하려면:
            <Image
              src="/images/ai-story-system.png"
              alt="AI Story Generation System"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">스토리 생성 시스템 다이어그램 이미지 영역</p>
              <p className="description">
                /public/images/ai-story-system.png 파일을 추가하고<br />
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
        <h2 className="section-title">프롬프트 엔지니어링</h2>
        <div className="section-content">
          <p>효과적인 스토리 생성을 위한 프롬프트 설계 방식을 설명합니다.</p>
          <ImagePlaceholder>
            {/* 프롬프트 구조 이미지를 추가하려면:
            <Image
              src="/images/ai-prompt-design.png"
              alt="AI Prompt Engineering"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
            */}
            <div className="placeholder-content">
              <p className="title">프롬프트 설계 다이어그램 이미지 영역</p>
              <p className="description">
                /public/images/ai-prompt-design.png 파일을 추가하고<br />
                위 주석의 Image 컴포넌트를 활성화하세요
              </p>
            </div>
          </ImagePlaceholder>
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
