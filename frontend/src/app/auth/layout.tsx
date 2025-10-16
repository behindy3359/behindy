"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { gradients } from '@/shared/styles/theme';
import { PortfolioWarningModal } from '@/features/auth/components/PortfolioWarningModal';
import { AuthLayoutProvider } from '@/features/auth/contexts/AuthLayoutContext';

const AuthLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${gradients.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  /* 🔥 추가: 매우 낮은 화면에서는 상하 중앙 정렬 대신 상단 정렬 */
  @media (max-height: 500px) {
    align-items: flex-start;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  
  /* 배경 패턴 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const AuthCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  padding: 0;
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  position: relative;
  
  /* 🔥 완전 자유로운 높이 */
  min-height: auto;
  max-height: none;
  
  /* 🔥 극도로 낮은 화면에서의 추가 조정 */
  @media (max-height: 500px) {
    margin: 5px 0;
    border-radius: 12px;
    max-width: 420px;
  }
  
  @media (max-height: 400px) {
    border-radius: 8px;
    max-width: 400px;
  }
`;

const BrandSection = styled.div`
  text-align: center;
  padding: 40px 40px 20px 40px;
  background: ${gradients.primary};
  color: white;
  position: relative;
  cursor: pointer; /* 🔥 추가: 클릭 가능하다는 시각적 피드백 */
  transition: all 0.2s ease; /* 🔥 추가: 호버 효과를 위한 전환 */
  
  /* 🔥 추가: 호버 효과 */
  &:hover {
    background: ${gradients.primaryHover};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-height: 600px) {
    padding: 30px 30px 15px 30px;
  }
  
  /* 🔥 극도로 낮은 화면에서 더 컴팩트하게 */
  @media (max-height: 500px) {
    padding: 20px 25px 10px 25px;
  }
  
  @media (max-height: 400px) {
    padding: 15px 20px 8px 20px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 28px;
    font-weight: 800;
    backdrop-filter: blur(10px);
    
    @media (max-height: 600px) {
      width: 50px;
      height: 50px;
      font-size: 24px;
      margin-bottom: 12px;
    }
    
    @media (max-height: 500px) {
      width: 40px;
      height: 40px;
      font-size: 20px;
      margin-bottom: 8px;
      border-radius: 12px;
    }
    
    @media (max-height: 400px) {
      width: 35px;
      height: 35px;
      font-size: 18px;
      margin-bottom: 6px;
      border-radius: 10px;
    }
  }
  
  .brand-name {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
    
    @media (max-height: 600px) {
      font-size: 20px;
      margin-bottom: 6px;
    }
    
    @media (max-height: 500px) {
      font-size: 18px;
      margin-bottom: 4px;
    }
    
    @media (max-height: 400px) {
      font-size: 16px;
      margin-bottom: 3px;
    }
  }
  
  .tagline {
    font-size: 14px;
    opacity: 0.9;
    font-weight: 400;
    
    @media (max-height: 600px) {
      font-size: 12px;
    }
    
    @media (max-height: 500px) {
      font-size: 11px;
    }
    
    /* 🔥 극도로 낮은 화면에서는 tagline 숨김 */
    @media (max-height: 400px) {
      display: none;
    }
  }
`;

const ContentSection = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  
  @media (max-height: 600px) {
    padding: 30px;
  }
  
  @media (max-height: 500px) {
    padding: 25px 20px;
  }
  
  @media (max-height: 400px) {
    padding: 20px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 30px 25px;
    
    @media (max-height: 500px) {
      padding: 20px 15px;
    }
  }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
  
  /* 🔥 낮은 화면에서는 floating 요소들 숨김 */
  @media (max-height: 500px) {
    display: none;
  }
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleHeaderClick = () => {
    router.push('/');
  };

  // 최초 진입 시 모달 표시 (세션 스토리지로 한 번만 표시)
  useEffect(() => {
    const hasSeenWarning = sessionStorage.getItem('portfolio-warning-seen');
    if (!hasSeenWarning) {
      setShowWarningModal(true);
    }
  }, []);

  const handleWarningConfirm = () => {
    sessionStorage.setItem('portfolio-warning-seen', 'true');
  };

  const openWarningModal = () => {
    setShowWarningModal(true);
  };

  return (
    <AuthLayoutContainer>
      <FloatingElement
        style={{ top: '10%', left: '10%' }}
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      <FloatingElement
        style={{ bottom: '20%', right: '15%', width: '60px', height: '60px' }}
        animate={{ 
          y: [0, 15, 0],
          x: [0, -15, 0],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <FloatingElement
        style={{ top: '60%', left: '5%', width: '40px', height: '40px' }}
        animate={{ 
          y: [0, -10, 0],
          x: [0, 20, 0],
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <AuthCard
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <BrandSection onClick={handleHeaderClick}>
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            B
          </motion.div>
          <div className="brand-name">Behindy</div>
        </BrandSection>

        <ContentSection>
          <AuthLayoutProvider openWarningModal={openWarningModal}>
            {children}
          </AuthLayoutProvider>
        </ContentSection>
      </AuthCard>

      {/* 포트폴리오 경고 모달 */}
      <AnimatePresence>
        {showWarningModal && (
          <PortfolioWarningModal
            isOpen={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            onConfirm={handleWarningConfirm}
          />
        )}
      </AnimatePresence>
    </AuthLayoutContainer>
  );
}