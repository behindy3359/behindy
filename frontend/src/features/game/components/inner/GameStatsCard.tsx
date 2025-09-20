import React from 'react';
import { Trophy, Play, TrendingUp, Clock } from 'lucide-react';
import { CharacterGameStatus } from '@/features/game/types/gameTypes';
import {
  Card,
  CardHeader,
  CardTitle,
  StatsList,
  StatsItem,
  StatsIcon,
  StatsText,
} from '../../styles/gameStyles';

interface GameStatsCardProps {
  character: CharacterGameStatus;
}

export const GameStatsCard: React.FC<GameStatsCardProps> = ({
  character,
}) => {
  return (
    <Card
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <CardHeader>
        <CardTitle>게임 통계</CardTitle>
      </CardHeader>

      <StatsList>
        <StatsItem>
          <StatsIcon>
            <Trophy size={20} />
          </StatsIcon>
          <StatsText>
            <span>완료한 스토리</span>
            <strong>{character.totalClears}개</strong>
          </StatsText>
        </StatsItem>

        <StatsItem>
          <StatsIcon>
            <Play size={20} />
          </StatsIcon>
          <StatsText>
            <span>플레이한 게임</span>
            <strong>{character.totalPlays}회</strong>
          </StatsText>
        </StatsItem>

        <StatsItem>
          <StatsIcon>
            <TrendingUp size={20} />
          </StatsIcon>
          <StatsText>
            <span>클리어율</span>
            <strong>{character.clearRate.toFixed(1)}%</strong>
          </StatsText>
        </StatsItem>

        {character.gameStartTime && (
          <StatsItem>
            <StatsIcon>
              <Clock size={20} />
            </StatsIcon>
            <StatsText>
              <span>게임 시작 시간</span>
              <strong>{new Date(character.gameStartTime).toLocaleString()}</strong>
            </StatsText>
          </StatsItem>
        )}
      </StatsList>
    </Card>
  );
};