import React from 'react';
import { User, ArrowRight, Home, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { Character } from '../../types/gameTypes';
import {
  CreateCard,
  CardHeader,
  CardTitle,
  ExistingCharacterInfo,
  CharacterCard,
  CharacterIcon,
  CharacterDetails,
  CharacterName,
  CharacterStats,
  StatItem,
  StatLabel,
  StatValue,
  StatusBadge,
  InfoMessage,
  DestinationInfo,
  ButtonGroup,
} from '../../styles/gameStyles';

interface ExistingCharacterCardProps {
  character: Character;
  stationName: string | null;
  lineNumber: string | null;
  isLoading: boolean;
  onContinueWithExisting: () => void;
  onGoHome: () => void;
  onAbandonAndCreate: () => void;
}

export const ExistingCharacterCard: React.FC<ExistingCharacterCardProps> = ({
  character,
  stationName,
  lineNumber,
  isLoading,
  onContinueWithExisting,
  onGoHome,
  onAbandonAndCreate,
}) => {
  return (
    <CreateCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ExistingCharacterInfo>
        <CharacterCard>
          <CharacterIcon>
            <User size={48} />
          </CharacterIcon>
          <CharacterDetails>
            <CharacterName>{character.charName}</CharacterName>
            <CharacterStats>
              <StatItem>
                <StatLabel>체력</StatLabel>
                <StatValue>{character.charHealth}/100</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>정신력</StatLabel>
                <StatValue>{character.charSanity}/100</StatValue>
              </StatItem>
            </CharacterStats>
            <StatusBadge $status={character.statusMessage}>
              {character.statusMessage}
            </StatusBadge>
          </CharacterDetails>
        </CharacterCard>

        <InfoMessage>
          <Info size={16} />
          <span>한 번에 하나의 캐릭터만 플레이할 수 있습니다.</span>
        </InfoMessage>

        {/* 원래 목적지 정보 표시 */}
        {stationName && lineNumber && (
          <DestinationInfo>
            <span>🚉 목적지: {stationName}역 {lineNumber}호선</span>
          </DestinationInfo>
        )}

        <ButtonGroup>
          {/* 상황에 맞는 버튼 텍스트 */}
          <Button
            onClick={onContinueWithExisting}
            size="lg"
            fullWidth
            rightIcon={stationName && lineNumber ? <ArrowRight size={20} /> : <Home size={20} />}
          >
            {stationName && lineNumber 
              ? `${stationName}역으로 이동하기` 
              : '이 캐릭터로 계속하기'
            }
          </Button>

          <Button
            variant="destructive"
            onClick={onAbandonAndCreate}
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            포기하고 새로 만들기
          </Button>
        </ButtonGroup>
      </ExistingCharacterInfo>
    </CreateCard>
  );
};