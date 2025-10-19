'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Server, Database, Cpu, Package } from 'lucide-react';

const TechStackContainer = styled.section`
  padding: 5rem 2rem;
  background: var(--bg-secondary);
  border-radius: 1.25rem;
  margin-bottom: 3rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.125rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 4rem;
`;

const ArchitectureDiagram = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const ServerBox = styled(motion.div)`
  background: var(--bg-primary);
  border: 2px solid var(--border-light);
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  min-width: 280px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    border-color: var(--primary-500);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 640px) {
    min-width: 100%;
  }
`;

const ServerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ServerIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverse);
`;

const ServerInfo = styled.div`
  flex: 1;
`;

const ServerTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const ServerSubtitle = styled.div`
  font-size: 0.875rem;
  color: var(--primary-500);
  font-weight: 600;
`;

const TechList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TechItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);

  &::before {
    content: '•';
    color: var(--primary-500);
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const ArrowIcon = styled.div`
  font-size: 2rem;
  color: var(--primary-500);
  font-weight: bold;

  @media (max-width: 1024px) {
    transform: rotate(90deg);
  }
`;

const InfrastructureBar = styled(motion.div)`
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-card);
`;

const InfraTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const InfraBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

const InfraBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-medium);
  border-radius: 0.75rem;
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
    color: var(--text-inverse);
    border-color: var(--primary-500);
    transform: translateY(-2px);
  }
`;

export default function TechStackSection() {
  return (
    <TechStackContainer>
      <SectionTitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        최신 기술로 구현된 실전 프로젝트
      </SectionTitle>
      <SectionSubtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        마이크로서비스 아키텍처 기반 3-Tier 구조
      </SectionSubtitle>

      <ArchitectureDiagram>
        <ServerBox
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <ServerHeader>
            <ServerIcon>
              <Server size={28} />
            </ServerIcon>
            <ServerInfo>
              <ServerTitle>Frontend</ServerTitle>
              <ServerSubtitle>Next.js 15</ServerSubtitle>
            </ServerInfo>
          </ServerHeader>
          <TechList>
            <TechItem>React 19</TechItem>
            <TechItem>TypeScript 5</TechItem>
            <TechItem>Zustand 5 (전역 상태)</TechItem>
            <TechItem>TanStack Query (서버 상태)</TechItem>
            <TechItem>D3.js (데이터 시각화)</TechItem>
          </TechList>
        </ServerBox>

        <ArrowIcon>→</ArrowIcon>

        <ServerBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <ServerHeader>
            <ServerIcon>
              <Database size={28} />
            </ServerIcon>
            <ServerInfo>
              <ServerTitle>Backend</ServerTitle>
              <ServerSubtitle>Spring Boot 3.4</ServerSubtitle>
            </ServerInfo>
          </ServerHeader>
          <TechList>
            <TechItem>Java 21</TechItem>
            <TechItem>PostgreSQL 15</TechItem>
            <TechItem>Redis 7 (캐싱)</TechItem>
            <TechItem>JWT Security</TechItem>
            <TechItem>JPA/Hibernate</TechItem>
          </TechList>
        </ServerBox>

        <ArrowIcon>→</ArrowIcon>

        <ServerBox
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <ServerHeader>
            <ServerIcon>
              <Cpu size={28} />
            </ServerIcon>
            <ServerInfo>
              <ServerTitle>AI Server</ServerTitle>
              <ServerSubtitle>FastAPI</ServerSubtitle>
            </ServerInfo>
          </ServerHeader>
          <TechList>
            <TechItem>Python 3.11</TechItem>
            <TechItem>OpenAI GPT-4o-mini</TechItem>
            <TechItem>Claude API</TechItem>
            <TechItem>Pydantic (검증)</TechItem>
            <TechItem>비동기 처리</TechItem>
          </TechList>
        </ServerBox>
      </ArchitectureDiagram>

      <InfrastructureBar
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <InfraTitle>
          <Package size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
          인프라 & DevOps
        </InfraTitle>
        <InfraBadges>
          <InfraBadge>Docker</InfraBadge>
          <InfraBadge>Docker Compose</InfraBadge>
          <InfraBadge>AWS EC2 (Ubuntu 22.04)</InfraBadge>
          <InfraBadge>Nginx (리버스 프록시 + SSL)</InfraBadge>
          <InfraBadge>GitHub Actions (CI/CD)</InfraBadge>
        </InfraBadges>
      </InfrastructureBar>
    </TechStackContainer>
  );
}
