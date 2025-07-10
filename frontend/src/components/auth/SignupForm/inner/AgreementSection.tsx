import React from 'react';
import { ExternalLink } from 'lucide-react';
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
  AgreementLink,
  ExternalLinkIcon,
  AgreementDescription,
  OptionalText,
  ErrorText,
  RequiredNotice
} from '../styles';
import type { AgreementSectionProps } from '../../types';

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreements,
  errors,
  onChange,
  disabled = false,
}) => {
  const handleTermsClick = () => {
    window.open('/terms', '_blank', 'noopener,noreferrer');
  };

  const handlePrivacyClick = () => {
    window.open('/privacy', '_blank', 'noopener,noreferrer');
  };

  return (
    <AgreementContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AgreementTitle>
        약관 동의
      </AgreementTitle>

      <AgreementsList>
        {/* 이용약관 동의 */}
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
                <AgreementLink
                  type="button"
                  onClick={handleTermsClick}
                  disabled={disabled}
                >
                  이용약관
                </AgreementLink>
                <ExternalLinkIcon>
                  <ExternalLink size={14} />
                </ExternalLinkIcon>
                <span>에 동의합니다</span>
              </AgreementText>
              {errors.agreeToTerms && (
                <ErrorText
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.agreeToTerms}
                </ErrorText>
              )}
            </AgreementContent>
          </AgreementLabel>
        </AgreementItem>

        {/* 개인정보처리방침 동의 */}
        <AgreementItem>
          <AgreementLabel>
            <CheckboxWrapper 
              $required={true} 
              $checked={agreements.privacy}
              className="checkbox-wrapper"
            >
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={(e) => onChange('agreeToPrivacy', e.target.checked)}
                disabled={disabled}
              />
            </CheckboxWrapper>
            <AgreementContent>
              <AgreementText>
                <RequiredMark>*</RequiredMark>
                <AgreementLink
                  type="button"
                  onClick={handlePrivacyClick}
                  disabled={disabled}
                >
                  개인정보처리방침
                </AgreementLink>
                <ExternalLinkIcon>
                  <ExternalLink size={14} />
                </ExternalLinkIcon>
                <span>에 동의합니다</span>
              </AgreementText>
              {errors.agreeToPrivacy && (
                <ErrorText
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.agreeToPrivacy}
                </ErrorText>
              )}
            </AgreementContent>
          </AgreementLabel>
        </AgreementItem>

        {/* 마케팅 정보 수신 동의 (선택) */}
        <AgreementItem>
          <AgreementLabel>
            <CheckboxWrapper 
              $checked={agreements.marketing}
              className="checkbox-wrapper"
            >
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => onChange('marketingOptIn', e.target.checked)}
                disabled={disabled}
              />
            </CheckboxWrapper>
            <AgreementContent>
              <AgreementText>
                <span>
                  마케팅 정보 수신에 동의합니다
                  <OptionalText>(선택)</OptionalText>
                </span>
              </AgreementText>
              <AgreementDescription>
                새로운 게임 업데이트와 이벤트 소식을 받아보세요
              </AgreementDescription>
            </AgreementContent>
          </AgreementLabel>
        </AgreementItem>
      </AgreementsList>

      {/* 필수 동의 안내 */}
      <RequiredNotice>
        <p>
          <span className="required-mark">*</span> 표시된 항목은 필수 동의 사항입니다.
        </p>
      </RequiredNotice>
    </AgreementContainer>
  );
};