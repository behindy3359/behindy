import { gradients } from "@/styles/theme";
import { motion } from "framer-motion";
import styled from "styled-components";

export const SidebarContainer = styled(motion.aside).withConfig({
  shouldForwardProp: (prop) => !['$isOpen', '$isMobile'].includes(prop),
})<{ $isOpen: boolean; $isMobile: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: ${gradients.primary};
  color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  
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
  
  @media (min-width: 768px) {
    width: ${({ $isOpen }) => ($isOpen ? '280px' : '60px')};
    transition: width 0.3s ease;
  }
  
  @media (max-width: 767px) {
    width: ${({ $isOpen }) => ($isOpen ? '280px' : '0px')};
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: all 0.3s ease;
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
  z-index: 999;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  
  @media (min-width: 768px) {
    display: none;
  }
`;

export const HeaderSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? 'space-between' : 'center')};
  min-height: 80px;
  flex-shrink: 0;
`;

export const BrandLogo = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  gap: 12px;
  
  .logo {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 800;
  }
  
  .brand-name {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

export const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  @media (max-width: 767px) {
    position: absolute;
    right: 20px;
    top: 22px;
  }
`;

export const NavigationSection = styled.nav.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  flex: 1;
  padding: 20px 0;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 767px) {
    display: flex;
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

export const StyledNavItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isActive', '$isOpen'].includes(prop),
})<{ $isActive: boolean; $isOpen: boolean }>`
  margin: 0 12px;
  
  a {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    
    ${({ $isActive }) =>
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
        background: white;
        border-radius: 0 2px 2px 0;
      }
    `}
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }
    
    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .nav-label {
      font-size: 14px;
      font-weight: 500;
      opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
      transition: opacity 0.2s ease;
      white-space: nowrap;
      
      @media (max-width: 767px) {
        opacity: 1;
      }
    }
  }
`;


export const AccountSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  
  @media (max-width: 767px) {
    display: flex;
  }
`;

export const BottomSection = styled.div.withConfig({
  shouldForwardProp: (prop) => !['$isOpen'].includes(prop),
})<{ $isOpen: boolean }>`
  padding: 20px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  flex-shrink: 0;
  
  @media (max-width: 767px) {
    display: block;
  }
  
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    justify-content: flex-start;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    
    .theme-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .theme-label {
      font-size: 14px;
      font-weight: 500;
    }
  }
`;
