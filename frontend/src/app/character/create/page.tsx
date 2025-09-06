"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, AlertCircle, ArrowRight, Info, Home, ArrowLeft } from 'lucide-react';
import { api } from '@/config/axiosConfig';
import { useAuthStore } from '@/shared/store/authStore';
import { useToast } from '@/shared/store/uiStore';
import { Button } from '@/shared/components/ui/button/Button';
import { Input } from '@/shared/components/ui/input/Input';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { Character } from '@/features/game/types/gameTypes';

// 랜덤 이름 생성용 데이터
const RANDOM_NAMES = {
  prefix: ['용감한', '지혜로운', '빠른', '강한', '영리한', '날렵한', '침착한', '대담한', '신중한', '열정적인'],
  suffix: ['모험가', '탐험가', '여행자', '수호자', '개척자', '발견자', '관찰자', '기록자', '안내자', '추적자']
};

export default function CharacterCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { isAuthenticated } = useAuthStore();

  // 🔥 URL 파라미터에서 원래 목적지 정보 추출
  const returnUrl = searchParams.get('returnUrl') || '/';
  const stationName = searchParams.get('station');
  const lineNumber = searchParams.get('line');

  // 상태
  const [charName, setCharName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [existingCharacter, setExistingCharacter] = useState<Character | null>(null);
  const [nameError, setNameError] = useState('');

  // 기존 캐릭터 확인
  const checkExistingCharacter = async () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsChecking(true);
      
      console.log('📡 [Character Create] API 요청: /characters/exists');
      
      const response = await api.get<{
        success: boolean;
        message: string;
        data: Character | null;
      }>('/characters/exists');

      console.log('✅ [Character Create] Character exists response:', {
        success: response.success,
        message: response.message,
        hasData: !!response.data,
        charName: response.data?.charName
      });

      if (response.success && response.data) {
        setExistingCharacter(response.data);
      }
    } catch (error: any) {
      console.log('⚠️ [Character Create] Character check error:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        isNotFound: error.response?.status === 404
      });
      
      // 404는 정상 (캐릭터 없음)
      if (error.response?.status !== 404) {
        console.error('❌ [Character Create] Unexpected error:', error);
      }
    } finally {
      setIsChecking(false);
    }
  };

  // 랜덤 이름 생성
  const generateRandomName = () => {
    const prefix = RANDOM_NAMES.prefix[Math.floor(Math.random() * RANDOM_NAMES.prefix.length)];
    const suffix = RANDOM_NAMES.suffix[Math.floor(Math.random() * RANDOM_NAMES.suffix.length)];
    setCharName(`${prefix}${suffix}`);
    setNameError('');
  };

  // 이름 유효성 검사
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('이름을 입력해주세요');
      return false;
    }
    if (name.length < 2) {
      setNameError('이름은 2자 이상이어야 합니다');
      return false;
    }
    if (name.length > 20) {
      setNameError('이름은 20자 이하여야 합니다');
      return false;
    }
    const nameRegex = /^[가-힣a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('한글, 영문, 숫자만 사용 가능합니다');
      return false;
    }
    return true;
  };

  // 캐릭터 생성
  const handleCreateCharacter = async () => {
    if (!validateName(charName)) {
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('🎮 [캐릭터 생성] API 요청 시작:', {
        timestamp: new Date().toISOString(),
        charName: charName.trim(),
        originalDestination: { stationName, lineNumber, returnUrl }
      });

      const response = await api.post<Character>('/characters', {
        charName: charName.trim()
      });

      console.log('✅ [캐릭터 생성] API 응답 성공:', {
        timestamp: new Date().toISOString(),
        response: {
          charId: response.charId,
          charName: response.charName,
          charHealth: response.charHealth,
          charSanity: response.charSanity,
          isAlive: response.isAlive,
          statusMessage: response.statusMessage
        }
      });

      toast.success(`캐릭터 '${response.charName}'이 생성되었습니다!`);
      
      // 🔥 원래 목적지로 이동 (역 클릭에서 온 경우 게임으로, 아니면 홈으로)
      if (stationName && lineNumber) {
        console.log('🎯 [캐릭터 생성] 게임으로 복귀:', { stationName, lineNumber });
        const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
        router.push(gameUrl);
      } else if (returnUrl && returnUrl !== '/') {
        console.log('🎯 [캐릭터 생성] 원래 페이지로 복귀:', returnUrl);
        router.push(returnUrl);
      } else {
        console.log('🎯 [캐릭터 생성] 홈으로 이동');
        router.push('/');
      }
    } catch (error: any) {
      console.error('❌ [캐릭터 생성] API 요청 실패:', {
        timestamp: new Date().toISOString(),
        error,
        charName: charName.trim()
      });

      let errorMessage = '캐릭터 생성에 실패했습니다';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response: { 
            status: number;
            data: { message: string };
            statusText?: string;
          };
          message?: string;
        };

        errorMessage = axiosError.response?.data?.message || errorMessage;
        
        if (axiosError.response?.status === 409) {
          // 이미 캐릭터가 있다는 에러인 경우 다시 확인
          checkExistingCharacter();
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 기존 캐릭터로 계속하기 (원래 목적지로)
  const handleContinueWithExisting = () => {
    if (stationName && lineNumber) {
      console.log('🎯 [기존 캐릭터] 게임으로 진입:', { stationName, lineNumber });
      const gameUrl = `/game?station=${encodeURIComponent(stationName)}&line=${lineNumber}`;
      router.push(gameUrl);
    } else if (returnUrl && returnUrl !== '/') {
      router.push(returnUrl);
    } else {
      router.push('/');
    }
  };

  // 🔥 홈으로 돌아가기
  const handleGoHome = () => {
    router.push('/');
  };

  // 기존 캐릭터 포기하고 새로 만들기
  const handleAbandonAndCreate = async () => {
    if (!existingCharacter) return;

    if (!confirm(`정말로 '${existingCharacter.charName}' 캐릭터를 포기하고 새로 만드시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('🚪 [Character Create] 게임 포기 시도...');
      
      await api.post('/game/quit');
      
      console.log('✅ [Character Create] 게임 포기 성공');
      
      setExistingCharacter(null);
      toast.info('이전 캐릭터를 포기했습니다. 새로운 캐릭터를 만들어주세요.');
    } catch (error: any) {
      console.error('❌ [Character Create] 캐릭터 포기 실패:', error);
      toast.error('캐릭터 포기에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkExistingCharacter();
  }, []);

  // 로딩 중
  if (isChecking) {
    return (
      <AppLayout>
        <Container>
          <LoadingState>
            <Spinner />
            <p>캐릭터 정보를 확인하는 중...</p>
          </LoadingState>
        </Container>
      </AppLayout>
    );
  }

  // 🔥 이미 캐릭터가 있는 경우 - 개선된 UI
  if (existingCharacter) {
    return (
      <AppLayout>
        <Container>
          <CreateCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader>
              <CardTitle>
                <User size={24} />
                이미 캐릭터가 있습니다
              </CardTitle>
            </CardHeader>

            <ExistingCharacterInfo>
              <CharacterCard>
                <CharacterIcon>
                  <User size={48} />
                </CharacterIcon>
                <CharacterDetails>
                  <CharacterName>{existingCharacter.charName}</CharacterName>
                  <CharacterStats>
                    <StatItem>
                      <StatLabel>체력</StatLabel>
                      <StatValue $type="health">{existingCharacter.charHealth}/100</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>정신력</StatLabel>
                      <StatValue $type="sanity">{existingCharacter.charSanity}/100</StatValue>
                    </StatItem>
                  </CharacterStats>
                  <StatusBadge $status={existingCharacter.statusMessage}>
                    {existingCharacter.statusMessage}
                  </StatusBadge>
                </CharacterDetails>
              </CharacterCard>

              <InfoMessage>
                <Info size={16} />
                <span>한 번에 하나의 캐릭터만 플레이할 수 있습니다.</span>
              </InfoMessage>

              {/* 🔥 원래 목적지 정보 표시 */}
              {stationName && lineNumber && (
                <DestinationInfo>
                  <span>🚉 목적지: {stationName}역 {lineNumber}호선</span>
                </DestinationInfo>
              )}

              <ButtonGroup>
                {/* 🔥 상황에 맞는 버튼 텍스트 */}
                <Button
                  onClick={handleContinueWithExisting}
                  size="lg"
                  fullWidth
                  rightIcon={stationName && lineNumber ? <ArrowRight size={20} /> : <Home size={20} />}
                >
                  {stationName && lineNumber 
                    ? `${stationName}역으로 이동하기` 
                    : '이 캐릭터로 계속하기'
                  }
                </Button>
                
                {/* 🔥 홈으로 돌아가기 버튼 추가 */}
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  size="lg"
                  fullWidth
                  leftIcon={<Home size={20} />}
                >
                  홈으로 돌아가기
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleAbandonAndCreate}
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                >
                  포기하고 새로 만들기
                </Button>
              </ButtonGroup>
            </ExistingCharacterInfo>
          </CreateCard>
        </Container>
      </AppLayout>
    );
  }

  // 새 캐릭터 생성 UI (기존과 동일)
  return (
    <AppLayout>
      <Container>
        <CreateCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>
              <Sparkles size={24} />
              새로운 캐릭터 만들기
            </CardTitle>
            <CardDescription>
              {stationName && lineNumber ? (
                <>
                  <strong>{stationName}역 {lineNumber}호선</strong>에서 펼쳐질 모험을 위해<br />
                  새로운 캐릭터를 생성하세요
                </>
              ) : (
                <>지하철 모험을 함께할 캐릭터를 생성하세요</>
              )}
            </CardDescription>
          </CardHeader>

          <FormSection>
            <FormGroup>
              <Input
                label="캐릭터 이름"
                placeholder="캐릭터의 이름을 입력하세요"
                value={charName}
                onChange={(e) => {
                  setCharName(e.target.value);
                  setNameError('');
                }}
                error={nameError}
                fullWidth
                size="lg"
                leftIcon={<User size={20} />}
              />
              <NameHelper>
                <span>{charName.length}/20</span>
                <RandomButton
                  type="button"
                  onClick={generateRandomName}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={14} />
                  랜덤 생성
                </RandomButton>
              </NameHelper>
            </FormGroup>

            <InfoBox>
              <InfoTitle>캐릭터 정보</InfoTitle>
              <InfoList>
                <InfoItem><span>• 초기 체력: 100</span></InfoItem>
                <InfoItem><span>• 초기 정신력: 100</span></InfoItem>
                <InfoItem><span>• 선택에 따라 능력치가 변화합니다</span></InfoItem>
                <InfoItem><span>• 체력이나 정신력이 0이 되면 게임 오버</span></InfoItem>
              </InfoList>
            </InfoBox>

            <Button
              onClick={handleCreateCharacter}
              size="lg"
              fullWidth
              disabled={!charName.trim() || isLoading}
              isLoading={isLoading}
              rightIcon={<ArrowRight size={20} />}
            >
              캐릭터 생성하기
            </Button>

            {/* 🔥 뒤로가기 버튼 추가 */}
            <Button
              variant="outline"
              onClick={handleGoHome}
              size="lg"
              fullWidth
              leftIcon={<ArrowLeft size={20} />}
            >
              취소
            </Button>
          </FormSection>
        </CreateCard>
      </Container>
    </AppLayout>
  );
}

// 🔥 추가된 스타일 컴포넌트들
const DestinationInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

// 기존 스타일 컴포넌트들 (동일)...
// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]};
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const CreateCard = styled(motion.div)`
  width: 100%;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[500]}10 0%, 
    ${({ theme }) => theme.colors.secondary[500]}10 100%
  );
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  text-align: center;
`;

const CardTitle = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const FormSection = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NameHelper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const RandomButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const InfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const InfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InfoItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.text.secondary};

  p {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.border.light};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// 기존 캐릭터 관련 스타일
const ExistingCharacterInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CharacterCard = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const CharacterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
`;

const CharacterDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CharacterName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CharacterStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatValue = styled.span<{ $type: 'health' | 'sanity' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: ${({ theme, $type }) => 
    $type === 'health' ? theme.colors.error : theme.colors.primary[500]};
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  width: fit-content;
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;