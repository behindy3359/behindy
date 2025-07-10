import React, { useMemo } from 'react';
import { Check, X, Shield } from 'lucide-react';
import { passwordUtils } from '../../utils/passwordUtils';
import {
  StrengthMeterContainer,
  StrengthBarSection,
  StrengthHeader,
  StrengthLabel,
  StrengthText,
  StrengthBarTrack,
  StrengthBarFill,
  RequirementsContainer,
  RequirementsHeader,
  RequirementsTitle,
  RequirementsList,
  RequirementItem,
  HintsContainer,
  HintItem
} from '../styles';
import type { PasswordStrengthMeterProps } from '../../types';

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = '',
}) => {
  const strength = useMemo(() => 
    passwordUtils.calculateStrength(password), 
    [password]
  );

  const hints = useMemo(() => 
    passwordUtils.generateHints(password), 
    [password]
  );

  if (!password) {
    return null;
  }

  const strengthColor = passwordUtils.getStrengthColor(strength.level);
  const strengthText = passwordUtils.getStrengthText(strength.level);
  const percentage = passwordUtils.getStrengthPercentage(strength.score);

  return (
    <StrengthMeterContainer className={className}>
      {/* 강도 바 */}
      <StrengthBarSection>
        <StrengthHeader>
          <StrengthLabel>
            비밀번호 강도
          </StrengthLabel>
          <StrengthText $color={strengthColor}>
            {strengthText}
          </StrengthText>
        </StrengthHeader>
        
        <StrengthBarTrack>
          <StrengthBarFill
            $color={strengthColor}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </StrengthBarTrack>
      </StrengthBarSection>

      {/* 요구사항 체크리스트 */}
      <RequirementsContainer>
        <RequirementsHeader>
          <Shield size={16} />
          <RequirementsTitle>
            비밀번호 요구사항
          </RequirementsTitle>
        </RequirementsHeader>
        
        <RequirementsList>
          {Object.entries(strength.requirements).map(([key, met]) => {
            const labels = {
              length: '8자 이상',
              lowercase: '소문자 포함',
              uppercase: '대문자 포함',
              number: '숫자 포함',
              special: '특수문자 포함',
            };

            return (
              <RequirementItem
                key={key}
                $met={met}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {met ? (
                  <Check size={14} />
                ) : (
                  <X size={14} />
                )}
                <span>
                  {labels[key as keyof typeof labels]}
                </span>
              </RequirementItem>
            );
          })}
        </RequirementsList>

        {/* 힌트 메시지 */}
        {hints.length > 0 && (
          <HintsContainer>
            {hints.map((hint, index) => (
              <HintItem
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {hint}
              </HintItem>
            ))}
          </HintsContainer>
        )}
      </RequirementsContainer>
    </StrengthMeterContainer>
  );
};