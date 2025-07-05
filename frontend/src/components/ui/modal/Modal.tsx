import React, { useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'center' | 'slide-up' | 'slide-right';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// Modal 크기별 스타일
const modalSizes = {
  sm: css`
    max-width: 400px;
    width: 90%;
  `,
  
  md: css`
    max-width: 500px;
    width: 90%;
  `,
  
  lg: css`
    max-width: 700px;
    width: 90%;
  `,
  
  xl: css`
    max-width: 900px;
    width: 95%;
  `,
  
  full: css`
    max-width: none;
    width: 95%;
    height: 95%;
  `
};

// 애니메이션 변형
const modalVariants = {
  default: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },
  
  center: {
    initial: { opacity: 0, scale: 0.8, y: -20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: -20 }
  },
  
  'slide-up': {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  },
  
  'slide-right': {
    initial: { opacity: 0, x: 300 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 }
  }
};

const Backdrop = styled(motion.div)`
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

const ModalContainer = styled(motion.div)<{ 
  size: ModalProps['size']; 
  variant: ModalProps['variant'] 
}>`
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  position: relative;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  ${({ size = 'md' }) => modalSizes[size]}
  
  ${({ variant }) => variant === 'slide-right' && css`
    position: fixed;
    right: 20px;
    top: 20px;
    bottom: 20px;
    max-height: none;
    height: calc(100vh - 40px);
    max-width: 400px;
    border-radius: 12px;
  `}
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #667eea;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  
  /* 커스텀 스크롤바 */
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
    
    &:hover {
      background: #9ca3af;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px 24px;
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  header,
  footer
}) => {
  // ESC 키로 모달 닫기
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // 백드롭 클릭으로 모달 닫기
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleEscape]);

  // 포털로 body에 직접 렌더링
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <ModalContainer
            size={size}
            variant={variant}
            className={className}
            initial={modalVariants[variant].initial}
            animate={modalVariants[variant].animate}
            exit={modalVariants[variant].exit}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            {(title || header || showCloseButton) && (
              <ModalHeader>
                {header || (
                  <>
                    {title && <ModalTitle>{title}</ModalTitle>}
                    {showCloseButton && (
                      <CloseButton onClick={onClose} aria-label="모달 닫기">
                        <X />
                      </CloseButton>
                    )}
                  </>
                )}
              </ModalHeader>
            )}

            {/* 본문 */}
            <ModalBody>
              {children}
            </ModalBody>

            {/* 푸터 */}
            {footer && (
              <ModalFooter>
                {footer}
              </ModalFooter>
            )}
          </ModalContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  );

  // 클라이언트 사이드에서만 포털 렌더링 (Next.js SSR 호환)
  if (typeof window === 'undefined') {
    return null;
  }

  return createPortal(modalContent, document.body);
};

// 편의성을 위한 추가 컴포넌트들
export const ModalConfirm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'primary'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              background: variant === 'danger' ? '#ef4444' : '#667eea',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p style={{ color: '#6b7280', lineHeight: '1.5' }}>
        {message}
      </p>
    </Modal>
  );
};

// 기본 export
export default Modal;