import { motion } from "framer-motion";
import styled from "styled-components";
import { 
  FlexContainer, 
  BaseButton 
} from '@/shared/styles/components';

export const SidebarContainer = styled(motion.aside).withConfig({
  shouldForwardProp: (prop) => !['$isOpen', '$isMobile'].includes(prop),
})<{ $isOpen: boolean; $isMobile: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  color: ${({ theme }) => theme.colors.text.inverse};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.dropdown};
  overflow: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 280px;
  }
`;

export const SidebarOverlay = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['$visible'].includes(prop),
})<{ $visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.fixed - 1};
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  
  @supports (backdrop-filter: blur(4px)) {
    backdrop-filter: blur(4px);
    background: rgba(0, 0, 0, 0.3);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const HeaderSection = styled(FlexContainer).withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: ${({ $isOpen }) => ($isOpen ? 'space-between' : 'center')};
  align-items: center;
  min-height: 80px;
  flex-shrink: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
`;

export const BrandLogo = styled(FlexContainer).withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  transition: ${({ theme }) => theme.transition.normal};
  cursor: pointer;
  user-select: none;

  &:hover .logo {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active .logo {
    transform: scale(0.98);
  }

  .logo {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
    transition: ${({ theme }) => theme.transition.fast};
  }

  .brand-name {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    letter-spacing: -0.5px;
    color: ${({ theme }) => theme.colors.text.inverse};
    transition: ${({ theme }) => theme.transition.fast};
  }

  &:hover .brand-name {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

export const ToggleButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: ${({ theme }) => theme.colors.text.inverse};
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};
  flex-shrink: 0;
  padding: 0;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: absolute;
    right: ${({ theme }) => theme.spacing[6]};
    top: 22px;
  }
`;

export const MobileFloatingButton = styled(BaseButton).withConfig({
  shouldForwardProp: (prop) => !['$isVisible'].includes(prop),
})<{ $isVisible: boolean }>`
  position: fixed;
  top: 16px;
  left: 16px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  border: none;
  color: ${({ theme }) => theme.colors.text.inverse};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: ${({ $isVisible }) => ($isVisible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: ${({ theme }) => theme.zIndex.fixed - 2};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: ${({ theme }) => theme.transition.fast};
  padding: 0;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(${({ theme }) => theme.colors.primary[500]}, 0.3);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const NavigationSection = styled.nav.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]} 0;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  overflow-y: auto;
  overflow-x: hidden;
  
  mask-image: linear-gradient(to bottom, 
    transparent 0px,
    black 20px,
    black calc(100% - 20px),
    transparent 100%
  );
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    mask-image: none;
  }
`;

export const StyledNavItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isActive', '$isOpen', '$hasChildren'].includes(prop),
})<{ $isActive: boolean; $isOpen: boolean; $hasChildren?: boolean }>`
  margin: 0 ${({ theme }) => theme.spacing[3]};

  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.text.inverse};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    transition: ${({ theme }) => theme.transition.fast};
    position: relative;
    overflow: hidden;
    
    ${({ $isActive, $hasChildren, theme }) =>
      $isActive &&
      `
      background: rgba(255, 255, 255, 0.15);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 24px;
        background: ${theme.colors.text.inverse};
        border-radius: 0 2px 2px 0;
      }

      ${!$hasChildren ? `
        &::after {
          content: '';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
        }
      ` : ''}
    `}
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
      
      ${({ $isActive }) =>
        !$isActive &&
        `
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 16px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 0 1px 1px 0;
          transition: all 0.2s ease;
        }
      `}
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    
    &:hover .nav-icon {
      transform: scale(1.1);
    }
    
    .nav-label {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
      transition: opacity 0.2s ease;
      white-space: nowrap;
      flex: 1;

      @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        opacity: 1;
      }
    }

    .chevron-icon {
      margin-left: auto;
      flex-shrink: 0;
      opacity: 0.7;
    }
  }
`;

export const SubMenuContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  margin: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  margin-left: ${({ theme }) => theme.spacing[6]};
  padding-left: ${({ theme }) => theme.spacing[4]};
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

export const SubMenuItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isActive', '$isOpen'].includes(prop),
})<{ $isActive: boolean; $isOpen: boolean }>`
  a {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.text.inverse};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    transition: ${({ theme }) => theme.transition.fast};
    position: relative;
    opacity: 0.85;

    ${({ $isActive, theme }) =>
      $isActive &&
      `
      background: rgba(255, 255, 255, 0.1);
      opacity: 1;
      font-weight: ${theme.typography.fontWeight.semibold};

      &::after {
        content: '';
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
      }
    `}

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      opacity: 1;
      transform: translateX(2px);
    }

    .sub-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .sub-label {
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      white-space: nowrap;
      opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
      transition: opacity 0.2s ease;

      @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        opacity: 1;
      }
    }
  }
`;

export const AccountSection = styled(FlexContainer).withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.secondary[500]} 100%);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

export const BottomSection = styled(FlexContainer).withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[4]};
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: ${({ theme }) => theme.colors.text.inverse};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    cursor: pointer;
    transition: ${({ theme }) => theme.transition.fast};
    width: 100%;
    justify-content: flex-start;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }
    
    .theme-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }
    
    &:hover .theme-icon {
      transform: rotate(20deg) scale(1.1);
    }
    
    .theme-label {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
      opacity: 0.9;
    }
  }
`;