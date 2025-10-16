import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ModalContainer = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 520px;
  max-height: 85vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
`;

export const HeaderIcon = styled.div`
  color: #d97706;
  display: flex;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

export const CloseButton = styled.button`
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

export const ModalContent = styled.div`
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

export const IntroText = styled.p`
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

export const WarningSection = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
`;

export const RecommendSection = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;
`;

export const WarningItem = styled.li`
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

export const RecommendList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;
`;

export const RecommendItem = styled.li`
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

export const DemoHighlight = styled.span`
  font-weight: 600;
  color: #15803d;
  background: #dcfce7;
  padding: 2px 6px;
  border-radius: 4px;
`;

export const DataCollectionSection = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 20px;
`;

export const DataCollectionText = styled.p`
  font-size: 14px;
  color: #1e40af;
  margin: 0 0 12px;
  line-height: 1.5;
`;

export const DataCollectionList = styled.ul`
  margin: 0 0 12px;
  padding-left: 20px;
  list-style: none;
`;

export const DataCollectionItem = styled.li`
  position: relative;
  font-size: 13px;
  color: #1e3a8a;
  line-height: 1.6;
  margin-bottom: 6px;
  padding-left: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #3b82f6;
    font-weight: bold;
  }
`;

export const DataCollectionNote = styled.div`
  font-size: 12px;
  color: #1e40af;
  line-height: 1.5;
  padding: 10px;
  background: #dbeafe;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
`;

export const DisclaimerText = styled.p`
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

export const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

export const ConfirmButton = styled.button`
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
