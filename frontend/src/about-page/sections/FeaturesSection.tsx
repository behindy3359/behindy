'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapPin, Scale, Bot } from 'lucide-react';

const FeaturesContainer = styled.section`
  padding: 5rem 2rem;
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    border-color: var(--primary-500);
    box-shadow: var(--shadow-lg);
  }
`;

const IconCircle = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--text-inverse);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: center;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
`;

const TechBadge = styled.span`
  padding: 0.375rem 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-medium);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
`;

const FeatureMetric = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-inverse);
  font-weight: 600;
  margin-bottom: 1rem;
`;

export default function FeaturesSection() {
  return (
    <FeaturesContainer>
      <SectionTitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        어떻게 플레이하나요?
      </SectionTitle>
      <SectionSubtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        3가지 핵심 메커니즘으로 구성된 게임 시스템
      </SectionSubtitle>

      <FeaturesGrid>
        <FeatureCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <IconCircle>
            <MapPin size={32} />
          </IconCircle>
          <CardTitle>위치 기반 게임 시작</CardTitle>
          <FeatureMetric>132개 역 지원</FeatureMetric>
          <CardDescription>
            강남역에 있다면 강남역 스토리, 홍대입구역에 있다면 홍대입구 스토리.
            서울시 실시간 지하철 API로 위치를 확인하고 게임을 시작합니다.
          </CardDescription>

          <TechStack>
            <TechBadge>Seoul Open API</TechBadge>
            <TechBadge>Redis 캐싱 (30초 TTL)</TechBadge>
            <TechBadge>Geolocation API</TechBadge>
          </TechStack>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <IconCircle>
            <Scale size={32} />
          </IconCircle>
          <CardTitle>선택지와 스탯 관리</CardTitle>
          <FeatureMetric>2가지 선택지 × 다중 엔딩</FeatureMetric>
          <CardDescription>
            매 장면마다 2가지 선택지를 제공합니다. 선택에 따라 체력과 정신력이
            변화하며, 체력 0이면 사망, 정신력 0이면 광기 엔딩으로 이어집니다.
          </CardDescription>

          <TechStack>
            <TechBadge>복잡한 상태 관리</TechBadge>
            <TechBadge>트랜잭션 처리</TechBadge>
            <TechBadge>실시간 애니메이션</TechBadge>
          </TechStack>
        </FeatureCard>

        <FeatureCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <IconCircle>
            <Bot size={32} />
          </IconCircle>
          <CardTitle>AI 생성 스토리</CardTitle>
          <FeatureMetric>98% 생성 성공률</FeatureMetric>
          <CardDescription>
            OpenAI GPT-4o-mini가 만드는 끝없는 스토리. 역마다 최소 2개 이상
            보장되며, 5단계 품질 검증 시스템을 거쳐 매일 새로운 스토리가
            자동으로 생성됩니다.
          </CardDescription>

          <TechStack>
            <TechBadge>LLM 프롬프트 엔지니어링</TechBadge>
            <TechBadge>5단계 품질 검증</TechBadge>
            <TechBadge>자동 배치 시스템</TechBadge>
          </TechStack>
        </FeatureCard>
      </FeaturesGrid>
    </FeaturesContainer>
  );
}
