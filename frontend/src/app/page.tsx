"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Mail, Lock, Search, Heart, Settings } from 'lucide-react';
import { Button, Input, Modal, ModalConfirm } from '../components/ui/index';

const ExampleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Section = styled.section`
  margin-bottom: 60px;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 16px;
  }
  
  .example-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .example-row {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const CodeBlock = styled.pre`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  overflow-x: auto;
  color: #374151;
  margin-top: 16px;
`;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleLoadingTest = () => {
    setIsLoadingButton(true);
    setTimeout(() => setIsLoadingButton(false), 3000);
  };

  return (
    <ExampleContainer>
      <h1 style={{ 
        fontSize: '36px', 
        fontWeight: '800', 
        color: '#111827', 
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        Behindy UI 컴포넌트 라이브러리
      </h1>
      <p style={{ 
        textAlign: 'center', 
        color: '#6b7280', 
        fontSize: '18px', 
        marginBottom: '60px' 
      }}>
        포트폴리오 프로젝트를 위한 재사용 가능한 UI 컴포넌트들
      </p>

      {/* Button 컴포넌트 예시 */}
      <Section>
        <h2>🎯 Button 컴포넌트</h2>
        <p>다양한 스타일과 상태를 지원하는 버튼 컴포넌트입니다.</p>
        
        <Grid>
          <Card>
            <h3>기본 변형 (Variants)</h3>
            <div className="example-group">
              <div className="example-row">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="example-row">
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <CodeBlock>{`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`}</CodeBlock>
          </Card>

          <Card>
            <h3>크기 및 상태</h3>
            <div className="example-group">
              <div className="example-row">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="example-row">
                <Button disabled>Disabled</Button>
                <Button 
                  isLoading={isLoadingButton} 
                  onClick={handleLoadingTest}
                >
                  {isLoadingButton ? 'Loading...' : 'Test Loading'}
                </Button>
              </div>
            </div>
            <CodeBlock>{`<Button size="sm">Small</Button>
<Button isLoading={true}>Loading...</Button>
<Button disabled>Disabled</Button>`}</CodeBlock>
          </Card>

          <Card>
            <h3>아이콘 및 전체 너비</h3>
            <div className="example-group">
              <div className="example-row">
                <Button icon={<User />}>사용자</Button>
                <Button icon={<Heart />} iconPosition="right">좋아요</Button>
              </div>
              <Button fullWidth variant="secondary" icon={<Settings />}>
                전체 너비 버튼
              </Button>
            </div>
            <CodeBlock>{`<Button icon={<User />}>사용자</Button>
<Button fullWidth variant="secondary">전체 너비</Button>`}</CodeBlock>
          </Card>
        </Grid>
      </Section>

      {/* Input 컴포넌트 예시 */}
      <Section>
        <h2>📝 Input 컴포넌트</h2>
        <p>다양한 타입과 상태를 지원하는 입력 필드 컴포넌트입니다.</p>
        
        <Grid>
          <Card>
            <h3>기본 입력 필드</h3>
            <div className="example-group">
              <Input
                label="사용자 이름"
                placeholder="이름을 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                leftIcon={<User />}
              />
              <Input
                label="이메일"
                type="email"
                placeholder="email@example.com"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                leftIcon={<Mail />}
                helperText="올바른 이메일 형식을 입력하세요"
              />
            </div>
            <CodeBlock>{`<Input
  label="사용자 이름"
  placeholder="이름을 입력하세요"
  leftIcon={<User />}
/>`}</CodeBlock>
          </Card>

          <Card>
            <h3>패스워드 및 상태</h3>
            <div className="example-group">
              <Input
                label="패스워드"
                type="password"
                placeholder="패스워드를 입력하세요"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
              <Input
                label="성공 상태"
                placeholder="올바른 입력"
                success="입력이 유효합니다!"
                defaultValue="valid@email.com"
              />
              <Input
                label="에러 상태"
                placeholder="잘못된 입력"
                error="이메일 형식이 올바르지 않습니다"
                defaultValue="invalid-email"
              />
            </div>
            <CodeBlock>{`<Input
  type="password"
  label="패스워드"
