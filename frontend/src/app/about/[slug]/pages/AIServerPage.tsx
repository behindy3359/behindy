"use client";

import React from 'react';
import Image from 'next/image';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function AIServerPage() {
  return (
    <AboutLayout
      title="AI 서버"
      description="서비스가 제공할 컨텐츠를 생성하기 위해 외부 LLM서비스와 통신하기 위한 서버입니다."
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
          <ImagePlaceholder>
            <Image
              src="/images/ai-story-system.png"
              alt="AI Story Generation System"
              width={900}
              height={600}
              style={{ width: '100%', height: 'auto' }}
            />
          </ImagePlaceholder>
          <div className="placeholder-content">
            <p className="title">응답 검증</p>
            <p className="description">
              AI의 응답을 온전히 신뢰하지 않고, 백엔드에서 별도의 응답처리를 하지 않기 때문에 DB까지 데이터가 올바르게 도달하기 위해서는 검증 과정이 필요했습니다. 또한 최종적으로 서비스에 사용될 컨텐츠이므로, 내용의 질과 형식 모두 기준을 만족하는 경우에만 다시 백엔드로 최종응답을 돌려보냅니다.
            </p>
          </div>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="section-title">Milti-Provider</h2>
        <div className="section-content">
          <p>이 프로젝트에서 Provider는 어떤 LLM 서비스로 요청을 보낼지 결정하고, 서비스에 맞는 미리 작성된 프롬프트를 보냅니다. </p>
            <div className="placeholder-content">
              <p className="title">비용 관리</p>
              <p className="description">
                Rate Limiting에 제한을 두어 과도한 비용이 발생하지 않게 제어합니다.
              </p>
              <p className="title">Multi-Provider</p>
              <p className="description">
              대상 서비스에 장애가 발생하는 경우, 다른 제공자에게 재요청을 보냅니다. 이후 프로젝트의 확장으로 내부의 모델을 사용하는 등 새로운 서비스 제공자를 추가하는 등의 관리가 필요한 경우 간단한 변경만으로 요청 대상을 변경합니다.
              </p>
            </div>
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
