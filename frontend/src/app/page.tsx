"use client";

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '../components/layout';
import { Button } from '../components/ui';
import { RealtimeMetroMap } from '@/components/metroMap/RealtimeMetroMap';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
    background-size: 50px 50px;
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  
  h1 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    opacity: 0.9;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 40px 20px;
  background: #fafbfc;
`;

const FeaturesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 2rem;
    text-align: center;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureHighlight = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  .feature-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .icon {
      font-size: 1.5rem;
    }
    
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
  }
  
  .feature-description {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`;

const TechSection = styled.section`
  padding: 60px 20px;
  background: #111827;
  color: white;
`;

const TechContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }
  
  .tech-description {
    font-size: 1.1rem;
    color: #d1d5db;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const TechItem = styled.div`
  padding: 1.5rem;
  background: #374151;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #4b5563;
    transform: translateY(-2px);
  }
  
  h4 {
    font-weight: 600;
    color: #60a5fa;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: #d1d5db;
    margin: 0;
  }
`;

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <h1>Behindy</h1>
        </HeroContent>
      </HeroSection>

      {/* 실시간 지하철 노선도 섹션 */}
      <FeaturesSection>
        <FeaturesContainer>
            
            {/* 실시간 지하철 노선도 컴포넌트 */}
            <RealtimeMetroMap />

        </FeaturesContainer>
      </FeaturesSection>

      {/* Tech Stack Section */}
      <TechSection>
        <TechContainer>
          <h2>🛠️ 기술 스택</h2>
          <div className="tech-description">
            웹 기술을 활용한 풀스택 개발 프로젝트입니다.
          </div>
          
          <TechGrid>
            <TechItem>
              <h4>Frontend</h4>
              <p>Next.js 15 + TypeScript + Styled Components</p>
            </TechItem>
            
            <TechItem>
              <h4>Backend</h4>
              <p>Spring Boot 3.4 + Java 21 + PostgreSQL</p>
            </TechItem>
            
            <TechItem>
              <h4>Real-time</h4>
              <p>Redis Cache + 서울시 OpenAPI</p>
            </TechItem>
            
            <TechItem>
              <h4>AI Server</h4>
              <p>FastAPI + Python (스토리 생성)</p>
            </TechItem>
            
            <TechItem>
              <h4>Infrastructure</h4>
              <p>AWS EC2 + Docker + GitHub Actions</p>
            </TechItem>
            
            <TechItem>
              <h4>Animation</h4>
              <p>SVG + CSS Gradients + Framer Motion</p>
            </TechItem>
          </TechGrid>
        </TechContainer>
      </TechSection>
    </PublicLayout>
  );
}