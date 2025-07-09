import { useCallback } from "react";
import React from "react";
import { StyledNavItem } from "../styles";

export const NavItem = React.memo<{
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  isActive: boolean;
  isOpen: boolean;
  onClick: (path: string, action?: string) => void;
  action?: string;
}>(function SideNavItem({ 
  path, label, icon: Icon, isActive, isOpen, onClick, action 
}) { 
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClick(path, action);
  }, [path, action, onClick]);

  return (
    <StyledNavItem $isActive={isActive} $isOpen={isOpen}>
      <a href="#" onClick={handleClick}>
        <Icon className="nav-icon" size={20} />
        <span className="nav-label">{label}</span>
      </a>
    </StyledNavItem>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.path === nextProps.path &&
    prevProps.label === nextProps.label &&
    prevProps.isOpen === nextProps.isOpen
  );
});
