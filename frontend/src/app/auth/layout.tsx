"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { gradients } from '@/styles/theme';

const AuthLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${gradients.primary};
  display: flex; /* 추가: Flexbox 사용 */
  align-items: center; /* 추가: 수직 중앙 정렬 */
  justify-content: center; /* 추가: 수평 중앙 정렬 */
  padding: 20px;
  position: relative;
  overflow: hidden;
  
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
  
  /* 추가: 최대 높이 제한 및 스크롤 처리 */
  max-height: 90vh;
  overflow-y: auto;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const BrandSection = styled.div`
  text-align: center;
  padding: 40px 40px 20px 40px;
  background: ${gradients.primary};
  color: white;
  position: relative;
  
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
  }
  
  .brand-name {
    font-size: 24px;
    font-weight: 800;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  
  .tagline {
    font-size: 14px;
    opacity: 0.9;
    font-weight: 400;
  }
`;

const ContentSection = styled.div`
  padding: 40px;
  
  /* 추가: 최소 높이 설정으로 내용이 적어도 중앙에 위치 */
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <BrandSection>
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            B
          </motion.div>
          <div className="brand-name">Behindy</div>
        </BrandSection>

        <ContentSection>
          {children}
        </ContentSection>
      </AuthCard>
    </AuthLayoutContainer>
  );
}