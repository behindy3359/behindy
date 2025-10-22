import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { BottomSection, VersionInfo } from '../styles';

interface SidebarFooterProps {
  isOpen: boolean;
  isDarkTheme?: boolean;
  onThemeToggle?: () => void;
}

const APP_VERSION = 'v1.0.001';

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isOpen,
  isDarkTheme,
  onThemeToggle,
}) => {
  return (
    <BottomSection $isOpen={isOpen}>
      {onThemeToggle && (
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
      )}
      {isOpen && (
        <VersionInfo>
          {APP_VERSION}
        </VersionInfo>
      )}
    </BottomSection>
  );
};