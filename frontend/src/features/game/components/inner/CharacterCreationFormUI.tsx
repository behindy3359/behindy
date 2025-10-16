import React from 'react';
import { Input } from '@/shared/components/ui/input/Input';
import { Button } from '@/shared/components/ui/button/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface CharacterCreationFormUIProps {
  charName: string;
  validationError: string;
  isLoading: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGenerateRandomName: () => void;
}

export const CharacterCreationFormUI: React.FC<CharacterCreationFormUIProps> = ({
  charName,
  validationError,
  isLoading,
  onNameChange,
  onSubmit,
  onGenerateRandomName,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '1rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}
          >
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--text-primary)',
            }}>
              캐릭터를 생성하고 있습니다...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        <Input
          label="캐릭터 이름"
          placeholder="캐릭터의 이름을 입력하세요"
          value={charName}
          onChange={onNameChange}
          error={validationError}
          fullWidth
          size="lg"
          disabled={isLoading}

        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 0.5rem'
        }}>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-tertiary)' 
          }}>
            {charName.length}/10
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onGenerateRandomName}
            disabled={isLoading}
          >
            랜덤 생성
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={!charName.trim() || isLoading}
        isLoading={isLoading}
      >
        {isLoading ? '캐릭터 생성 중...' : '캐릭터 생성하기'}
      </Button>
    </form>
  );
};