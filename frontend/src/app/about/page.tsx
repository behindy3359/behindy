// 🔧 About 페이지 import 에러 수정
// frontend/src/app/about/page.tsx

"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Train, 
  GamepadIcon, 
  Users, 
} from 'lucide-react';
// 🔥 수정된 import - AppLayout 사용
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { PageContainer } from '@/shared/styles/commonContainers';
import { gradients } from '@/shared/styles/theme';

// ================================================================
// Styled Components (CSS 변수 사용으로 수정)
// ================================================================

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  
  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: 2.25rem;
    }
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
  
  .hero-description {
    font-size: 1.125rem;
    color: var(--text-tertiary);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-bottom: 5rem;
`;

const FeatureCard = styled(motion.div)`
  background: var(--bg-primary);
  padding: 2.5rem 2rem;
  border-radius: 1.25rem;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-card);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-500);
  }
  
  .feature-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-inverse);
  }
  
  .feature-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }
  
  .feature-description {
    color: var(--text-secondary);
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const StorySection = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  
  .story-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
  
  .story-content {
    max-width: 700px;
    margin: 0 auto;
    font-size: 1.125rem;
    color: var(--text-secondary);
    line-height: 1.8;
    text-align: left;
    
    p {
      margin-bottom: 1.5rem;
    }
    
    .highlight {
      color: var(--primary-500);
      font-weight: 600;
    }
  }
`;

const TechSection = styled.div`
  background: var(--bg-secondary);
  border-radius: 1.25rem;
  padding: 3.75rem 2.5rem;
  text-align: center;
  margin-bottom: 5rem;
  
  .tech-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
  
  .tech-description {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: 2.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .tech-item {
    background: var(--bg-primary);
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-light);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    box-shadow: var(--shadow-card);
  }
`;

const ContactSection = styled.div`
  text-align: center;
  
  .contact-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
  
  .contact-description {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
  
  .contact-info {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
    color: var(--text-inverse);
    padding: 2rem;
    border-radius: 1rem;
    display: inline-block;
    
    .contact-item {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

// ================================================================
// Component
// ================================================================
export default function AboutPage() {
  const features = [
    {
      icon: Train,
      title: "실시간 지하철 정보",
      description: "서울시 OpenAPI를 활용한 실시간 지하철 위치 정보를 바탕으로 생생한 게임 경험을 제공합니다."
    },
    {
      icon: GamepadIcon,
      title: "텍스트 어드벤처",
      description: "각 지하철역마다 숨겨진 독특한 스토리가 기다리고 있습니다. 당신의 선택이 이야기의 결말을 바꿉니다."
    },
    {
      icon: Users,
      title: "커뮤니티",
      description: "다른 플레이어들과 경험을 공유하고, 흥미로운 지하철 이야기를 나눠보세요."
    }
  ];

  const techStack = [
    "Next.js 15", "TypeScript", "Spring Boot 3.4", "PostgreSQL", 
    "Redis", "Docker", "AWS EC2", "GitHub Actions", "FastAPI", "LLM Integration"
  ];

  return (
    // 🔥 수정: PublicLayout → AppLayout으로 변경
    <AppLayout>
      <PageContainer>
        {/* Hero Section */}
        <HeroSection>
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Behindy
          </motion.h1>
          
          <motion.h2 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            지하철 노선도 기반 텍스트 어드벤처 게임
          </motion.h2>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            일상적인 지하철 공간을 신비로운 모험의 무대로 변화시키는 웹 기반 인터랙티브 게임입니다.
            실시간 지하철 정보와 AI 생성 스토리를 결합하여 독특한 경험을 제공합니다.
          </motion.p>
        </HeroSection>

        {/* Features */}
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="feature-icon">
                <feature.icon size={32} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>

        {/* Story Section */}
        <StorySection>
          <motion.h2 
            className="story-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            프로젝트 스토리
          </motion.h2>
          
          <motion.div 
            className="story-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <p>
              <span className="highlight">Behindy</span>는 "Behind(뒤편) + dy(동적)"의 합성어로, 
              일상적인 지하철역 뒤편에 숨겨진 동적인 이야기들을 발견한다는 의미를 담고 있습니다.
            </p>
            
            <p>
              매일 지나치는 익숙한 지하철역들이 갑자기 미스터리한 모험의 무대가 된다면 어떨까요? 
              각 역마다 <span className="highlight">AI가 생성한 독특한 스토리</span>가 기다리고 있으며, 
              플레이어의 선택에 따라 다양한 결말을 경험할 수 있습니다.
            </p>
            
            <p>
              이 프로젝트는 <span className="highlight">포트폴리오용 웹 애플리케이션</span>으로, 
              창의적인 아이디어와 최신 웹 기술을 결합하여 완성도 높은 서비스를 구현하는 것을 목표로 합니다.
              실시간 데이터 연동, 마이크로서비스 아키텍처, AI 통합 등 다양한 기술적 도전을 담고 있습니다.
            </p>
          </motion.div>
        </StorySection>

        {/* Tech Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <TechSection>
            <h2 className="tech-title">기술 스택</h2>
            <p className="tech-description">
              현대적인 웹 개발 기술과 클라우드 인프라를 활용하여 확장 가능하고 
              안정적인 서비스를 구축했습니다. 프론트엔드부터 AI 서버까지 
              전체 시스템을 직접 설계하고 구현했습니다.
            </p>
            
            <div className="tech-stack">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech}
                  className="tech-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.8 + index * 0.1 }}
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </TechSection>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <ContactSection>
            <h2 className="contact-title">개발자 정보</h2>
            <p className="contact-description">
              이 프로젝트는 웹 개발자 포트폴리오용으로 제작되었습니다.
              창의적인 아이디어와 기술적 완성도를 동시에 추구하며 개발했습니다.
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <strong>프로젝트:</strong> Behindy - 지하철 텍스트 어드벤처
              </div>
              <div className="contact-item">
                <strong>개발 기간:</strong> 2024.08 ~ 2025.09 (진행중)
              </div>
              <div className="contact-item">
                <strong>개발 규모:</strong> 풀스택 개인 프로젝트
              </div>
              <div className="contact-item">
                <strong>특징:</strong> AI 연동, 실시간 데이터, 마이크로서비스
              </div>
            </div>
          </ContactSection>
        </motion.div>
      </PageContainer>
    </AppLayout>
  );
}