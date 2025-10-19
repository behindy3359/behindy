"use client";

import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { AboutLayout } from '@/features/about/components/AboutLayout';
import { AboutSection } from '@/features/about/styles';

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    background: var(--bg-primary);
    border-color: var(--primary-500);
    transform: translateX(-4px);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(-2px);
  }
`;

const troubleshootingData: Record<string, {
  title: string;
  description: string;
  problem: string;
  solution: string;
  result: string;
}> = {
  'realtime-data': {
    title: '실시간 데이터 처리',
    description: '서울시 OpenAPI와의 연동 및 최적화',
    problem: '서울시 지하철 실시간 위치 API는 1분마다 업데이트되지만, 모든 호선의 데이터를 한 번에 요청하면 응답 시간이 길어지고 불필요한 데이터 전송이 발생했습니다.',
    solution: '사용자가 현재 보고 있는 호선의 데이터만 선택적으로 요청하도록 변경했습니다. 또한 Redis를 활용하여 1분간 캐싱하여 동일한 데이터를 중복 요청하지 않도록 최적화했습니다.',
    result: 'API 응답 시간이 평균 2초에서 0.3초로 개선되었고, 서버 부하도 약 70% 감소했습니다.',
  },
  'performance': {
    title: '성능 최적화',
    description: '지하철 맵 렌더링 성능 개선',
    problem: '지하철 노선도는 수백 개의 역과 노선을 SVG로 렌더링하는데, 모든 요소를 한 번에 그리면 초기 로딩 시간이 3-4초나 걸렸습니다.',
    solution: 'React의 useMemo를 활용하여 노선 데이터를 메모이제이션하고, 뷰포트에 보이는 영역만 렌더링하는 가상화 기법을 적용했습니다. 또한 자주 변경되지 않는 배경 요소는 별도 레이어로 분리했습니다.',
    result: '초기 로딩 시간이 0.8초로 단축되었고, 줌/팬 동작이 60fps로 부드럽게 동작하게 되었습니다.',
  },
  'ai-optimization': {
    title: 'AI 응답 최적화',
    description: 'LLM 응답 속도 및 품질 개선',
    problem: 'OpenAI API 호출 시 응답 시간이 5-10초로 길어 사용자 경험이 저하되었고, 가끔 컨텍스트를 벗어난 응답이 생성되었습니다.',
    solution: '프롬프트를 구조화하여 필수 정보만 포함하도록 최적화했고, temperature 값을 0.7로 조정하여 일관성을 높였습니다. 또한 스트리밍 응답을 활용하여 사용자가 실시간으로 텍스트를 확인할 수 있도록 개선했습니다.',
    result: '체감 응답 속도가 즉각적으로 개선되었고, 스토리 품질 만족도가 85%로 향상되었습니다.',
  },
};

export default function TroubleshootingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const data = troubleshootingData[id];

  if (!data) {
    return (
      <AboutLayout title="페이지를 찾을 수 없습니다">
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={18} />
          뒤로 가기
        </BackButton>
        <AboutSection>
          <p className="section-content">
            요청하신 트러블슈팅 내용을 찾을 수 없습니다.
          </p>
        </AboutSection>
      </AboutLayout>
    );
  }

  return (
    <AboutLayout
      title={data.title}
      description={data.description}
    >
      <BackButton onClick={() => router.back()}>
        <ArrowLeft size={18} />
        개발 과정으로 돌아가기
      </BackButton>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">문제 상황</h2>
        <div className="section-content">
          <p>{data.problem}</p>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="section-title">해결 방법</h2>
        <div className="section-content">
          <p>{data.solution}</p>
        </div>
      </AboutSection>

      <AboutSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="section-title">결과</h2>
        <div className="section-content">
          <p>{data.result}</p>
        </div>
      </AboutSection>
    </AboutLayout>
  );
}
