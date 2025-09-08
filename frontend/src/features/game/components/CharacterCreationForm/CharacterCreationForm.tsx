"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Heart, Brain, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '@/config/axiosConfig';
import { Button } from '@/shared/components/ui/button/Button';
import { Character } from '@/features/game/types/gameTypes';

interface CharacterCreationFormProps {
  stationName: string;
  lineNumber: number;
  onCharacterCreated: (character: Character) => void;
  onError: (error: string) => void;
}

interface CreateCharacterRequest {
  charName: string;
}

interface CreateCharacterResponse {
  charId: number;
  charName: string;
  charHealth: number;
  charSanity: number;
  isAlive: boolean;
  isDying: boolean;
  statusMessage: string;
  hasGameProgress: boolean;
  createdAt: string;
}

export const CharacterCreationForm: React.FC<CharacterCreationFormProps> = ({
  stationName,
  lineNumber,
  onCharacterCreated,
  onError
}) => {
  const [charName, setCharName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // 이름 유효성 검사
  const validateName = (name: string): string => {
    if (!name.trim()) {
      return '캐릭터 이름을 입력해주세요';
    }
    
    if (name.trim().length < 2) {
      return '캐릭터 이름은 2글자 이상이어야 합니다';
    }
    
    if (name.trim().length > 10) {
      return '캐릭터 이름은 10글자 이하여야 합니다';
    }

    // 특수문자 체크 (한글, 영문, 숫자, 공백만 허용)
    const nameRegex = /^[가-힣a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return '캐릭터 이름은 한글, 영문, 숫자만 사용할 수 있습니다';
    }

    return '';
  };

  // 캐릭터 생성 처리
  const handleCreateCharacter = async () => {
    const trimmedName = charName.trim();
    const error = validateName(trimmedName);
    
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      setIsLoading(true);
      setValidationError('');

      // 🔥 요청 전 로그
      console.log('🎮 [캐릭터 생성] API 요청 시작:', {
        timestamp: new Date().toISOString(),
        stationName,
        lineNumber,
        charName: trimmedName,
        requestData: { charName: trimmedName }
      });

      // 🔥 수정: /api 제거 - baseURL에 이미 포함되어 있음
      const response = await api.post<CreateCharacterResponse>(
        '/characters',  // /api 제거됨
        { charName: trimmedName } as CreateCharacterRequest
      );

      // 🔥 성공 응답 로그
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

      // API 응답을 Character 타입으로 변환
      const character: Character = {
        charId: response.charId,
        charName: response.charName,
        charHealth: response.charHealth,
        charSanity: response.charSanity,
        isAlive: response.isAlive,
        isDying: response.isDying,
        statusMessage: response.statusMessage,
        hasGameProgress: response.hasGameProgress,
        createdAt: response.createdAt
      };

      console.log('🎯 [캐릭터 생성] 캐릭터 객체 변환 완료:', character);
      
      // 🔥 캐릭터 생성 완료 후 원래 목적지로 이동
      onCharacterCreated(character);

    } catch (error: unknown) {
      // 🔥 에러 상세 로그
      console.error('❌ [캐릭터 생성] API 요청 실패:', {
        timestamp: new Date().toISOString(),
        error,
        errorType: error?.constructor?.name,
        stationName,
        lineNumber,
        charName: trimmedName
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

        console.error('📡 [캐릭터 생성] 서버 응답 상세:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message
        });

        errorMessage = axiosError.response?.data?.message || errorMessage;
        
        // 특정 에러 상황별 추가 로그
        if (axiosError.response?.status === 401) {
          console.error('🚨 [캐릭터 생성] 인증 실패 - 로그인 상태 확인 필요');
        } else if (axiosError.response?.status === 409) {
          console.warn('⚠️ [캐릭터 생성] 이미 캐릭터가 존재함');
        } else if (axiosError.response?.status === 400) {
          console.warn('⚠️ [캐릭터 생성] 잘못된 요청 데이터');
        }
      } else if (error instanceof Error) {
        console.error('💥 [캐릭터 생성] 네트워크/클라이언트 에러:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        errorMessage = error.message;
      }

      onError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 [캐릭터 생성] 요청 완료:', {
        timestamp: new Date().toISOString(),
        success: !validationError
      });
    }
  };

  // 엔터키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCreateCharacter();
    }
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <IconWrapper>
          <User size={32} />
        </IconWrapper>
        <Title>새로운 모험가 등록</Title>
        <Description>
          <strong>{stationName}역 {lineNumber}호선</strong>에서 펼쳐질 모험을 위해<br />
          새로운 캐릭터를 만들어보세요
        </Description>
      </Header>

      {/* 캐릭터 기본 정보 */}
      <StatsPreview>
        <StatItem>
          <Heart size={20} />
          <StatLabel>체력</StatLabel>
          <StatValue>100/100</StatValue>
        </StatItem>
        <StatItem>
          <Brain size={20} />
          <StatLabel>정신력</StatLabel>
          <StatValue>100/100</StatValue>
        </StatItem>
        <StatItem>
          <Sparkles size={20} />
          <StatLabel>상태</StatLabel>
          <StatValue>건강</StatValue>
        </StatItem>
      </StatsPreview>

      {/* 캐릭터 이름 입력 */}
      <FormSection>
        <InputLabel>캐릭터 이름</InputLabel>
        <InputWrapper $hasError={!!validationError}>
          <CharNameInput
            type="text"
            placeholder="예: 용감한모험가, 지하철탐험가"
            value={charName}
            onChange={(e) => {
              setCharName(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            maxLength={10}
          />
          <CharacterCount>
            {charName.length}/10
          </CharacterCount>
        </InputWrapper>
        
        {validationError && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={16} />
            {validationError}
          </ErrorMessage>
        )}
      </FormSection>

      {/* 생성 버튼 */}
      <ButtonSection>
        <CreateButton
          variant="primary"
          size="lg"
          onClick={handleCreateCharacter}
          disabled={isLoading || !charName.trim()}
          leftIcon={isLoading ? undefined : <User size={18} />}
        >
          {isLoading ? (
            <>
              <ButtonSpinner />
              캐릭터 생성 중...
            </>
          ) : (
            '캐릭터 생성하기'
          )}
        </CreateButton>

        <HelpText>
          💡 캐릭터는 한 번에 하나만 생성할 수 있습니다
        </HelpText>
      </ButtonSection>
    </Container>
  );
};

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
  border-radius: 50%;
  color: var(--text-inverse);
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: var(--text-secondary);
  line-height: 1.6;

  strong {
    color: var(--primary-600);
    font-weight: 600;
  }
`;

const StatsPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: var(--bg-secondary);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid var(--border-light);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  svg {
    color: var(--primary-500);
  }
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: var(--text-primary);
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  text-align: left;
`;

const InputLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const InputWrapper = styled.div<{ $hasError: boolean }>`
  position: relative;
  border: 2px solid ${({ $hasError }) => 
    $hasError ? 'var(--error)' : 'var(--border-medium)'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: ${({ $hasError }) => 
      $hasError ? 'var(--error)' : 'var(--primary-500)'};
  }
`;

const CharNameInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  padding-right: 60px;
  border: none;
  background: transparent;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: var(--text-primary);

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CharacterCount = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
`;

const ErrorMessage = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    flex-shrink: 0;
  }
`;

const ButtonSection = styled.div`
  text-align: center;
`;

const CreateButton = styled(Button)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ButtonSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: ${({ theme }) => theme.spacing[2]};

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-tertiary);
  margin: 0;
`;

export default CharacterCreationForm;