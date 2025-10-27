import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import type { PortfolioWarningModalProps } from './types';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  HeaderIcon,
  ModalTitle,
  CloseButton,
  ModalContent,
  IntroText,
  WarningSection,
  SectionTitle,
  WarningList,
  WarningItem,
  RecommendSection,
  RecommendList,
  RecommendItem,
  DemoHighlight,
  DataCollectionSection,
  DataCollectionText,
  DataCollectionList,
  DataCollectionItem,
  DataCollectionNote,
  ModalFooter,
  ConfirmButton,
} from './styles';

export const PortfolioWarningModal: React.FC<PortfolioWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContainer
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <HeaderIcon>
                <AlertTriangle size={28} />
              </HeaderIcon>
              <ModalTitle>
                포트폴리오 프로젝트 안내
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <IntroText>
                이 프로젝트는 <strong>포트폴리오</strong>를 위한 데모 프로젝트입니다.
              </IntroText>

              <WarningSection>
                <SectionTitle>
                  <AlertTriangle size={18} />
                  보안 관련 주의사항
                </SectionTitle>
                <WarningList>
                  <WarningItem>
                    가입 정보는 암호화 되지만 <strong>민감한 개인정보</strong>를 입력하지 마세요
                  </WarningItem>
                </WarningList>
              </WarningSection>

              <RecommendSection>
                <SectionTitle>✅ 권장사항</SectionTitle>
                <RecommendList>
                  <RecommendItem>
                    테스트용 더미 데이터를 사용해주세요
                  </RecommendItem>
                  <RecommendItem>
                    제공되는 <DemoHighlight>데모 계정</DemoHighlight>을 이용하실 수 있습니다
                  </RecommendItem>
                </RecommendList>
              </RecommendSection>
            </ModalContent>

            <ModalFooter>
              <ConfirmButton onClick={handleConfirm}>
                확인했습니다
              </ConfirmButton>
            </ModalFooter>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};
