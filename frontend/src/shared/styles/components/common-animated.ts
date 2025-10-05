"use client";

import { motion } from 'framer-motion';
import styled from 'styled-components';

// ========================================
// 타입 정의
// ========================================
interface CommonStatItemProps {
  $variant?: 'default' | 'card' | 'inline';
}

// ========================================
// 애니메이션 통계 표시 컴포넌트
// ========================================

export const CommonStatItem = styled(motion.div)<CommonStatItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'card':
        return `
          padding: ${theme.spacing[4]};
          background: ${theme.colors.background.primary};
          border-radius: ${theme.borderRadius.lg};
          border: 1px solid ${theme.colors.border.light};
          box-shadow: ${theme.shadows.card};
        `;
      case 'inline':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          background: ${theme.colors.background.secondary};
          border-radius: ${theme.borderRadius.md};
        `;
      default:
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
          background: ${theme.colors.background.primary};
          border-radius: ${theme.borderRadius.lg};
          border: 1px solid ${theme.colors.border.light};
        `;
    }
  }}

  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  .stat-content {
    .stat-number {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
      color: ${({ theme }) => theme.colors.text.primary};
      line-height: 1;
      margin-bottom: ${({ theme }) => theme.spacing[1]};
    }

    .stat-label {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      color: ${({ theme }) => theme.colors.text.secondary};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    }
  }
`;
