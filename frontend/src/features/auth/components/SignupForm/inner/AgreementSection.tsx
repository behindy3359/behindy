import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  AgreementContainer,
  AgreementTitle,
  AgreementsList,
  AgreementItem,
  AgreementLabel,
  CheckboxWrapper,
  AgreementContent,
  AgreementText,
  RequiredMark,
  AgreementErrorText,
  AgreementDescription,
} from '../styles';
import type { AgreementSectionProps } from '../../../types/types';

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreements,
  errors,
  onChange,
  disabled = false,
}) => {
  return (
    <AgreementContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AgreementTitle>
        포트폴리오 프로젝트 확인
      </AgreementTitle>

      <AgreementsList>
        {/* 포트폴리오 프로젝트 이해 동의 */}
        <AgreementItem>
          <AgreementLabel>
            <CheckboxWrapper
              $required={true}
              $checked={agreements.terms}
              className="checkbox-wrapper"
            >
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(e) => onChange('agreeToTerms', e.target.checked)}
                disabled={disabled}
              />
            </CheckboxWrapper>
            <AgreementContent>
              <AgreementText>
                <RequiredMark>*</RequiredMark>
                <span>
                  포트폴리오 프로젝트임을 이해하고, 실제 개인정보를 사용하지 않겠습니다
                </span>
              </AgreementText>
              <AgreementDescription>
                <AlertCircle size={14} style={{ marginRight: '6px' }} />
                테스트용 데이터 사용을 권장합니다
              </AgreementDescription>
              {errors.agreeToTerms && (
                <AgreementErrorText>
                  {errors.agreeToTerms}
                </AgreementErrorText>
              )}
            </AgreementContent>
          </AgreementLabel>
        </AgreementItem>
      </AgreementsList>
    </AgreementContainer>
  );
};