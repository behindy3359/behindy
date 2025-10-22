import { useCallback, useState } from "react";
import React from "react";
import { ChevronDown } from "lucide-react";
import { StyledNavItem, SubMenuContainer, SubMenuItem } from "../styles";
import type { NavigationItem } from "../types";

export const NavItem = React.memo<{
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  isActive: boolean;
  isOpen: boolean;
  onClick: (path: string, action?: string) => void;
  action?: string;
  subMenuItems?: NavigationItem[];
}>(function SideNavItem({
  path, label, icon: Icon, isActive, isOpen, onClick, action, subMenuItems
}) {
  const [isExpanded, setIsExpanded] = useState(isActive);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    if (subMenuItems && subMenuItems.length > 0) {
      setIsExpanded(prev => !prev);
      onClick(subMenuItems[0].path, action);
    } else {
      onClick(path, action);
    }
  }, [path, action, onClick, subMenuItems]);

  const handleSubMenuClick = useCallback((e: React.MouseEvent, subPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(subPath);
  }, [onClick]);

  const hasSubMenu = subMenuItems && subMenuItems.length > 0;

  return (
    <>
      <StyledNavItem $isActive={isActive} $isOpen={isOpen} $hasChildren={hasSubMenu}>
        <a href="#" onClick={handleClick}>
          <Icon className="nav-icon" size={20} />
          <span className="nav-label">{label}</span>
          {hasSubMenu && (
            <ChevronDown
              className="chevron-icon"
              size={16}
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          )}
        </a>
      </StyledNavItem>

      {hasSubMenu && isExpanded && (
        <SubMenuContainer $isOpen={isOpen}>
          {subMenuItems.map((child) => (
            <SubMenuItem
              key={child.path}
              $isActive={child.isActive || false}
              $isOpen={isOpen}
            >
              <a href="#" onClick={(e) => handleSubMenuClick(e, child.path)}>
                {child.icon && <child.icon className="sub-icon" size={16} />}
                <span className="sub-label">{child.label}</span>
              </a>
            </SubMenuItem>
          ))}
        </SubMenuContainer>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.path === nextProps.path &&
    prevProps.label === nextProps.label &&
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.subMenuItems === nextProps.subMenuItems
  );
});
