import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

// 애니메이션 키프레임
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

// 크기별 스타일
const sizes = {
  sm: { size: '20px', message: '14px' },
  md: { size: '32px', message: '16px' },
  lg: { size: '48px', message: '18px' }
};

const LoadingContainer = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  ${({ fullScreen }) => fullScreen && css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    z-index: 9999;
  `}
`;

// Spinner 로딩
const Spinner = styled.div<{ size: string; color: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border: 3px solid #f3f4f6;
  border-top: 3px solid ${({ color }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Dots 로딩
const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div<{ size: string; color: string; delay: number }>`
  width: calc(${({ size }) => size} / 3);
  height: calc(${({ size }) => size} / 3);
  background: ${({ color }) => color};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

// Pulse 로딩
const PulseCircle = styled.div<{ size: string; color: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background: ${({ color }) => color};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

// 스켈레톤 로딩
const SkeletonContainer = styled.div<{ size: string }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: ${({ size }) => 
    size === 'sm' ? '200px' : 
    size === 'md' ? '300px' : '400px'
  };
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${keyframes`
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  `} 1.5s ease-in-out infinite;
  border-radius: 4px;
  height: ${({ height }) => height || '16px'};
  width: ${({ width }) => width || '100%'};
`;

const LoadingMessage = styled(motion.p)<{ fontSize: string }>`
  color: #6b7280;
  font-size: ${({ fontSize }) => fontSize};
  margin: 0;
  text-align: center;
`;

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = '#667eea',
  fullScreen = false,
  message
}) => {
  const sizeConfig = sizes[size];

  const renderLoading = () => {
    switch (variant) {
      case 'spinner':
        return <Spinner size={sizeConfig.size} color={color} />;
      
      case 'dots':
        return (
          <DotsContainer>
            <Dot size={sizeConfig.size} color={color} delay={0} />
            <Dot size={sizeConfig.size} color={color} delay={0.2} />
            <Dot size={sizeConfig.size} color={color} delay={0.4} />
          </DotsContainer>
        );
      
      case 'pulse':
        return <PulseCircle size={sizeConfig.size} color={color} />;
      
      case 'skeleton':
        return (
          <SkeletonContainer size={size}>
            <SkeletonLine height="20px" width="60%" />
            <SkeletonLine height="16px" width="80%" />
            <SkeletonLine height="16px" width="40%" />
            <SkeletonLine height="12px" width="90%" />
            <SkeletonLine height="12px" width="70%" />
          </SkeletonContainer>
        );
      
      default:
        return <Spinner size={sizeConfig.size} color={color} />;
    }
  };

  return (
    <LoadingContainer fullScreen={fullScreen}>
      {renderLoading()}
      {message && (
        <LoadingMessage
          fontSize={sizeConfig.message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </LoadingMessage>
      )}
    </LoadingContainer>
  );
};

export default Loading;