/>
<Input
  error="에러 메시지"
  success="성공 메시지"
/>`}</CodeBlock>
          </Card>

          <Card>
            <h3>변형 및 크기</h3>
            <div className="example-group">
              <Input
                variant="filled"
                placeholder="Filled variant"
                leftIcon={<Search />}
              />
              <Input
                variant="outline"
                placeholder="Outline variant"
                size="sm"
              />
              <Input
                placeholder="Large size"
                size="lg"
                isLoading={true}
              />
            </div>
            <CodeBlock>{`<Input variant="filled" />
<Input variant="outline" size="sm" />
<Input size="lg" isLoading={true} />`}</CodeBlock>
          </Card>
        </Grid>
      </Section>

      {/* Modal 컴포넌트 예시 */}
      <Section>
        <h2>🪟 Modal 컴포넌트</h2>
        <p>다양한 크기와 애니메이션을 지원하는 모달 컴포넌트입니다.</p>
        
        <Grid>
          <Card>
            <h3>기본 모달</h3>
            <div className="example-group">
              <div className="example-row">
                <Button onClick={() => setIsModalOpen(true)}>
                  기본 모달 열기
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  확인 모달 열기
                </Button>
              </div>
            </div>
            <CodeBlock>{`<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="모달 제목"
>
  모달 내용
</Modal>`}</CodeBlock>
          </Card>

          <Card>
            <h3>모달 기능</h3>
            <div className="example-group">
              <ul style={{ color: '#6b7280', lineHeight: '1.8' }}>
                <li>ESC 키로 닫기</li>
                <li>백드롭 클릭으로 닫기</li>
                <li>다양한 크기 (sm, md, lg, xl, full)</li>
                <li>애니메이션 변형 (default, center, slide-up, slide-right)</li>
                <li>커스텀 헤더/푸터 지원</li>
                <li>포털을 통한 body 레벨 렌더링</li>
              </ul>
            </div>
          </Card>
        </Grid>
      </Section>

      {/* 모달들 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Behindy 프로젝트 소개"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              확인
            </Button>
          </div>
        }
      >
        <div style={{ lineHeight: '1.6', color: '#374151' }}>
          <p>지하철 노선도 기반 텍스트 어드벤처 게임 프로젝트입니다.</p>
          <ul style={{ paddingLeft: '20px', marginTop: '16px' }}>
            <li>Spring Boot + Next.js + FastAPI 기술 스택</li>
            <li>JWT 인증 + Redis 세션 관리</li>
            <li>PostgreSQL + JPA/Hibernate</li>
            <li>Docker 컨테이너화 + AWS 배포</li>
          </ul>
          <p style={{ marginTop: '16px' }}>
            이 UI 컴포넌트들은 해당 프로젝트에서 사용될 예정입니다.
          </p>
        </div>
      </Modal>

      <ModalConfirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          alert('확인되었습니다!');
        }}
        title="작업 확인"
        message="정말로 이 작업을 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="진행"
        cancelText="취소"
        variant="danger"
      />

      {/* 사용법 안내 */}
      <Section>
        <h2>🚀 사용법</h2>
        <p>컴포넌트를 프로젝트에서 사용하는 방법입니다.</p>
        
        <Card>
          <h3>Import 방법</h3>
          <CodeBlock>{`// 개별 import
import { Button, Input, Modal } from '@/components/ui';

// 또는 구체적 경로
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';`}</CodeBlock>
        </Card>

        <Card style={{ marginTop: '24px' }}>
          <h3>의존성</h3>
          <ul style={{ color: '#6b7280', lineHeight: '1.8' }}>
            <li><strong>styled-components</strong>: CSS-in-JS 스타일링</li>
            <li><strong>framer-motion</strong>: 애니메이션 효과</li>
            <li><strong>lucide-react</strong>: 아이콘 라이브러리</li>
            <li><strong>react</strong>: React 18+ (forwardRef, createPortal 사용)</li>
          </ul>
        </Card>
      </Section>
    </ExampleContainer>
  );
}