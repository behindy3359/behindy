import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components'; // 🔥 css 추가

// 기본 키프레임 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { 
    opacity: 1; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.7; 
    transform: scale(1.1); 
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// 게임 모드 전용 애니메이션
const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
  }
`;

const typewriter = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

// 애니메이션 컴포넌트들

// 🔥 수정: css 헬퍼 사용
export const AnimatedContainer = styled(motion.div)<{
  $animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleIn';
  $duration?: string;
  $delay?: string;
}>`
  ${({ $animation = 'fadeIn', $duration = '0.3s', $delay = '0s' }) => {
    const animationMap = {
      fadeIn,
      slideInLeft: slideInFromLeft,
      slideInRight: slideInFromRight,
      scaleIn,
    };
    
    return css`
      animation: ${animationMap[$animation]} ${$duration} ease-out ${$delay} both;
    `;
  }}
`;

// 스피너 (로딩)
export const Spinner = styled.div<{
  $size?: 'sm' | 'md' | 'lg';
  $color?: string;
}>`
  width: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '24px';
    }
  }};
  height: ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm': return '16px';
      case 'lg': return '48px';
      default: return '24px';
    }
  }};
  border: 2px solid ${({ theme }) => theme.colors.border.light};
  border-top: 2px solid ${({ $color, theme }) => $color || theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// 펄스 애니메이션
export const PulseContainer = styled.div<{
  $duration?: string;
}>`
  animation: ${pulse} ${({ $duration = '2s' }) => $duration} infinite;
`;

// 바운스 애니메이션
export const BounceContainer = styled.div<{
  $duration?: string;
}>`
  animation: ${bounce} ${({ $duration = '1s' }) => $duration} infinite;
`;

// 호버 애니메이션
export const HoverScaleContainer = styled(motion.div)`
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const HoverLiftContainer = styled(motion.div)`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.buttonHover};
  }
`;

// 페이드 전환 컨테이너
export const FadeTransition = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

// 슬라이드 전환 컨테이너
export const SlideTransition = styled(motion.div)<{
  $direction?: 'left' | 'right' | 'up' | 'down';
}>`
  width: 100%;
  height: 100%;
`;

// 스케일 전환 컨테이너
export const ScaleTransition = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

// 게임 모드 전용 애니메이션 컴포넌트들

// 글로우 효과
export const GlowContainer = styled.div<{
  $color?: string;
  $intensity?: 'low' | 'medium' | 'high';
}>`
  ${({ $color, $intensity = 'medium', theme }) => {
    const color = $color || theme.colors.primary[500];
    const intensityMap = {
      low: '0.2',
      medium: '0.4',
      high: '0.6',
    };
    
    return css`
      animation: ${glow} 3s ease-in-out infinite alternate;
      box-shadow: 0 0 10px rgba(139, 92, 246, ${intensityMap[$intensity]});
    `;
  }}
`;

// 타이핑 효과 (게임 텍스트용)
export const TypewriterContainer = styled.div<{
  $duration?: string;
  $steps?: number;
}>`
  overflow: hidden;
  white-space: nowrap;
  ${({ $duration = '2s', $steps = 20 }) => css`
    animation: ${typewriter} ${$duration} steps(${$steps}) forwards;
  `}
  
  &::after {
    content: '|';
    animation: ${blink} 1s infinite;
    margin-left: 2px;
  }
`;

// 실시간 표시 (지하철 데이터용)
export const RealtimeIndicator = styled.div<{
  $active?: boolean;
}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.success : theme.colors.border.medium
  };
  
  ${({ $active }) => $active && css`
    animation: ${pulse} 2s infinite;
  `}
`;

// 로딩 도트들
export const LoadingDots = styled.div`
  display: inline-flex;
  gap: 4px;
  
  .dot {
    width: 6px;
    height: 6px;
    background: ${({ theme }) => theme.colors.primary[500]};
    border-radius: 50%;
    animation: ${bounce} 1.4s infinite ease-in-out both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

// 진행바 애니메이션
export const AnimatedProgressBar = styled.div<{
  $progress: number;
  $duration?: string;
  $color?: string;
}>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ $progress }) => Math.min(Math.max($progress, 0), 100)}%;
    background: ${({ $color, theme }) => $color || theme.colors.primary[500]};
    border-radius: 4px;
    transition: width ${({ $duration = '0.3s' }) => $duration} ease;
  }
`;

// 스켈레톤 로딩
export const SkeletonLoader = styled.div<{
  $width?: string;
  $height?: string;
  $borderRadius?: string;
}>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '20px' }) => $height};
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.background.secondary} 25%, 
    ${({ theme }) => theme.colors.background.tertiary} 50%, 
    ${({ theme }) => theme.colors.background.secondary} 75%
  );
  background-size: 200% 100%;
  border-radius: ${({ $borderRadius, theme }) => $borderRadius || theme.borderRadius.md};
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// Framer Motion variants (기존과 동일)
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3 }
};

export const scaleInOut = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2 }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.8, y: 50 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

// 목록 아이템 스태거 애니메이션
export const listContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const listItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// 게임 모드 전용 variants
export const gameTextVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const choiceButtonVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

// 애니메이션 유틸리티 함수들
export const createStaggerChildren = (staggerDelay = 0.1, delayChildren = 0) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
});

export const createSlideTransition = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const directions = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: -50 },
    down: { y: 50 }
  };
  
  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...directions[direction] },
    transition: { duration: 0.3, ease: 'easeOut' }
  };
};