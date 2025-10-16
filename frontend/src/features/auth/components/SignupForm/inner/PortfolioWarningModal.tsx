import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import styled from 'styled-components';

interface PortfolioWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioWarningModal: React.FC<PortfolioWarningModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <ModalContainer
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ModalHeader>
              <HeaderIcon>
                <AlertTriangle size={28} />
              </HeaderIcon>
              <ModalTitle>포트폴리오 프로젝트 안내</ModalTitle>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <IntroText>
                본 사이트는 <strong>개발 포트폴리오</strong>를 위한 데모 프로젝트입니다.
              </IntroText>

              <WarningSection>
                <SectionTitle>
                  <AlertTriangle size={18} />
                  보안 관련 주의사항
                </SectionTitle>
                <WarningList>
                  <WarningItem>
                    <strong>실제 사용 중인 이메일 주소</strong>를 입력하지 마세요
                  </WarningItem>
                  <WarningItem>
                    <strong>다른 서비스에서 사용하는 비밀번호</strong>를 절대 사용하지 마세요
                  </WarningItem>
                  <WarningItem>
                    <strong>민감한 개인정보</strong>를 입력하지 마세요
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

              <DisclaimerText>
                데이터는 암호화 처리되지만, 프로덕션급 보안이 적용되지 않은 개발 환경입니다.
              </DisclaimerText>
            </ModalContent>

            <ModalFooter>
              <ConfirmButton onClick={onClose}>
                확인했습니다
              </ConfirmButton>
            </ModalFooter>
          </ModalContainer>
        </>
      )}
    </AnimatePresence>
  );
};

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 520px;
  max-height: 85vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
`;

const HeaderIcon = styled.div`
  color: #d97706;
  display: flex;
  align-items: center;
`;

const ModalTitle = styled.h2`
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #1f2937;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const IntroText = styled.p`
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 24px;
  text-align: center;

  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;

const WarningSection = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
`;

const RecommendSection = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;
`;

const WarningItem = styled.li`
  position: relative;
  font-size: 14px;
  color: #7f1d1d;
  line-height: 1.6;
  margin-bottom: 8px;
  padding-left: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #dc2626;
    font-weight: bold;
  }

  strong {
    font-weight: 600;
    color: #991b1b;
  }
`;

const RecommendList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;
`;

const RecommendItem = styled.li`
  position: relative;
  font-size: 14px;
  color: #14532d;
  line-height: 1.6;
  margin-bottom: 8px;
  padding-left: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #16a34a;
    font-weight: bold;
  }
`;

const DemoHighlight = styled.span`
  font-weight: 600;
  color: #15803d;
  background: #dcfce7;
  padding: 2px 6px;
  border-radius: 4px;
`;

const DisclaimerText = styled.p`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
  border: 1px dashed #d1d5db;
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
