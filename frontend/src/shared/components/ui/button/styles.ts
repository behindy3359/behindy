import { motion } from "framer-motion";
import styled from "styled-components";
import { ButtonProps } from "./types";
import { gradients } from '@/styles/theme';

export const StyledButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => 
    !['variant', 'size', 'isLoading', 'fullWidth', 'leftIcon', 'rightIcon'].includes(prop)
})<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-family: inherit;
  
  /* Size variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.sm};
          line-height: 1.25;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[8]};
          font-size: ${theme.typography.fontSize.base};
          line-height: 1.5;
        `;
      default:
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.sm};
          line-height: 1.25;
        `;
    }
  }}

  /* Color variants (theme 기반) */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${gradients.primary};
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.button};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.buttonHover};
            background: ${gradients.primaryHover};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.button};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.background.secondary};
          color: ${theme.colors.text.secondary};
          border-color: ${theme.colors.border.medium};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.background.tertiary};
            border-color: ${theme.colors.border.dark};
            color: ${theme.colors.text.primary};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.border.medium};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary[500]};
          border-color: ${theme.colors.primary[500]};
          
          &:hover:not(:disabled) {
            background: rgba(102, 126, 234, 0.1);
            color: ${theme.colors.primary[600]};
            border-color: ${theme.colors.primary[600]};
          }
          
          &:active:not(:disabled) {
            background: rgba(102, 126, 234, 0.2);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.text.secondary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.background.secondary};
            color: ${theme.colors.text.primary};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.background.tertiary};
          }
        `;
      case 'destructive':
        return `
          background: linear-gradient(135deg, ${theme.colors.error} 0%, #dc2626 100%);
          color: ${theme.colors.text.inverse};
          box-shadow: 0 4px 14px 0 rgba(239, 68, 68, 0.3);
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px 0 rgba(239, 68, 68, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px 0 rgba(239, 68, 68, 0.3);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
          color: ${theme.colors.text.inverse};
          box-shadow: ${theme.shadows.button};
          
          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.buttonHover};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${theme.shadows.button};
          }
        `;
    }
  }}

  /* Full width */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Loading state */
  ${({ isLoading }) => isLoading && `
    cursor: wait;
    
    .button-content {
      opacity: 0.7;
    }
  `}
`;

export const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LoadingSpinner = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
`;