"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Train, 
  GamepadIcon, 
  Users, 
} from 'lucide-react';
import { PublicLayout } from '@/components/layout';

// ================================================================
// Styled Components
// ================================================================

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
  
  @media (max-width: 900px) {
    padding: 24px 16px;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  .hero-title {
    font-size: 48px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: 36px;
    }
  }
  
  .hero-subtitle {
    font-size: 24px;
    color: #6b7280;
    margin-bottom: 32px;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
  
  .hero-description {
    font-size: 18px;
    color: #9ca3af;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 40px 32px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
  
  .feature-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .feature-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
  }
  
  .feature-description {
    color: #6b7280;
    line-height: 1.6;
    font-size: 16px;
  }
`;

const StorySection = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  .story-title {
    font-size: 36px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 24px;
  }
  
  .story-content {
    max-width: 700px;
    margin: 0 auto;
    font-size: 18px;
    color: #6b7280;
    line-height: 1.8;
    text-align: left;
    
    p {
      margin-bottom: 24px;
    }
    
    .highlight {
      color: #667eea;
      font-weight: 600;
    }
  }
`;

const TechSection = styled.div`
  background: #f8fafc;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  margin-bottom: 80px;
  
  .tech-title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 24px;
  }
  
  .tech-description {
    font-size: 18px;
    color: #6b7280;
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
  }
  
  .tech-item {
    background: white;
    padding: 12px 24px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ContactSection = styled.div`
  text-align: center;
  
  .contact-title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 24px;
  }
  
  .contact-description {
    font-size: 18px;
    color: #6b7280;
    margin-bottom: 32px;
  }
  
  .contact-info {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 32px;
    border-radius: 16px;
    display: inline-block;
    
    .contact-item {
      font-size: 16px;
      margin-bottom: 8px;
      
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
    "Redis", "Docker", "AWS EC2", "GitHub Actions"
  ];

  return (
    <PublicLayout>
      <Container>
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
            일상적인 지하철 공간을 특별한 모험의 무대로 바꾸는 새로운 경험을 제공합니다.
            실시간 데이터와 창의적인 스토리텔링이 만나 탄생한 혁신적인 게임입니다.
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
              <span className="highlight">Behindy</span>는 &quot;behind&quot;와 &quot;discovery&quot;의 합성어로,
              일상적인 지하철 공간 뒤에 숨겨진 특별한 이야기들을 발견한다는 의미를 담고 있습니다.
            </p>
            
            <p>
              많은 사람들이 매일 이용하는 지하철이지만, 각 역마다 고유한 역사와 문화, 
              그리고 수많은 사람들의 이야기가 숨어있습니다. 이런 평범한 공간을 
              <span className="highlight">게임의 무대</span>로 만들어 새로운 재미를 제공하고자 했습니다.
            </p>
            
            <p>
              실시간 지하철 데이터를 활용하여 현실과 게임이 연결되는 경험을 만들고, 
              각 노선마다 다른 테마의 스토리를 통해 플레이어들에게 
              <span className="highlight">몰입감 있는 어드벤처</span>를 선사합니다.
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
              현대적인 웹 기술과 안정적인 백엔드 아키텍처를 바탕으로 구축되었습니다.
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
            </p>
            
            <div className="contact-info">
              <div className="contact-item">
                <strong>프로젝트:</strong> Behindy - 지하철 텍스트 어드벤처
              </div>
              <div className="contact-item">
                <strong>개발 기간:</strong> 2024년 하반기
              </div>
              <div className="contact-item">
                <strong>목적:</strong> 웹 개발자 취업용 포트폴리오
              </div>
            </div>
          </ContactSection>
        </motion.div>
      </Container>
    </PublicLayout>
  );
}