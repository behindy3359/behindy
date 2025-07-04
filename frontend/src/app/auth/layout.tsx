"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AuthLayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

const BrandSection = styled.div`
  text-align: center;
  padding: 40px 40px 20px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      {/* 떠다니는 배경 요소들 */}
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