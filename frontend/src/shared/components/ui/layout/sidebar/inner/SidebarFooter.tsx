import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { BottomSection } from '../styles';

interface SidebarFooterProps {
  isOpen: boolean;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isOpen,
  isDarkTheme,
  onThemeToggle,
}) => {
  return (
    <BottomSection $isOpen={isOpen}>
      <button className="theme-toggle" onClick={onThemeToggle}>
        {isDarkTheme ? (
          <Sun className="theme-icon" />
        ) : (
          <Moon className="theme-icon" />
        )}
        <span className="theme-label">
          {isDarkTheme ? '라이트 모드' : '다크 모드'} | 공사중
        </span>
      </button>
    </BottomSection>
  );
};