import React from 'react';
import { User, Heart, Brain } from 'lucide-react';
import { CharacterGameStatus } from '@/features/game/types/gameTypes';
import {
  Card,
  CardHeader,
  CardTitle,
  CharacterProfile,
  ProfileIcon,
  ProfileInfo,
  CharacterName,
  StatusBadge,
  StatsGrid,
  StatCard,
  StatIcon,
  StatInfo,
  StatLabel,
  StatValue,
  StatBar,
  StatBarFill,
  DeathNotice,
} from '../../styles/gameStyles';

interface CharacterInfoCardProps {
  character: CharacterGameStatus;
}

export const CharacterInfoCard: React.FC<CharacterInfoCardProps> = ({
  character,
}) => {
  return (
    <Card
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader>
        <CardTitle>캐릭터 정보</CardTitle>
      </CardHeader>

      <CharacterProfile>
        <ProfileIcon>
          <User size={48} />
        </ProfileIcon>
        <ProfileInfo>
          <CharacterName>{character.charName}</CharacterName>
          <StatusBadge $status={character.statusMessage}>
            {character.statusMessage}
          </StatusBadge>
        </ProfileInfo>
      </CharacterProfile>

      <StatsGrid>
        <StatCard>
          <StatIcon $type="health">
            <Heart size={20} />
          </StatIcon>
          <StatInfo>
            <StatLabel>체력</StatLabel>
            <StatValue>{character.charHealth}/100</StatValue>
            <StatBar>
              <StatBarFill
                $percentage={character.charHealth}
                $color="#ef4444"
              />
            </StatBar>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $type="sanity">
            <Brain size={20} />
          </StatIcon>
          <StatInfo>
            <StatLabel>정신력</StatLabel>
            <StatValue>{character.charSanity}/100</StatValue>
            <StatBar>
              <StatBarFill
                $percentage={character.charSanity}
                $color="#667eea"
              />
            </StatBar>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {!character.isAlive && (
        <DeathNotice>
          ⚰️ 이 캐릭터는 사망했습니다
        </DeathNotice>
      )}
    </Card>
  );
};