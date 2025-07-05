import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const cardVariants = {
  default: css`
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `,
  
  elevated: css`
    background: white;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  `,
  
  outlined: css`
    background: white;
    border: 2px solid #e5e7eb;
    box-shadow: none;
  `,
  
  ghost: css`
    background: transparent;
    border: none;
    box-shadow: none;
  `
};

const cardPaddings = {
  none: css`padding: 0;`,
  sm: css`padding: 16px;`,
  md: css`padding: 24px;`,
  lg: css`padding: 32px;`
};

const CardContainer = styled(motion.div)<CardProps>`
  border-radius: 12px;
  transition: all 0.2s ease;
  
  ${({ variant = 'default' }) => cardVariants[variant]}
  ${({ padding = 'md' }) => cardPaddings[padding]}
  
  ${({ hoverable }) => hoverable && css`
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  `}
  
  ${({ clickable }) => clickable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const CardHeader = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
`;

const CardBody = styled.div`
  flex: 1;
`;

const CardFooter = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  className,
  onClick,
  header,
  footer
}) => {
  return (
    <CardContainer
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={clickable}
      className={className}
      onClick={onClick}
      whileHover={hoverable || clickable ? { y: -2 } : undefined}
      whileTap={clickable ? { y: 0 } : undefined}
    >
      {header && <CardHeader>{header}</CardHeader>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};