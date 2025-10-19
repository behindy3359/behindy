'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles, Train, Gamepad2 } from 'lucide-react';

const IntroContainer = styled.section`
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TextBlock = styled(motion.div)`
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-500);
    box-shadow: var(--shadow-lg);
  }
`;

const BlockTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: 1rem;
`;

const BlockText = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--text-secondary);
`;

const RightColumn = styled.div``;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(10px);
    border-color: var(--primary-500);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div`
  flex-shrink: 0;
  color: var(--primary-500);
  margin-top: 0.25rem;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
`;

export default function ProjectIntroSection() {
  return (
    <IntroContainer>
      <SectionTitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        일상 속 지하철이 게임이 되는 순간
      </SectionTitle>
      <SectionSubtitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        매일 지나치는 지하철역에 이야기를 불어넣었습니다
      </SectionSubtitle>

      <ContentGrid>
        <LeftColumn>
          <TextBlock
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <BlockTitle>🤔 문제 인식</BlockTitle>
            <BlockText>
              출퇴근 시간, 지루한 지하철 안에서 무엇을 하시나요?
              <br />
              <br />
              우리는 매일 지나치는 지하철역에 새로운 의미를 부여하고자 했습니다.
            </BlockText>
          </TextBlock>

          <TextBlock
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <BlockTitle>💡 솔루션</BlockTitle>
            <BlockText>
              강남역에 도착하면 → 강남역의 스토리 시작
              <br />
              홍대입구역에 가면 → 홍대입구역의 모험 시작
              <br />
              <br />
              실제 위치와 연동되는 132개 역의 텍스트 어드벤처 게임
            </BlockText>
          </TextBlock>
        </LeftColumn>

        <RightColumn>
          <FeatureList>
            <FeatureItem
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <FeatureIcon>
                <Sparkles size={28} />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>AI가 자동으로 생성하는 스토리</FeatureTitle>
                <FeatureDescription>
                  OpenAI GPT-4o-mini가 역마다 고유한 스토리를 생성합니다.
                  5단계 품질 검증을 거쳐 98%의 성공률을 달성했습니다.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
            >
              <FeatureIcon>
                <Train size={28} />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>실시간 지하철 API 연동</FeatureTitle>
                <FeatureDescription>
                  서울시 공공 API와 연동하여 실제 지하철 위치 정보를 활용합니다.
                  Redis 캐싱으로 외부 API 호출을 99% 감소시켰습니다.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <FeatureIcon>
                <Gamepad2 size={28} />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>선택지에 따라 달라지는 엔딩</FeatureTitle>
                <FeatureDescription>
                  매 장면마다 2가지 선택지를 제공합니다. 선택에 따라 체력과
                  정신력이 변화하며, 여러 엔딩으로 이어집니다.
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          </FeatureList>
        </RightColumn>
      </ContentGrid>
    </IntroContainer>
  );
}
