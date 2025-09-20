import React from 'react';
import {
  InfoBox,
  InfoTitle,
  InfoList,
  InfoItem,
} from '../../styles/gameStyles';

export const CharacterFormInfo: React.FC = () => {
  return (
    <InfoBox>
      <InfoTitle>캐릭터 정보</InfoTitle>
      <InfoList>
        <InfoItem><span>• 초기 체력: 100</span></InfoItem>
        <InfoItem><span>• 초기 정신력: 100</span></InfoItem>
        <InfoItem><span>• 선택에 따라 능력치가 변화합니다</span></InfoItem>
        <InfoItem><span>• 체력이나 정신력이 0이 되면 게임 오버</span></InfoItem>
      </InfoList>
    </InfoBox>
  );
};