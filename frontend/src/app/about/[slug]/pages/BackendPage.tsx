"use client";

import React from 'react';
import Image from 'next/image';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection, TechStackGrid, TechStackItem, ImagePlaceholder } from '@/features/about/styles';

export default function BackendPage() {
  return (
    <AboutLayout
      title="백엔드"
      description="서비스의 중심이 되는 서버 프로그램입니다. 서비스 로직을 처리하고,  데이터베이스 및 Redis 캐시와 연동하며, Story-Gen API 와의 통신을  통해 스토리를 생성·관리합니다."
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
        <h2 className="section-title">Security - 서비스에 필요한 보안 기능</h2>
        <div className="section-content">
          <div className="placeholder-content">
              <p className="title">인증 및 인가 (Spring Security + JWT)</p>
              <p className="description">
                JWT 형태의 이중 토큰 (Access + Refresh Token)구조를 사용했습니다. 클라이언트로 넘겨지는 Access 토큰은 HttpOnly Cookie에 저장합니다.
              </p>
          </div>
          <div className="placeholder-content">
              <p className="title">데이터 암호화 (Jasypt)</p>
              <p className="description">
                민감한 정보를 보호하기 위해서 테이블 전체 또는 일부 컬럼에 대한 암호화 함수를 사용합니다. 서비스에 사용되는 데이터에 따라 암호화 방식을 구분합니다. 암호화/복호화 과정은 JPA Converter로 자동 으로 수행됩니다.<br/>
- 단방향 암호화 : 비밀번호<br/>
- 양방향 암호화 : 닉네임, 이메일
              </p>
          </div>
          <div className="placeholder-content">
              <p className="title">XSS 방지</p>
              <p className="description">
                HTMLCharacterEscapes를 적용하여, 입력값에 대한 검증을 실시합니다. 또한 클라이언트에 JSON 형태의 응답 시 HTML 특수문자를 Escape처리합니다. 
              </p>
          </div>
          <div className="placeholder-content">
              <p className="title">마이크로서비스 간 인증</p>
              <p className="description">
                시스템 내부의 서버끼리의 통신에 내부 인증키 헤더 를 포함하여 Backend 와 AIServer 간의 통신을 보호합니다.
              </p>
          </div>
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
