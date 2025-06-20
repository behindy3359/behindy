"use client";

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '../components/layout';
import { Button } from '../components/ui';
import { MetroMapWithLines } from '@/components/metroMap';

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
    color: white;
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

const MapWrapper = styled.div`
  background: #f8fafc;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MapDescription = styled.div`
  text-align: center;
  margin-top: 2rem;
  
  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
`;

const TechSection = styled.section`
  padding: 80px 20px;
  background: #111827;
  color: white;
`;

const TechContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
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
  }
`;

const TempMapContainer = styled.div`
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #6b7280;
  
  h3 {
    margin-bottom: 10px;
    color: #374151;
  }
  
  p {
    margin: 0;
    font-size: 14px;
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
          {/* <p>지하철 노선도 기반 텍스트 어드벤처 게임</p>
          <ButtonGroup>
            <Button variant="primary" size="lg" onClick={handleGetStarted}>
              게임 시작하기
            </Button>
            <Button variant="outline" size="lg" onClick={handleLogin}>
              로그인
            </Button>
          </ButtonGroup> */}
        </HeroContent>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesContainer>
          
          <MetroMapWithLines/>

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