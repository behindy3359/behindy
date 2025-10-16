import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
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
  DetailButton,
} from '../styles';
import type { AgreementSectionProps } from '../../../types/types';

interface ExtendedAgreementSectionProps extends AgreementSectionProps {
  onShowDetails?: () => void;
}

export const AgreementSection: React.FC<ExtendedAgreementSectionProps> = ({
  agreements,
  errors,
  onChange,
  disabled = false,
  onShowDetails,
}) => {
  return (
    <AgreementContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
              <AgreementText
                onClick={onShowDetails}
                style={{ cursor: onShowDetails ? 'pointer' : 'default' }}
              >
                <span>
                  <RequiredMark>*</RequiredMark> 이 프로젝트는 포트폴리오용으로 작성되었습니다.
                </span>
                {onShowDetails && (
                  <DetailButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowDetails();
                    }}
                    disabled={disabled}
                  >
                    <Info size={14} />
                    자세히
                  </DetailButton>
                )}
              </AgreementText>
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