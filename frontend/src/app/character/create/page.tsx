"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, AlertCircle, ArrowRight, Info } from 'lucide-react';
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

  // returnUrl 파라미터 확인 (게임 진입 시 돌아갈 URL)
  const returnUrl = searchParams.get('returnUrl') || '/';

  // 상태
  const [charName, setCharName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [existingCharacter, setExistingCharacter] = useState<Character | null>(null);
  const [nameError, setNameError] = useState('');

  // 기존 캐릭터 확인 - 올바른 API 엔드포인트 사용
  const checkExistingCharacter = async () => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    try {
      setIsChecking(true);
      
      // 🔥 올바른 API 엔드포인트 사용: /characters/exists
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
      console.error('❌ [Character Create] Character check failed:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });
      // 에러 무시하고 생성 화면 표시
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
    // 특수문자 체크 (한글, 영문, 숫자, 공백만 허용)
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
      
      // 🔥 요청 전 로그
      console.log('🎮 [Character Create] API 요청 시작:', {
        timestamp: new Date().toISOString(),
        charName: charName.trim(),
        requestData: { charName: charName.trim() }
      });

      const response = await api.post<Character>('/characters', {
        charName: charName.trim()
      });

      // 🔥 성공 응답 로그
      console.log('✅ [Character Create] API 응답 성공:', {
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
      
      // returnUrl이 있으면 해당 URL로, 없으면 메인으로
      if (returnUrl.includes('/game')) {
        router.push(returnUrl);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      // 🔥 에러 상세 로그
      console.error('❌ [Character Create] API 요청 실패:', {
        timestamp: new Date().toISOString(),
        error,
        errorType: error?.constructor?.name,
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

        console.error('📡 [Character Create] 서버 응답 상세:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message
        });

        errorMessage = axiosError.response?.data?.message || errorMessage;
        
        // 특정 에러 상황별 추가 로그
        if (axiosError.response?.status === 401) {
          console.error('🚨 [Character Create] 인증 실패 - 로그인 상태 확인 필요');
        } else if (axiosError.response?.status === 409) {
          console.warn('⚠️ [Character Create] 이미 캐릭터가 존재함');
        } else if (axiosError.response?.status === 400) {
          console.warn('⚠️ [Character Create] 잘못된 요청 데이터');
        }
      }

      toast.error(errorMessage);
      
      // 이미 캐릭터가 있다는 에러인 경우
      if (errorMessage.includes('이미') || errorMessage.includes('존재')) {
        checkExistingCharacter();
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 [Character Create] 요청 완료:', {
        timestamp: new Date().toISOString(),
        success: !nameError
      });
    }
  };

  // 기존 캐릭터로 계속하기
  const handleContinueWithExisting = () => {
    if (returnUrl.includes('/game')) {
      router.push(returnUrl);
    } else {
      router.push('/game');
    }
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
      
      // 게임 포기 API 호출
      await api.post('/game/quit');
      
      console.log('✅ [Character Create] 게임 포기 성공');
      
      // 캐릭터 삭제는 백엔드에서 자동 처리되므로
      // 바로 새 캐릭터 생성 가능 상태로 변경
      setExistingCharacter(null);
      toast.info('이전 캐릭터를 포기했습니다. 새로운 캐릭터를 만들어주세요.');
    } catch (error: any) {
      console.error('❌ [Character Create] 캐릭터 포기 실패:', {
        error,
        message: error.message,
        response: error.response?.data
      });
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

  // 이미 캐릭터가 있는 경우
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

              <ButtonGroup>
                <Button
                  onClick={handleContinueWithExisting}
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight size={20} />}
                >
                  이 캐릭터로 계속하기
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

  // 새 캐릭터 생성
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
              지하철 모험을 함께할 캐릭터를 생성하세요
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
                <InfoItem>
                  <span>• 초기 체력: 100</span>
                </InfoItem>
                <InfoItem>
                  <span>• 초기 정신력: 100</span>
                </InfoItem>
                <InfoItem>
                  <span>• 선택에 따라 능력치가 변화합니다</span>
                </InfoItem>
                <InfoItem>
                  <span>• 체력이나 정신력이 0이 되면 게임 오버</span>
                </InfoItem>
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
          </FormSection>
        </CreateCard>
      </Container>
    </AppLayout>
  );
}

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