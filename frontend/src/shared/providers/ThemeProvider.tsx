"use client";

import React from 'react';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import { theme } from '@/shared/styles/theme';

// 글로벌 스타일 정의
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans.join(', ')};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    min-height: 100vh;
  }

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[400]};
    }
  }

  /* 포커스 스타일 일관성 */
  *:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* 버튼 기본 스타일 리셋 */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* 링크 스타일 */
  a {
    color: ${({ theme }) => theme.colors.primary[500]};
    text-decoration: none;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }

  /* 입력 요소 기본 스타일 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* 애니메이션 최적화 */
  * {
    &:not([data-no-transform]) {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
  }

  /* 스핀 애니메이션 (로딩에 사용) */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* 펄스 애니메이션 (실시간 표시에 사용) */
  @keyframes pulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1); 
    }
    50% { 
      opacity: 0.7; 
      transform: scale(1.1); 
    }
  }

  /* 페이드인 애니메이션 */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 유틸리티 클래스 */
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  /* 접근성 개선 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* 반응형 텍스트 크기 조정 */
  ${({ theme }) => theme.breakpoints.sm && `
    @media (max-width: ${parseInt(theme.breakpoints.sm) - 1}px) {
      html {
        font-size: 14px;
      }
    }
  `}
`;

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;