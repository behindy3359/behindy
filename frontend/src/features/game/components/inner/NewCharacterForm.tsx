import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { Input } from '@/shared/components/ui/input/Input';
import { CharacterFormInfo } from './CharacterFormInfo';
import {
  CreateCard,
  CardHeader,
  CardTitle,
  CardDescription,
  FormSection,
  FormGroup,
  NameHelper,
  RandomButton,
  InfoBox,
  InfoTitle,
  InfoList,
  InfoItem,
} from '../../styles/gameStyles';

interface NewCharacterFormProps {
  charName: string;
  isLoading: boolean;
  nameError: string;
  stationName: string | null;
  lineNumber: string | null;
  onCharNameChange: (name: string) => void;
  onNameErrorChange: (error: string) => void;
  onCreateCharacter: () => void;
  onGoHome: () => void;
  onGenerateRandomName: () => void;
  onValidateName: (name: string) => boolean;
}

export const NewCharacterForm: React.FC<NewCharacterFormProps> = ({
  charName,
  isLoading,
  nameError,
  stationName,
  lineNumber,
  onCharNameChange,
  onNameErrorChange,
  onCreateCharacter,
  onGoHome,
  onGenerateRandomName,
  onValidateName,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 길이 제한 (10자)
    if (value.length <= 10) {
      onCharNameChange(value);
      if (nameError) onNameErrorChange('');
    }
  };

  return (
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
        <form onSubmit={(e) => { e.preventDefault(); onCreateCharacter(); }}>
          <FormGroup>
            <Input
              label="캐릭터 이름"
              placeholder="캐릭터의 이름을 입력하세요"
              value={charName}
              onChange={handleNameChange}
              error={nameError}
              fullWidth
              size="lg"
              disabled={isLoading}
            />
            <NameHelper>
              <span>{charName.length}/10</span>
              <RandomButton
                type="button"
                onClick={onGenerateRandomName}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={14} />
                랜덤 생성
              </RandomButton>
            </NameHelper>
          </FormGroup>

          <CharacterFormInfo />

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={!charName.trim() || isLoading}
            isLoading={isLoading}
            rightIcon={<ArrowRight size={20} />}
          >
            {isLoading ? '캐릭터 생성 중...' : '캐릭터 생성하기'}
          </Button>

          {/* 뒤로가기 버튼 */}
          <Button
            type="button"
            variant="outline"
            onClick={onGoHome}
            size="lg"
            fullWidth
            leftIcon={<ArrowLeft size={20} />}
          >
            취소
          </Button>
        </form>
      </FormSection>
    </CreateCard>
  );
};