"use client";

import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  WarningIcon,
  WarningTitle,
  WarningList,
  WarningItem,
  ConfirmCheckbox,
  ModalFooter,
  DemoAccountInfo,
  InfoTitle,
  InfoText
} from './styles';
import type { PortfolioWarningModalProps } from './types';

export const PortfolioWarningModal: React.FC<PortfolioWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onConfirm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>
            <AlertTriangle size={24} />
            포트폴리오 프로젝트 안내
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <WarningIcon>
            <AlertTriangle size={48} />
          </WarningIcon>

          <WarningTitle>
            이 프로젝트는 포트폴리오 목적으로 동작하고 있습니다
          </WarningTitle>

          <WarningList>
            <WarningItem>
              <CheckCircle2 size={16} />
              <span>실제 개인정보를 입력하지 말아주세요</span>
            </WarningItem>
            <WarningItem>
              <CheckCircle2 size={16} />
              <span>테스트용 임시 정보만 사용해주세요</span>
            </WarningItem>
            <WarningItem>
              <CheckCircle2 size={16} />
              <span>Swagger UI에서 API 명세를 확인할 수 있습니다</span>
            </WarningItem>
          </WarningList>

          <DemoAccountInfo>
            <InfoTitle>데모 계정으로 접속하기</InfoTitle>
            <InfoText>
              로그인 화면에서 &ldquo;데모 계정으로 접속하기&rdquo; 버튼을 클릭하면
              <br />
              별도의 회원가입 없이 서비스를 체험하실 수 있습니다.
            </InfoText>
          </DemoAccountInfo>

          <ConfirmCheckbox>
            <input
              type="checkbox"
              id="portfolio-confirm"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label htmlFor="portfolio-confirm">
              위 내용을 확인했습니다
            </label>
          </ConfirmCheckbox>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!isChecked}
          >
            확인했습니다
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};