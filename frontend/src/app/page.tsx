// src/app/page.tsx
"use client";

import React from 'react';
import styled from 'styled-components';
import { PublicLayout } from '../components/layout';
import { Button } from '../components/ui';
import { useRouter } from 'next/navigation';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 20px;
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
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background: #fafbfc;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
    color: #6b7280;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  }
  
  .icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6b7280;
    line-height: 1.6;
  }
`;

const TechSection = styled.section`
  padding: 80px 20px;
  background: white;
`;

const TechContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 3rem;
  }
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const TechItem = styled.div`
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  
  h4 {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: #6b7280;
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
          <p>
            지하철 노선도를 배경으로 한 독특한 텍스트 어드벤처 게임
            <br />
            당신만의 스토리를 만들어보세요
          </p>
          <ButtonGroup>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={handleGetStarted}
            >
              게임 시작하기
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleLogin}
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}
            >
              로그인
            </Button>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesContainer>
          <h2>게임의 특징</h2>
          <p className="subtitle">
            일상적인 지하철 공간에서 펼쳐지는 특별한 모험
          </p>
          
          <FeatureGrid>
            <FeatureCard>
              <div className="icon">🚇</div>
              <h3>실제 지하철 노선도</h3>
              <p>
                서울 지하철 노선도를 기반으로 한 실감나는 배경
                각 노선마다 고유한 스토리가 기다립니다
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="icon">📖</div>
              <h3>텍스트 어드벤처</h3>
              <p>
                선택에 따라 달라지는 스토리
                당신의 결정이 캐릭터의 운명을 결정합니다
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="icon">👤</div>
              <h3>캐릭터 관리</h3>
              <p>
                체력과 정신력을 관리하며 진행하는 전략적 게임플레이
                신중한 선택이 생존의 열쇠입니다
              </p>
            </FeatureCard>
          </FeatureGrid>
        </FeaturesContainer>
      </FeaturesSection>

      {/* Tech Stack Section */}
      <TechSection>
        <TechContainer>
          <h2>기술 스택</h2>
          
          <TechGrid>
            <TechItem>
              <h4>Frontend</h4>
              <p>Next.js 15 + TypeScript</p>
            </TechItem>
            
            <TechItem>
              <h4>Backend</h4>
              <p>Spring Boot 3.4 + Java 21</p>
            </TechItem>
            
            <TechItem>
              <h4>Database</h4>
              <p>PostgreSQL + Redis</p>
            </TechItem>
            
            <TechItem>
              <h4>AI Server</h4>
              <p>FastAPI + Python</p>
            </TechItem>
            
            <TechItem>
              <h4>Infrastructure</h4>
              <p>AWS EC2 + Docker</p>
            </TechItem>
            
            <TechItem>
              <h4>CI/CD</h4>
              <p>GitHub Actions</p>
            </TechItem>
          </TechGrid>
        </TechContainer>
      </TechSection>
    </PublicLayout>
  );
}