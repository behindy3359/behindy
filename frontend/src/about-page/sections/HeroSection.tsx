'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FileText, Zap, Calendar, Code } from 'lucide-react';

const HeroContainer = styled.section`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 900px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.a`
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  color: var(--text-inverse);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-button);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const SecondaryButton = styled.a`
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background: transparent;
  color: var(--primary-500);
  border: 2px solid var(--primary-500);
  border-radius: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-secondary);
    transform: translateY(-2px);
  }
`;

const StatsBadges = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1000px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const StatBadge = styled(motion.div)`
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-500);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: var(--primary-500);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);

  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`;

export default function HeroSection() {
  return (
    <HeroContainer>
      <HeroContent>
        <HeroTitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          지하철역에서 시작되는
          <br />
          당신만의 이야기
        </HeroTitle>

        <HeroSubtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          실시간 위치 기반 텍스트 어드벤처 게임
        </HeroSubtitle>

        <CTAButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <PrimaryButton href="/">게임 시작하기</PrimaryButton>
          <SecondaryButton href="#demo">데모 영상 보기</SecondaryButton>
        </CTAButtons>

        <StatsBadges
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <StatBadge
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <StatIcon>
              <FileText size={32} />
            </StatIcon>
            <StatValue>132개</StatValue>
            <StatLabel>지하철역</StatLabel>
          </StatBadge>

          <StatBadge
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <StatIcon>
              <Zap size={32} />
            </StatIcon>
            <StatValue>50+</StatValue>
            <StatLabel>API 엔드포인트</StatLabel>
          </StatBadge>

          <StatBadge
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <StatIcon>
              <Calendar size={32} />
            </StatIcon>
            <StatValue>7개월</StatValue>
            <StatLabel>개발 기간</StatLabel>
          </StatBadge>

          <StatBadge
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <StatIcon>
              <Code size={32} />
            </StatIcon>
            <StatValue>27,000+</StatValue>
            <StatLabel>코드 라인</StatLabel>
          </StatBadge>
        </StatsBadges>
      </HeroContent>
    </HeroContainer>
  );
}
